---
title: 重排：候选要不要上台，得再过一道质检
description: 讲透 bi-encoder 与 cross-encoder 的分工、常见 reranker 选型、位置与多样性处理，以及加重排前该算的三笔账。
---

# 重排：候选要不要上台，得再过一道质检

下午四点，你终于把「报销多久到账」的 50 个候选打印出来贴在屏幕上，用荧光笔找正确答案——它在第 17 位，前面是六条报销制度的目录、四条「报销」两个字出现八次但什么也没说的通知，还有一条行政部门团建照片的说明文字。你盯着满屏荧光笔印子想：**答案明明被召回来了，却因为坐得太靠后，被 top-5 一刀切在门外**。那一刻你理解了为什么要有重排，也理解了为什么它不能替召回干活。

**先给答案**：召回用便宜的模型从百万块里快速捞回几十上百个候选（求全），重排用贵的模型只对这几十对做精算（求准）。两者不是同一个任务的两个参数，而是**精度与速度的两次分工**：前者必须能离线预先算好文档向量，后者必须让问题和文档在同一段输入里互相看见。

<RerankFunnel />

## bi-encoder 与 cross-encoder 的差别，是「各说各话」还是「当面聊」

召回阶段的嵌入模型是 **bi-encoder**：问题和文档分别过一次模型，各自变成一个向量，然后算余弦。好处是文档向量能提前算好存库，百万级检索只算一次查询向量；代价是模型编码文档时**根本不知道用户会问什么**，只能给一个通用表示。

重排阶段的 **cross-encoder** 把「问题 + 候选块」拼成一条输入一起送进模型，让注意力在两者之间来回看，输出一个相关性分数。它能识别「报销五个工作日到账」对「报销多久到账」是精确命中，而「报销制度目录」只是词面热闹。代价是每个候选都要单独跑一次模型，没法预先缓存——所以只能对少量候选做。[Sentence-Transformers 的 Cross-Encoder 文档](https://www.sbert.net/examples/applications/cross-encoder/README.html) 把这个机制讲得很直白；[Cohere Rerank 文档](https://docs.cohere.com/docs/rerank-2) 是常见的托管 API；中文开源方案可以看 [BGE Re-Ranker](https://github.com/FlagOpen/FlagEmbedding)（同属智源 FlagEmbedding 项目）；[ColBERT](https://arxiv.org/abs/2004.12832)（Khattab & Zaharia, 2020）则用「token 级向量 + 后期交互」在两者之间找了个折中，[RAGatouille](https://github.com/AnswerDotAI/RAGatouille) 把它封装得挺好用。

<div class="mp-split">
  <div class="myth"><h4>常见误解</h4><p>「有了 reranker 就不用管 top-k」「重排分数可以当置信度」「重排一定能提升效果」。分数只在同一模型、同一批候选里可比；召回漏掉的块，重排连打分的机会都没有。</p></div>
  <div class="fact"><h4>证据口径</h4><p>Anthropic 的 <a href="https://www.anthropic.com/news/contextual-retrieval">Contextual Retrieval</a> 在自有评测集上报告：只用上下文嵌入，top-20 检索失败率相对下降约 35%；再叠加 BM25 与重排，约 49%（口径：官方博客自报实验，非第三方复测）。值得注意的是「叠加」二字——重排是补丁，不是替代。</p></div>
</div>

## 加重排之前，先算清三笔账

第一笔是**延迟**：50 个候选逐对打分，本地小模型可能几十到几百毫秒，托管 API 还要加网络往返；如果这是客服实时问答，用户能感觉到。第二笔是**钱**：每次请求多一次模型调用，QPS 一上来账单会很有存在感。第三笔，也是最容易被忽略的，是**收益的前提**：只有当「答案已经在候选里但排得靠后」时重排才有用。如果 recall@50 本来就低，装十个 reranker 也只是把噪声排得更整齐。

所以顺序永远是：先测 recall@k 确认答案在候选里 → 再加重排 → 再看 top-5 命中率与端到端答案质量。这条顺序也是本站反复念叨的「按环节验收」：**每一环只对自己那件事负责**。判断值不值，用一个小实验就够：同一批 50 条问题，A 组直接取召回前 5，B 组召回 50 再重排取 5，比较两组的答案正确率与 p95 延迟。数字出来，比任何架构讨论都省时间。

## 重排不是洗牌：还要管去重、多样性和位置

真实候选里常有一堆近乎重复的内容——同一份制度被三个版本各存了一份，或者一个长段被切成三块全进榜。若不去重，top-5 会被同一个信息占满，剩下四个名额白白浪费。[LlamaIndex 的相似性后处理](https://docs.llamaindex.ai/en/stable/module_guides/querying/postprocessor/) 与经典的 MMR（最大边际相关性）都在解决「又要相关、又要不重样」这件事，[LangChain 的 MMR 检索示例](https://python.langchain.com/docs/how_to/integrations/vectorstores/) 也有现成代码。

排完序还有最后一脚：**送进 prompt 时怎么摆**。答案在候选里、也排到了第一名，但如果被埋在上下文正中，模型照样可能忽略它——这是下一章 [Lost in the Middle](./generation) 要讲的事。重排的输出不只是一个列表，还该带上「哪几块进 prompt、按什么顺序进、每块留多少字」的交代。把这一步想清楚，你会发现重排其实是**检索与生成之间的排版工人**：它不管写什么，它决定读者先看到哪一行。

<RerankFunnel />

<p class="mp-quote">召回决定答案有没有机会上台，重排决定它坐第几排；至于上台后会不会被听见，那是生成的台词功力了。</p>

<div class="mp-grid">
  <a class="mp-card tone-coral" href="./generation.html"><h3>接着读 · 生成</h3><p>证据摆好了，怎么让模型真的照着说。</p><span class="mp-go">05 生成 →</span></a>
  <a class="mp-card tone-blue" href="./retrieval.html"><h3>回看 · 召回</h3><p>候选里没有答案，重排也无从谈起。</p><span class="mp-go">03 召回 ←</span></a>
  <a class="mp-card" href="./runnable.html"><h3>接着读 · 动手</h3><p>点一下重排开关，看第一名当场换人。</p><span class="mp-go">跑一遍 →</span></a>
</div>
