---
title: 召回：先求别漏，再求别吵
description: 讲透稠密、稀疏与混合召回的分工、RRF 融合为什么比名次、查询改写与 HyDE，以及只用 recall@k 验收召回。
---

# 召回：先求别漏，再求别吵

上线第一天上午十点，运营同学在群里甩来一句「那个…就红色的那台机器，卡住了怎么弄」，后面跟了个截图。你的系统非常努力地把「红色」「机器」编码成向量，热情地返回了消防栓使用规范、红色马克杯领用说明，以及三条咖啡机滤芯教程。用户问的其实是三楼那台打印机的红色报错灯。**答案在库里，只是从没进过候选名单**——后面再好的重排模型也只能在四份不相关的材料里选冠军。

**先给答案**：召回（retrieval）是整条链里唯一「不可逆」的一步。生成可以重写，重排可以重排，但候选里没有的东西，后面永远变不出来。所以召回阶段的 KPI 只有一个：**该找的块在不在前 k 个里**（recall@k），而不是「第一名准不准」。准不准，是下一环重排的活。

<HybridFuse />

## 稠密和稀疏各有盲区，混合不是凑热闹

稠密召回靠向量相似度，擅长「换个说法也对」：用户说「报销啥时候能到钱」，能找到「五个工作日到账」。它的盲区是精确符号——型号、错误码、条款编号，在语义空间里几乎等价成一团噪声。稀疏召回（BM25 之类）正好反过来：词面对上了就给高分，换个同义说法直接失灵。

两路结果分数不在一个量纲（一个是 0–1 的余弦，一个是几十的 BM25 打分），硬加权等于拿体温和血压求平均。工程上更稳的是 [RRF（Reciprocal Rank Fusion）](https://dl.acm.org/doi/10.1145/1571941.1572114)（Cormack 等人 2009 年提出）：**不比分数，比名次**，一个块在每路里的排名取倒数再相加，两路都靠前的自然胜出。常见常数 60 是用来压住头部名次的经验项，属于实现惯例，不是什么玄学最优解。[Qdrant 的 hybrid queries 文档](https://qdrant.tech/documentation/concepts/hybrid-queries/) 和 [Weaviate 的 hybrid search 文档](https://docs.weaviate.io/weaviate/search/hybrid) 都有可跑的例子，[Elasticsearch 的 RRF](https://www.elastic.co/docs/reference/query-languages/query-dsl/query-dsl-rrf) 也已内置。

<div class="mp-split">
  <div class="myth"><h4>常见误解</h4><p>「top-k 调大就能提高准确率」「混合检索一定更好」「召回直接用最终答案评估」。第一句只提高召回、同时塞进噪声；第二句要看语料里有没有专名；第三句会把生成的锅也算到检索头上。</p></div>
  <div class="fact"><h4>证据口径</h4><p>Gao 等人的 <a href="https://arxiv.org/abs/2312.10997">RAG 综述</a> 把「查询改写 / 多路召回 / 融合」归在 Advanced RAG 一类，理由是它们改的是检索输入与候选集，不动模型权重；这类方法的收益高度依赖问题分布，所以要用自己的问题集测，而不是抄别人的 k。</p></div>
</div>

## 先把问题修好，再怪检索不行

真实用户很少像评测集那样说话。他们打省略号、用指代词、把三个问题塞进一句、还带错别字。「那个…红色的机器怎么弄」缺了主语、缺了设备名、缺了故障类型，任何嵌入模型都很难凭空补出来。于是有了三类在召回**之前**动手的招：

<div class="mp-steps">
  <div class="mp-step"><b>查询改写</b><span>让 LLM 把口语问题补成完整查询：「三楼打印机红色报错灯卡纸如何处理」。多轮对话里还必须先做指代消解，把「它」「那个」换成实体。<a href="https://python.langchain.com/docs/how_to/MultiQueryRetriever/">LangChain 的 MultiQueryRetriever</a> 会把一个问题改写成多个角度并行检索。</span></div>
  <div class="mp-step"><b>HyDE</b><span>先让模型根据问题「编一段假想答案」，再用假想答案的向量去检索真文档。听起来像拿幻觉找真相，但 Gao 等人 2022 年的 <a href="https://arxiv.org/abs/2212.10496">论文</a> 说明：假答案在语义上更接近真答案所在的文档，比短问题更好定位。</span></div>
  <div class="mp-step"><b>路由与过滤</b><span>先判断问题属于哪个部门/时间范围/文档类型，再在对应子集里检索。<a href="https://docs.llamaindex.ai/en/stable/module_guides/querying/router/">LlamaIndex 的 router 文档</a> 和前面提过的元数据过滤都是这条路，能顺手解决「2019 版制度」乱入的问题。</span></div>
</div>

## 召回失败的两种死法，症状完全不一样

第一种叫**词面差异**：答案块在库里、向量也在，但用户用的词和文档用的词毫无交集（「到钱」vs「到账」「报销」「打款」）；改嵌入模型、加查询改写、上 HyDE 能缓解。第二种叫**粒度不匹配**：答案不是某一段，而是散在五份月报里的一行数字；这时候怎么调 k 都没用，得回去改切分、加汇总层，或者用 [GraphRAG](https://github.com/microsoft/graphrag) 那类先建图再摘要的结构。把这两种都叫「检索不准」，等于把感冒和骨折都叫「不舒服」。

验收方法要刻意保持**单变量**：固定问题集、固定切分、固定索引，只动召回配置，统计 recall@k——标准答案块出现在前 k 个候选里的比例。这个指标不需要 LLM、不需要人工反复打分、跑一次几秒钟，因此可以每天跑。等这一关稳定在你能接受的水平，再允许自己碰重排和 prompt。否则你会陷入经典循环：改了 prompt 感觉变好，其实是检索波动；改了 k 感觉变差，其实是那批问题本来就没有标准答案。

<PipelineMap />

<p class="mp-quote">召回的职业道德是「宁可多带几个可疑的回来，也别把真答案落在门外」；挑出谁可疑，是重排的工作。</p>

<div class="mp-grid">
  <a class="mp-card tone-coral" href="./rerank.html"><h3>接着读 · 重排</h3><p>50 个候选里，凭什么第 17 名该上岸。</p><span class="mp-go">04 重排 →</span></a>
  <a class="mp-card tone-blue" href="./chunking.html"><h3>回看 · 切分</h3><p>粒度不匹配，得回第一环修。</p><span class="mp-go">01 切分 ←</span></a>
  <a class="mp-card" href="./runnable.html"><h3>接着读 · 动手</h3><p>开关混合召回，看候选名单当场变脸。</p><span class="mp-go">跑一遍 →</span></a>
</div>
