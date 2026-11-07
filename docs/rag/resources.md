---
title: 国内外 RAG 资源地图
description: 按论文、官方文档、工程博客、评测框架、中文社区与开源项目分类，收齐本教程引用的来源与超链接。
---

# 国内外 RAG 资源地图

周六上午，你在收藏夹里翻找上周那篇「讲 RAG 讲得特别清楚」的文章，翻到第三屏发现里面夹着两篇标题一模一样、结论完全相反的博客，还有四个已经 404 的链接。**这领域的资料不缺，缺的是出处和口径**：谁写的、哪一年、测的什么数据、是论文还是产品博客。这一页把本站用到的、以及值得接着读的来源全摊开，注明类型与链接，方便你自己回去核对。

**先给答案**：看 RAG 资料按「三层」走最省力——**论文层**看机制从哪来，**官方文档层**看今天能用的 API 长什么样，**工程博客与开源项目层**看别人踩过的坑。中文资料在中文嵌入模型、文档解析、私有化部署这几块尤其值得看，别只盯英文。

::: info 关于链接与口径
下面每条都写明来源名称与类型；论文类给 arXiv 编号，博客类标出是厂商自报实验还是公开基准。整理时间为 2026 年 11 月，站点改版偶尔会挪动文档路径，若某个链接失效，直接搜标题或项目名即可找到镜像。数字请回到原文看样本与口径，不要从本站的转述里抄走一个百分比。
:::

## 第一层：论文与综述（机制从哪来）

| 来源 | 类型 / 出处 | 讲什么 |
| --- | --- | --- |
| [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401) | Lewis et al., 2020, arXiv:2005.11401 | RAG 的开山之作，参数化 + 非参数化记忆的分工 |
| [Dense Passage Retrieval for Open-Domain Question Answering](https://arxiv.org/abs/2004.04906) | Karpukhin et al., 2020, arXiv:2004.04906 | 稠密检索的经典基线 DPR |
| [RAG for Large Language Models: A Survey](https://arxiv.org/abs/2312.10997) | Gao et al., 2023, arXiv:2312.10997 | Naive / Advanced / Modular RAG 三代脉络，入门首选 |
| [Lost in the Middle](https://arxiv.org/abs/2307.03172) | Liu et al., 2023, arXiv:2307.03172 | 上下文位置效应，U 形表现的实验依据 |
| [Seven Failure Points When Engineering a RAG System](https://arxiv.org/abs/2401.05856) | Barnett et al., 2024, arXiv:2401.05856 | 三个真实案例的故障复盘，按环节归因 |
| [Precise Zero-Shot Dense Retrieval without Relevance Labels (HyDE)](https://arxiv.org/abs/2212.10496) | Gao et al., 2022, arXiv:2212.10496 | 假想答案辅助检索 |
| [Self-RAG](https://arxiv.org/abs/2310.11511) / [Corrective RAG](https://arxiv.org/abs/2401.15884) | Asai et al., 2023 / Yan et al., 2024 | 让模型自己判断要不要检索、检索结果能不能用 |
| [From Local to Global: A Graph RAG Approach](https://arxiv.org/abs/2404.16130) | Edge et al., 2024, arXiv:2404.16130 | 面向全局汇总问题的 GraphRAG |
| [ColBERT](https://arxiv.org/abs/2004.12832) / [HNSW](https://arxiv.org/abs/1603.09320) | Khattab & Zaharia, 2020 / Malkov & Yashunin, 2016 | 后期交互检索 / 近似最近邻图索引 |
| [MTEB](https://arxiv.org/abs/2210.07316) / [C-Pack (BGE, C-MTEB)](https://arxiv.org/abs/2309.07597) | Muennighoff et al., 2022 / Xiao et al., 2023（智源 BAAI） | 多任务嵌入榜单与中文嵌入模型体系 |
| [The Probabilistic Relevance Framework: BM25 and Beyond](https://www.staff.city.ac.uk/~sbrp622/papers/foundations_bm25_review.pdf) | Robertson & Zaragoza, 2009, 综述 PDF | BM25 的经典参考，稀疏检索还没退休的理由 |
| [Reciprocal Rank Fusion (RRF)](https://dl.acm.org/doi/10.1145/1571941.1572114) | Cormack et al., 2009, ACM SIGIR | 混合召回「只比名次」的来源 |

## 第二层：官方文档与工程博客（今天能用的东西）

| 来源 | 地区 / 类型 | 讲什么 |
| --- | --- | --- |
| [LangChain RAG 教程](https://python.langchain.com/docs/tutorials/rag/) 与 [Text splitters 概念](https://python.langchain.com/docs/concepts/text_splitters/) | 国外 · 官方文档 | 从加载到生成的完整示例、各类切分器 |
| [LlamaIndex 文档](https://docs.llamaindex.ai/en/stable/)（[Node parsers](https://docs.llamaindex.ai/en/stable/module_guides/loading/node_parsers/)、[Response synthesizers](https://docs.llamaindex.ai/en/stable/module_guides/querying/response_synthesizers/)） | 国外 · 官方文档 | 索引结构、父子块、答案合成 |
| [Pinecone Learning Center](https://www.pinecone.io/learn/)（[Chunking strategies](https://www.pinecone.io/learn/chunking-strategies/)） | 国外 · 厂商教程 | 切分、嵌入、混合检索的图解入门 |
| [Weaviate 文档](https://docs.weaviate.io/)（[Hybrid search](https://docs.weaviate.io/weaviate/search/hybrid)）与 [Weaviate Blog](https://weaviate.io/blog) | 国外 · 官方文档 / 博客 | 向量库概念与混合检索实现 |
| [Qdrant 文档](https://qdrant.tech/documentation/)（[Hybrid queries](https://qdrant.tech/documentation/concepts/hybrid-queries/)）与 [Articles](https://qdrant.tech/articles/) | 国外 · 官方文档 / 博客 | 过滤、量化、融合策略 |
| [Chroma Research](https://www.trychroma.com/research) 与 [Chroma 文档](https://docs.trychroma.com/) | 国外 · 研究笔记 | 切分策略评估（2024 年技术报告）等实验型内容 |
| [Elasticsearch BM25 / RRF 文档](https://www.elastic.co/docs/reference/query-languages/query-dsl/query-dsl-rrf) | 国外 · 官方文档 | 稀疏检索与融合的现成配置 |
| [Sentence-Transformers Cross-Encoder](https://www.sbert.net/examples/applications/cross-encoder/README.html) 与 [Cohere Rerank](https://docs.cohere.com/docs/rerank-2) | 国外 · 文档 / 商业 API | 重排机制与托管服务 |
| [Anthropic: Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval) 与 [Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering) | 国外 · 厂商博客（自报实验） | 上下文增强与上下文预算 |
| [OpenAI Embeddings 指南](https://platform.openai.com/docs/guides/embeddings) 与 [OpenAI Cookbook](https://cookbook.openai.com/) | 国外 · 官方文档 / 示例 | 嵌入接口与 RAG 示例代码 |
| [FAISS](https://github.com/facebookresearch/faiss) / [pgvector](https://github.com/pgvector/pgvector) / [Unstructured 文档](https://docs.unstructured.io/) | 国外 · 开源 / 文档 | ANN 索引、轻量向量存储、文档解析 |

## 第三层：评测框架与榜单

| 来源 | 类型 | 讲什么 |
| --- | --- | --- |
| [RAGAS](https://docs.ragas.io/)（[GitHub](https://github.com/explodinggradients/ragas)） | 开源评测框架 | faithfulness、context precision/recall、answer relevancy |
| [TruLens](https://www.trulens.org/)（[RAG Triad](https://www.trulens.org/getting_started/core_concepts/rag_triad/)） | 开源评测框架 | 上下文相关性 / 接地性 / 答案相关性三角 |
| [DeepEval 文档](https://docs.confident-ai.com/) / [LangSmith](https://docs.smith.langchain.com/) | 评测 / 追踪平台 | 指标定义、链路追踪与回归测试 |
| [MTEB Leaderboard](https://huggingface.co/spaces/mteb/leaderboard) | 公开榜单 | 嵌入模型横向对比（榜单口径 ≠ 你的语料） |
| [BEIR](https://github.com/beir-cellar/beir) / [MS MARCO](https://microsoft.github.io/msmarco/) | 公开基准 / 数据集 | 检索泛化性与大规模问答训练数据 |

## 第四层：国内与中文社区

| 来源 | 类型 | 讲什么 |
| --- | --- | --- |
| [FlagEmbedding（BGE / BGE-Reranker）](https://github.com/FlagOpen/FlagEmbedding) | 智源 BAAI · 开源 | 中文嵌入与重排模型，含查询侧指令前缀说明 |
| [Milvus 文档](https://milvus.io/docs) 与 [Zilliz 中文博客](https://zilliz.com.cn/blog) | 国内团队主导 · 开源 / 中文博客 | 向量数据库、索引结构、工程实践 |
| [RAGFlow](https://github.com/infiniflow/ragflow) | InfiniFlow · 国内开源 | 深度文档理解驱动的解析、切块与可视化切片 |
| [Dify](https://github.com/langgenius/dify) | 国内开源 | 可视化编排知识库与 RAG 应用，适合快速搭原型 |
| [MinerU](https://github.com/opendatalab/MinerU) | 上海人工智能实验室 · 开源 | PDF / 扫描件版面解析，解决「索引前的第一环」 |
| [Datawhale 开源教程](https://github.com/datawhalechina) | 国内社区 | 中文 LLM / RAG 系统教程与实战项目 |
| [WaytoAGI](https://www.waytoagi.com/) | 国内中文社区 | 中文 AI 知识库与工具导航，可顺藤找 RAG 资料与案例 |
| [ModelScope 魔搭](https://www.modelscope.cn/) | 国内模型社区 | 中文嵌入 / 重排模型的权重与示例 |

<div class="mp-band">
  <p class="mp-eyebrow">怎么用这张地图</p>
  <h2 class="mp-h2" style="font-size:1.5rem">别从博客开始，也别停在综述</h2>
  <div class="mp-band-grid">
    <div class="mp-band-card"><h3>要搞懂「为什么」</h3><p>读第一层：Lewis 2020 打底，Gao 2023 综述铺开，Lost in the Middle 与七种故障补工程视角。</p></div>
    <div class="mp-band-card"><h3>要今天就能跑</h3><p>读第二层：挑一个框架官方文档照着敲，再对照本站的<a href="./runnable.html">最小实现</a>看每个函数在做什么。</p></div>
    <div class="mp-band-card"><h3>要判断「有没有变好」</h3><p>读第三层：先自建 30–50 条问题集，再上 RAGAS / TruLens，别反过来。</p></div>
    <div class="mp-band-card"><h3>要处理中文与私有化</h3><p>读第四层：BGE 系列、MinerU、RAGFlow、Milvus 这条中文链路，比照搬英文示例少走很多弯路。</p></div>
  </div>
</div>

<p class="gs-cap">四层资料分别回答「机制从哪来、今天怎么实现、怎么算变好、中文场景怎么办」，配合本站六个环节按图索骥即可，不必按表格顺序硬读。</p>

## 最后一句免责式的大实话

厂商博客里的百分比，几乎都是**在自家评测集、自家模型、自家配置下**跑出来的；论文里的数字也绑着数据集和模型版本。本站引用时都尽量带上口径（谁的评测集、多少数据、哪一年），但真正要给你自己的系统定目标，还是得回到[评测那一章](./evaluation)的小测试集。收藏夹可以乱，尺子不能乱。

<p class="mp-quote">读 RAG 资料最省力的姿势，是先知道自己在修哪一环，再去找讲那一环的原始出处。</p>

<div class="mp-grid">
  <a class="mp-card tone-coral" href="./what-is-rag.html"><h3>回到起点</h3><p>用全局图再看一遍六个环节。</p><span class="mp-go">00 认识 RAG ←</span></a>
  <a class="mp-card tone-blue" href="./evaluation.html"><h3>回看 · 评测</h3><p>把来源里的数字变成自己的尺子。</p><span class="mp-go">06 评测 ←</span></a>
  <a class="mp-card" href="./runnable.html"><h3>回看 · 动手</h3><p>资料看完，去把管子接起来。</p><span class="mp-go">跑一遍 →</span></a>
</div>
