---
title: 索引：召回阶段救不了索引阶段的错
description: 讲清嵌入模型如何决定「什么算像」、ANN 索引拿什么换速度、稀疏索引为什么没退休，以及索引的最小验收方法。
---

# 索引：召回阶段救不了索引阶段的错

凌晨一点四十，你终于把 12 万块灌进向量库，进度条走到 100% 那一刻甚至有点感动。第二天同事问「投影仪转接头在哪」，系统自信地推荐了三条咖啡机滤芯的更换教程。你打开数据库看向量，全都在，维度也对，没有任何报错——**它们只是把「找东西」这件事，建立在一套根本没见过你们公司黑话的坐标上**。这种故障最气人：没有一行日志会告诉你错了。

**先给答案**：索引阶段要做三件事，缺一件后面就补不回来——用**嵌入模型**把块压成向量（决定什么算「像」），用**稀疏索引**保留字面精确匹配（决定专名能不能找到），用 **ANN 结构**把百万级比对变成毫秒级（决定快不快）。召回只能在已经编好的坐标里找，坐标压错了，召回再努力也是在错的地图上狂奔。

<EmbeddingSpace />

## 嵌入模型决定「什么算像」，榜单只决定从哪儿试起

嵌入模型把一段文本压成几百到几千维的向量，训练目标让语义相近的文本在空间里靠得近。麻烦在于「相近」是学出来的：通用语料里「苹果」靠近「水果」，你们的工单里「苹果」可能指的是那批测试机；「双审」「过会」「走签批」这类内部行话，模型压根没在预训练里见过几次。所以选模型要看榜单，但不能**只**看榜单。

国外常用的起点是 [MTEB 排行榜](https://huggingface.co/spaces/mteb/leaderboard)（Muennighoff 等人 2022 年的 [论文](https://arxiv.org/abs/2210.07316) 自报覆盖 8 类任务、58 个数据集）与 OpenAI 的 [text-embedding-3 系列](https://platform.openai.com/docs/guides/embeddings)；中文场景则绕不开智源 BAAI 的 [FlagEmbedding / BGE 系列](https://github.com/FlagOpen/FlagEmbedding)，其技术报告 [C-Pack](https://arxiv.org/abs/2309.07597) 同时给出了中文评测集 C-MTEB（论文自报 35 个中文数据集）。国内团队在中文检索上的投入很实在，[RAGFlow](https://github.com/infiniflow/ragflow)、[Dify](https://github.com/langgenius/dify) 等产品默认都会考虑中文嵌入模型的适配。但请记住口径：这些是**公开基准上的自报或榜单结果**，不等于在你们的报销制度上同样排序。真正该做的是拿上一章那 30–50 条问题，把两三个候选模型各灌一遍，比 recall@k——半天的事，比刷三天榜单有用。

::: tip 一个常被忽略的坑
查询和文档必须用**同一个**嵌入模型，且用同一套指令前缀。不少中文模型（如 BGE）要求查询侧加一句「为这个句子生成表示以用于检索相关文章：」，文档侧不加；[FlagEmbedding 的 README](https://github.com/FlagOpen/FlagEmbedding) 里写得很清楚。两边前缀弄反，向量就落在不同分布里，现象是「怎么调阈值都像随机」。
:::

## 向量库在忙什么：ANN 是拿精度换时间

有了向量，最笨的办法是拿查询向量跟 12 万个块一一算余弦，准确但慢。向量数据库做的是 **ANN（近似最近邻）**：先用 [HNSW](https://arxiv.org/abs/1603.09320)（Malkov & Yashunin, 2016）这类图结构或 IVF 倒排把候选范围缩小，只跟一小撮向量算距离。它返回的是「近似的最近邻」——请注意这个词，**索引结构本身就会引入召回损失**，所以「召回率掉了」这件事未必是嵌入模型的锅。

主流实现可以参考 [FAISS](https://github.com/facebookresearch/faiss)（Meta 开源的索引库）、[Milvus](https://milvus.io/docs)（Zilliz 发起，国内团队主导，中文文档见 [Zilliz 中文博客](https://zilliz.com.cn/blog)）、[Qdrant](https://qdrant.tech/documentation/) 与 [Weaviate](https://docs.weaviate.io/)；轻量场景用 [Chroma](https://docs.trychroma.com/) 或 Postgres 的 [pgvector](https://github.com/pgvector/pgvector) 也完全够。工程上更常见的坑不是选哪个库，而是**元数据**：把部门、时间、文档类型、权限标签一起存进索引，召回时先做过滤。否则「2024 版制度」和「2019 版废止制度」在向量空间里几乎重合，模型没有理由选对那个——这不是相似度问题，是过滤条件问题。

<div class="mp-steps">
  <div class="mp-step"><b>存什么</b><span>块文本 + 向量 + 元数据（来源文件、页码、章节、生效日期、权限）+ 稳定 ID。ID 要稳定，否则增量更新会变成全量重灌。</span></div>
  <div class="mp-step"><b>怎么更新</b><span>文档改了就按 ID upsert，删了就按 ID 删。别用「每次全量重建」糊弄长期系统，那会让版本与引用一起失效。</span></div>
  <div class="mp-step"><b>怎么验收</b><span>灌完库先跑 30 条问题看 recall@k：这一步只测「该找的块在不在候选里」，不接生成模型，噪音最小。</span></div>
</div>

## 稀疏索引没退休，它还管着专名和编号

稠密向量擅长「意思像」，但对**精确字符串**意外地迟钝：型号「XR-2000」、法条编号、错误码 `E_CONN_502`、人名缩写，这些词在语义空间里几乎没有邻居，反倒是 BM25 这类基于词频的稀疏检索一抓一个准。BM25 的经典参考是 Robertson & Zaragoza 2009 年的 [*The Probabilistic Relevance Framework: BM25 and Beyond*](https://www.staff.city.ac.uk/~sbrp622/papers/foundations_bm25_review.pdf)，今天在 [Elasticsearch](https://www.elastic.co/docs/reference/query-languages/query-dsl/query-dsl-match-query) 和 [OpenSearch](https://opensearch.org/docs/latest/search-plugins/knn/) 里都还是默认打分逻辑之一。

所以成熟的索引往往是**双份的**：一份稠密向量索引管语义，一份倒排索引管字面，召回时两路并行、再融合。这不是「多此一举」，而是承认两路各有盲区。站内 [交互流水线](./runnable) 里那个「只开稠密 / 混合」开关，就是把这件事做成了能点的东西。

<HybridFuse />

## 索引出问题时的三种长相

第一种是**静默失败**：库里有向量、查询也返回了结果，只是全不相关——多半是查询侧与文档侧前缀/模型不一致。第二种是**版本错乱**：答案引用了废止文档——元数据没存或没过滤。第三种是**增量失效**：新文档灌了却检索不到，旧文档删了还阴魂不散——ID 与 upsert 流程没设计好。这三种都不会抛异常，只有靠固定的小测试集定期跑一遍才看得见。把这一关守住，下一章的召回才有得谈。

<p class="mp-quote">索引不是把数据塞进数据库，是替「相似」这件事选一套坐标；坐标选错，后面每一环都是精确地跑偏。</p>

<div class="mp-grid">
  <a class="mp-card tone-coral" href="./retrieval.html"><h3>接着读 · 召回</h3><p>两路结果怎么融合，问题不好好问怎么办。</p><span class="mp-go">03 召回 →</span></a>
  <a class="mp-card tone-blue" href="./chunking.html"><h3>回看 · 切分</h3><p>块没切对，再好的嵌入也救不回来。</p><span class="mp-go">01 切分 ←</span></a>
  <a class="mp-card" href="./resources.html"><h3>接着读 · 资源</h3><p>嵌入模型、向量库、中文评测集的原始链接。</p><span class="mp-go">资源地图 →</span></a>
</div>
