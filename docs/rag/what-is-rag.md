---
title: RAG 是开卷考试，不是给模型装外挂
description: 用开卷考试的比喻讲清 RAG 为什么存在、由哪六个环节组成，以及什么时候压根不该用它。
---

# RAG 是开卷考试，不是给模型装外挂

晚上十一点半，你第四次刷新内部知识库问答页，显示器照得脸有点发烫。你问「今年的报销要走几道审批」，它回了一段语气特别自信、格式特别工整、连标点都挑不出毛病的废话——「根据公司相关规定，建议咨询财务部门」。你把鼠标挪到底下那行引用，发现它引用的是 2021 年那份早被废止的制度。那一刻你最想问的不是答案，是「它到底看了什么」。

**先给答案**：RAG（Retrieval-Augmented Generation，检索增强生成）就是让模型开卷考试——先从你的资料里翻出几页摊在桌上，再让它照着写。它不改变模型的脑子，只改变它手边有什么。而「它到底看了什么」，恰恰是 RAG 唯一比裸模型多给的东西：**可追溯的证据**。

<PipelineMap />

## RAG 不是一种模型，是一条证据供应链

这个说法源自 Lewis 等人 2020 年的论文 [*Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks*](https://arxiv.org/abs/2005.11401)：把参数化记忆（模型权重里背下来的东西）和非参数化记忆（可随时替换的文档索引）拼在一起，让生成过程「查得到」。论文当年用的是 DPR 检索器加 BART 生成器，架构细节今天已经换了好几代，但那个分工没变过：**模型负责组织语言，检索负责提供依据**。

于是你会看到一件有点反直觉的事：RAG 系统里最贵的模型，往往不是决定答案对不对的那个。答案对不对，在它被送进模型之前就大体定下来了——如果候选块里压根没有那条报销规则，让 GPT-4 还是让一个 7B 小模型来写，区别只是把「我不知道」说得更委婉，还是更铿锵。想系统看一遍这个领域的发展，可以读 Gao 等人的综述 [*Retrieval-Augmented Generation for Large Language Models: A Survey*](https://arxiv.org/abs/2312.10997)，它把 Naive RAG / Advanced RAG / Modular RAG 三代整理得很清楚；中文脉络则可看 [Datawhale 的开源教程](https://github.com/datawhalechina) 与 [WaytoAGI 的中文知识库](https://www.waytoagi.com/)。

<div class="mp-split">
  <div class="myth"><h4>常见误解</h4><p>「接了向量库 = 做了 RAG」「换个更大的模型 = 效果会变好」「chunk_size 调对了就没事了」。这三句话的共同点：都把系统当成了一个开关，而不是一条链。</p></div>
  <div class="fact"><h4>证据口径</h4><p>检索失败时，生成模型再强也没有可用依据；Barnett 等人在 2024 年对三个真实 RAG 案例做的故障复盘 <a href="https://arxiv.org/abs/2401.05856"><em>Seven Failure Points</em></a> 里，把「缺内容」「没召回」「没排进上下文」「没被提取」分成了不同环节的独立故障，而非一个笼统的「效果不好」。</p></div>
</div>

## 六个环节各自只回答一个问题

把 RAG 拆开看，其实是一串非常朴素的判断题。切分问「证据该长什么样」，索引问「按什么方式存才能被找到」，召回问「候选从哪儿捞」，重排问「谁配站第一位」，生成问「这些证据怎么用」，评测问「刚才到底是哪一步坏了」。每一步都可以单独换零件、单独测、单独背锅——这是它比「微调一个模型」更适合工程落地的原因：出了事你知道该拆哪儿。

<div class="mp-steps">
  <div class="mp-step"><b>离线建库</b><span>文档 → 清洗 → <strong>切分</strong> → 编码 → <strong>索引</strong>入库。这一步做错，后面在线环节再努力也是在一堆残缺证据里挑。</span></div>
  <div class="mp-step"><b>在线找证据</b><span>问题 → 编码 → <strong>召回</strong>候选 → <strong>重排</strong>。原则是先求全（别把答案漏掉），再求准（别把噪声塞进去）。</span></div>
  <div class="mp-step"><b>在线出答案</b><span>问题 + 排序后的证据 → prompt → <strong>生成</strong>带引用的回答 → 必要时拒答。</span></div>
  <div class="mp-step"><b>横着切一刀</b><span><strong>评测</strong>贯穿全链路：分别测「检索到的块对不对」和「答案有没有照着块说」，才能定位故障。</span></div>
</div>

<PipelineMap />

## 有些需求根本不该上 RAG

先泼一盆温水：如果你要的是「把一段 200 字的用户评论归成正面/负面」，或者「按固定模板写一封格式邮件」，检索帮不上什么忙，它只会给链路增加延迟和故障点。RAG 适合的是三类场景：**知识会变**（价格、制度、库存，微调一次就过期）、**知识是私有的**（模型训练时没见过你公司的报销规则）、**答案要能被追责**（必须指出处，尤其在法务、医疗信息、客服工单里）。

反过来，如果问题的答案需要跨几十份文档做汇总推理，朴素 RAG 也会很吃力——它能捞回「相关片段」，但不负责替你做全局归纳。这类需求后来长出了 [Microsoft GraphRAG](https://github.com/microsoft/graphrag)（论文见 [arXiv:2404.16130](https://arxiv.org/abs/2404.16130)）这种先建实体图、再做社区摘要的路子；也有 [Self-RAG](https://arxiv.org/abs/2310.11511) 让模型自己决定「要不要检索、检索结果有没有用」。它们的共同点是：**先把朴素链路跑通，再往上加判断**，否则你连是检索坏了还是判断坏了都分不清。成本上也要诚实：每加一步就是一次额外的模型调用和一段延迟，Anthropic 在 [Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval) 里专门提到用 prompt caching 把上下文增强的开销压下来（该文口径为 Anthropic 自有评测集上的实验，不是跨任务通用结论）。

<div class="mp-band">
  <p class="mp-eyebrow">判断清单</p>
  <h2 class="mp-h2" style="font-size:1.5rem">先问这四句，再决定接不接向量库</h2>
  <div class="mp-band-grid">
    <div class="mp-band-card"><h3>知识会不会变？</h3><p>会变才需要「换文档即换知识」；不变的话，写进 prompt 或微调更省事。</p></div>
    <div class="mp-band-card"><h3>答案要不要出处？</h3><p>要出处，RAG 几乎是最便宜的方案；不要出处，先想想检索是不是纯负担。</p></div>
    <div class="mp-band-card"><h3>问题是不是找片段？</h3><p>「X 是多少」适合；「综观全年趋势」需要额外做汇总或 GraphRAG。</p></div>
    <div class="mp-band-card"><h3>有没有评测集？</h3><p>没有的话，先攒 30–50 条真实问题与标准答案，否则后面每一步都在盲调。</p></div>
  </div>
</div>

<p class="gs-cap">上面四个问题构成一张取舍表：知识会变、要出处、找片段、有评测集，四条都占或占前三条时，RAG 才是那个省事的解法。</p>

## 这一站怎么讲：不背参数，看数据怎么流

后面每一章都按同一套节奏：一个具体到有点狼狈的场景开场，先给两三句答案，然后讲清这一环的**输入是什么、输出是什么、坏了会怎样、怎么单独验证**。每章都配 SVG 图，图表结论写在图下的说明句里（听书时会自动跳过图形，不念坐标轴）。最后一章给你一个浏览器里就能点的流水线和一份能自己跑的 Python 代码——毕竟「看懂了」和「跑起来了」之间，通常隔着一个周末。

<p class="mp-quote">模型说得像不像，是生成的事；模型凭什么这么说，是检索的事。RAG 的全部工作，就是把「凭什么」钉在纸面上。</p>

<div class="mp-grid">
  <a class="mp-card tone-coral" href="./chunking.html"><h3>接着读 · 切分</h3><p>第一刀切歪，后面五个环节都在替它还债。</p><span class="mp-go">01 切分 →</span></a>
  <a class="mp-card tone-blue" href="./indexing.html"><h3>接着读 · 索引</h3><p>向量到底存了什么，以及 BM25 为什么还没退休。</p><span class="mp-go">02 索引 →</span></a>
  <a class="mp-card" href="./runnable.html"><h3>接着读 · 跑起来</h3><p>等不及了？直接去点那条能动的流水线。</p><span class="mp-go">动手 →</span></a>
</div>
