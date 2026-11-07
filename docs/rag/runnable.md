---
title: 一条能跑起来的最小 RAG 流水线
description: 先在浏览器里点着玩完整链路，再给一份仅用标准库、可直接运行的 Python 最小实现与逐环验收门。
---

# 一条能跑起来的最小 RAG 流水线

周日下午两点，你终于把六章都翻完了，脑子里飘着 chunk、HNSW、RRF、cross-encoder 一串词，像刚看完一本讲游泳的书，脚还没沾水。这时候最需要的不是再读一篇综述，是**让数据当着你的面流一遍**：从一段文档变成几块，从几块变成几个向量，从一个问题变成一份候选名单，再变成一句带出处的回答。

**先给答案**：这一页给两个东西。上面是一个浏览器里就能点的流水线（切分 → 索引 → 召回 → 重排 → 生成），下面是一份只用 Python 标准库、复制粘贴就能跑的最小实现。两者都不需要 API Key、不需要向量数据库、不需要装任何包——因为 RAG 首先是**数据怎么流**，其次才是用哪家组件。

## 先点一遍：换问题、换切法、看第一名换人

<RagPipelineDemo />

建议按这个顺序玩，每一步都在验证一章的结论：

1. 用默认问题「打印机卡纸了怎么办」，看召回名单里 `#5.x` 是不是靠前，以及生成结果有没有带 `【来源】`。
2. 把切法从「按句切」切到「整篇不切」，观察候选块数量与分数变化——证据变长之后，噪声也跟着进来了。
3. 切换「只开稠密 / 混合」，看名单怎么变；再打开/关闭重排，看第一名会不会换人。
4. 把问题改成「报销要几天」，确认答案换成了报销那块；再改成「外星人几点下班」，看它会不会老老实实说不知道。最后那个不是彩蛋，是[生成环节](./generation)的一等公民功能。

## 再来一份只有标准库的 Python：复制就能跑

下面这份 `rag_min.py` 把整条链路摊开成六个编号步骤，刻意不用任何框架：查询改写补口语、切分按句子聚合、索引是字符二元组词频向量、召回是余弦相似度 + 关键词混合、重排按词面覆盖、生成只对够格的证据做抽取式拼接并带引用。注意 `REWRITE` 里那条「几天 → 工作日 到账」：玩具向量不懂「几天」等于「五个工作日」，所以这半步得由查询改写补上；真实系统里换成 LLM 改写或 HyDE，别把这张小抄当产品逻辑。**它是教学用的可运行骨架，不是生产实现**——生产里请把 `to_vec` 换成嵌入模型、把线性扫描换成 ANN 索引、把抽取式生成换成 LLM，但函数的输入输出保持不变，就能一个一个换零件。

```python
# rag_min.py  ——  python rag_min.py    仅用标准库
import re
from collections import Counter

DOCS = [
    {"id": 1, "title": "茶水间", "text": "咖啡机每天早上八点自动清洗，滤芯每两个月更换一次。更换滤芯后长按红色按钮三秒复位。"},
    {"id": 2, "title": "报销", "text": "报销需在飞书提交电子发票，金额超过 2000 元要部门总监与财务双审。材料齐全后一般五个工作日到账。"},
    {"id": 3, "title": "会议室", "text": "会议室 A 的投影仪支持 USB-C 直连，HDMI 转接头放在前台第二个抽屉。借用转接头需要在前台登记。"},
    {"id": 4, "title": "年假", "text": "入职满一年有五天年假，满十年增加到十天。年假当年有效，不跨年累积。"},
    {"id": 5, "title": "打印机", "text": "三楼东侧的打印机经常卡纸，卡纸时先开前盖取出纸屑，再按面板上的继续键。反复卡纸就找行政小陈报修。"},
]

# 00 查询改写：极简规则玩具，真实系统换成 LLM 改写 / HyDE
REWRITE = {"几天": "工作日 到账", "多久": "工作日 到账", "怎么办": "处理 办法"}

def rewrite(query):
    extra = [v for k, v in REWRITE.items() if k in query]
    return query + (" " + " ".join(extra) if extra else "")

# 01 切分：按句子边界聚合，尽量不把一句话劈成两半
def chunk(docs, max_chars=48):
    out = []
    for d in docs:
        buf, n = "", 0
        for s in re.split(r"(?<=[。；])", d["text"]):
            s = s.strip()
            if not s:
                continue
            if buf and len(buf) + len(s) > max_chars:
                n += 1
                out.append({"id": f"{d['id']}.{n}", "title": d["title"], "text": buf})
                buf = s
            else:
                buf += s
        if buf:
            n += 1
            out.append({"id": f"{d['id']}.{n}", "title": d["title"], "text": buf})
    return out

# 02 索引：字符二元组词频向量（教学玩具，替代嵌入模型）
def grams(text):
    t = re.sub(r"[\s，。、：；？！0-9]", "", text)
    return Counter(t[i:i + 2] for i in range(len(t) - 1))

def to_vec(text):
    return grams(text)

def cos(a, b):
    dot = sum(v * b.get(k, 0) for k, v in a.items())
    na = sum(v * v for v in a.values()) ** 0.5
    nb = sum(v * v for v in b.values()) ** 0.5
    return dot / (na * nb) if na and nb else 0.0

# 03 召回：稠密（语义近似）+ 稀疏（词面命中）混合
def retrieve(query, index, k=4, hybrid=True):
    qv, qg = to_vec(query), grams(query)
    hits = []
    for c in index:
        dense = cos(qv, to_vec(c["text"]))
        kw = sum(qg[g] > 0 for g in qg if grams(c["text"])[g] > 0) / max(len(qg), 1)
        score = dense * 0.7 + kw * 0.6 if hybrid else dense
        hits.append({**c, "dense": dense, "kw": kw, "score": score})
    return sorted(hits, key=lambda x: -x["score"])[:k]

# 04 重排：换个更严的尺子，把词面覆盖高的挪到前面
def rerank(hits):
    return sorted(hits, key=lambda x: -(x["kw"] * 0.7 + x["dense"] * 0.3))

# 05 生成：只用够格的证据，抽取式拼接 + 引用；证据不足就拒答
def generate(query, hits):
    usable = [h for h in hits if h["kw"] >= 0.08]
    if not usable:
        return "资料里没找到依据，我不知道。"
    parts = [f"{h['text']}【来源 {h['id']} · {h['title']}】" for h in usable[:2]]
    return "根据资料：" + " ".join(parts)

def ask(query, index):
    rq = rewrite(query)
    hits = rerank(retrieve(rq, index))
    print(f"\nQ: {query}" + (f"  → 查询改写：{rq}" if rq != query else ""))
    for h in hits:
        print(f"   #{h['id']} {h['score']:.3f}  {h['text'][:24]}…")
    print("A:", generate(query, hits))

if __name__ == "__main__":
    index = chunk(DOCS)
    print(f"索引完成：{len(index)} 块")
    ask("打印机卡纸了怎么办", index)
    ask("报销要几天", index)
    ask("外星人几点下班", index)
```

跑起来你会看到三条问题各自的候选分数与答案，第三条触发拒答。想接真模型时，只改两个函数就够了：`to_vec` 换成 [OpenAI embeddings](https://platform.openai.com/docs/guides/embeddings) 或 [BGE](https://github.com/FlagOpen/FlagEmbedding) 返回的向量，`generate` 换成一次带证据编号的 chat completion（[OpenAI Cookbook 的 RAG 示例](https://cookbook.openai.com/) 有现成写法）；需要省事就把整套函数替换成 [LlamaIndex 的 ingestion + query pipeline](https://docs.llamaindex.ai/en/stable/) 或 [LangChain 的 RAG 教程](https://python.langchain.com/docs/tutorials/rag/)。**接口不变，环节点点可换**——这就是按环节搭系统的回报。

## 每个环节配一道验收门

「能跑」和「跑对了」之间差的就是这四道门。它们的共同点是：只测本环、不惊动下游，所以出问题时不用全链路排查。

<table class="src-table">
  <thead><tr><th>环节</th><th>验收门</th><th>不通过时回头改什么</th></tr></thead>
  <tbody>
    <tr><td>切分</td><td>抽 20 块肉眼检查：是否自带主语、条件、时间；固定问题集测 recall@10</td><td>换边界规则（句子 / 标题 / 表格行）、加标题继承、改解析</td></tr>
    <tr><td>索引</td><td>查询与文档同模型同前缀；元数据齐全；重复灌库不产生重复 ID</td><td>统一指令前缀、补生效日期与权限标签、修 upsert 流程</td></tr>
    <tr><td>召回</td><td>固定问题集上 recall@k 达标，且无答案问题不会硬凑高分</td><td>加查询改写、混合召回、元数据过滤；先别动 k 以外的东西</td></tr>
    <tr><td>重排 + 生成</td><td>top-3 命中率、忠实度、引用可核对率、该拒答时拒答</td><td>改候选数量与摆放顺序、收紧输出契约、加相关性阈值</td></tr>
  </tbody>
</table>

## 往上叠功能的顺序，比参数更重要

到这一步你已经有了一条闭环。接下来常见的诱惑是「一口气把 Self-RAG、GraphRAG、多模态、Agent 全接上」，然后花一周找是哪一环坏的。稳一点的顺序是：**先把评测集补到覆盖真实分布 → 加混合召回 → 加重排 → 加查询改写 → 再考虑上下文增强 / 父子块 → 最后才碰自适应检索与图结构**。每一步都跑一遍同一批问题，指标掉了就回滚。[Self-RAG](https://arxiv.org/abs/2310.11511)、[Corrective RAG](https://arxiv.org/abs/2401.15884)、[GraphRAG](https://arxiv.org/abs/2404.16130) 这些工作解决的都是「朴素链路跑通之后」的问题，不是「链路还没通」的救命药。

<RagFlow />

<p class="mp-quote">RAG 不是一堆要背的参数，是一条每个接头都能拧开检查的管子；能跑起来，才谈得上把它跑好。</p>

<div class="mp-grid">
  <a class="mp-card tone-coral" href="./resources.html"><h3>接着读 · 资源地图</h3><p>论文、文档、中文社区与开源项目，全部带链接。</p><span class="mp-go">资源 →</span></a>
  <a class="mp-card tone-blue" href="./evaluation.html"><h3>回看 · 评测</h3><p>验收门的指标口径都在这里。</p><span class="mp-go">06 评测 ←</span></a>
  <a class="mp-card" href="./what-is-rag.html"><h3>回看 · 全局</h3><p>再站远一点，看六个环节怎么咬合。</p><span class="mp-go">00 认识 RAG ←</span></a>
</div>
