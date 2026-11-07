---
title: 切分：第一刀切歪，后面全在还债
description: 讲透 chunk 为什么存在、固定长度与语义边界的差别、重叠与上下文增强怎么做，以及切分该怎么单独验收。
---

# 切分：第一刀切歪，后面全在还债

下午三点十七分，你把一份 68 页的制度 PDF 拖进解析脚本，终端滚得挺欢，咖啡已经凉了。随手抽检第 402 块，屏幕上写着「……金额超过 2000」，下一块开头是「元须部门总监与财务双审」。两半分开看都挺正常，合起来才叫人后背一凉：**条件在这块，结论在隔壁块，模型一次只看其中一块**。你后面换嵌入模型、调 top-k、加 reranker，本质上都在给这一刀还债。

**先给答案**：切分（chunking）的唯一目标不是「长度整齐」，而是让**每一块都能独立回答一个可能的问题**：自带主语、自带条件、自带时间范围。chunk 是后面所有环节的最小证据单位，它坏了，索引存的是残缺证据，召回捞的是残缺证据，模型只能照着残缺证据一本正经地胡说。

<ChunkGallery />

## 长度整齐是给程序看的，语义完整才是给模型看的

按字符数硬切最省事，也最容易出事：一刀落在句子中间，落在表格行中间，落在「但下列情形除外」前面。工程里常见的起点是把块控制在几百个 token（[LangChain 的 text splitters 文档](https://python.langchain.com/docs/concepts/text_splitters/) 与 [Pinecone 的 chunking 指南](https://www.pinecone.io/learn/chunking-strategies/) 都把 256–1024 token 这一区间当起点讨论，属于各家教程的工程惯例，不是实测最优值）。但数字只是护栏，真正要盯的是边界：**句号、空行、Markdown 标题、表格行、代码函数**，这些天然边界比任何魔数都可靠。[LlamaIndex 的 node parsers 文档](https://docs.llamaindex.ai/en/stable/module_guides/loading/node_parsers/) 把这类按结构切的实现列得很全，包括按句子、按 Markdown 标题、按语义相似度合并的版本。

<div class="mp-split">
  <div class="myth"><h4>常见误解</h4><p>「块越小越精准」「块越大上下文越全」「加个 overlap 就万事大吉」。听起来都对，合起来互相打架：小块精准但缺主语，大块完整但塞满噪声，overlap 只缓解边界、不修复结构。</p></div>
  <div class="fact"><h4>证据口径</h4><p>Chroma 的 <a href="https://www.trychroma.com/research">chunking 研究（Evaluating Chunking Strategies, 2024）</a> 与 Pinecone 的指南都强调在同一套评测问题上比较切法，因为切法的优劣依赖语料与问题类型；任何不带语料、不带问题集就宣称「最优块长」的数字，都只适用于它自己那次实验。</p></div>
</div>

## 给每一块补回它丢掉的「出身」

一份文档被切碎之后，最先消失的往往不是字，而是**上下文身份**：这一块来自哪一章、哪个版本、讲哪个产品。于是「第五条 年假当年有效」被单独检索出来时，模型完全不知道它属于 2024 版还是 2019 版。三个便宜好用的补丁，按成本从低到高：

<div class="mp-steps">
  <div class="mp-step"><b>重叠 overlap</b><span>相邻块共享一两句，专治「被切断的句子」。代价是索引变大、重复内容挤占召回名额，别指望它治本。</span></div>
  <div class="mp-step"><b>标题继承</b><span>把「第三章 &gt; 2.1 报销时效」拼到每块前面再编码。几乎零成本，对制度、手册类文档收益最明显，<a href="https://python.langchain.com/docs/how_to/markdown_header_metadata_splitter/">LangChain 的 MarkdownHeaderTextSplitter</a> 就是干这个的。</span></div>
  <div class="mp-step"><b>上下文增强</b><span>用模型给每块生成一句「本块在全文中的位置与主题」，再和原文一起入库。Anthropic 在 2024 年的 <a href="https://www.anthropic.com/news/contextual-retrieval">Contextual Retrieval</a> 里报告：在其自有评测集上，上下文嵌入让 top-20 检索失败率相对下降约 35%，叠加重排后约 49%（口径：Anthropic 官方博客自报的内部实验，非公开基准复测）。</span></div>
</div>

还有一类思路是**父子块**：用小块去做检索（定位准），命中后把它的父块（整节）交给模型（上下文全）。[LlamaIndex 的 auto-merging retriever](https://docs.llamaindex.ai/en/stable/examples/retrievers/auto_merging_retriever/) 就是这个套路。更晚一点还有 Jina AI 提出的 [Late Chunking](https://arxiv.org/abs/2409.04701)：先让长上下文模型把整篇文档编码成 token 级向量，再按边界池化成块向量，让每个块「带着全文的语境」出生——适合指代特别多的长文，代价是编码链路更贵。

## 切分好不好，别靠肉眼抽检

抽检是我见过最诚实的自欺：人总会挑前 10 块看，坏的永远在第 402 块。能落地的验收很朴素——先攒 30–50 条真实问题，标出每条问题「应该命中哪一段」，然后固定索引与召回配置，只换切法，看 **recall@k**：标准答案块有没有出现在前 k 个候选里。这个指标不需要生成模型，跑一轮几秒钟，却能把「切法之争」从审美问题变成算术问题。举个具体的：把「金额超过 2000 元须双审」和「五个工作日到账」切进同一块，问「报销多久到账」时命中率会上升；但如果因此把整章塞成一块，问「超过 2000 元怎么办」时那句关键条件就被十几行无关文字稀释了——**两种问题都要在测试集里**，否则你只是把偏差换了个方向。

<ChunkGallery />

## 什么情况下可以直接跳过复杂切法

FAQ、表格、API 文档这类**天然结构化**的语料，一行问答、一行记录、一个接口本来就是块，硬做语义切分属于给整齐的抽屉再装一个抽屉。而扫描件 PDF、双栏论文、带合并单元格的表格，问题往往不在切分算法，而在解析：先把版面读对，比后面调什么切法都值钱。开源项目 [RAGFlow](https://github.com/infiniflow/ragflow)（InfiniFlow 团队，国内开源）主打的正是「基于深度文档理解」的解析与切块，[Unstructured](https://docs.unstructured.io/) 与 [MinerU](https://github.com/opendatalab/MinerU) 也常被放在链路最前面。记住这条顺序：**解析 → 切分 → 索引**，别让第三环替第一环背锅。

<p class="mp-quote">切分不是压缩文档，是设计证据的最小单位：一块要能自己站出来说清楚一句话，也能被单独找回来。</p>

<div class="mp-grid">
  <a class="mp-card tone-coral" href="./indexing.html"><h3>接着读 · 索引</h3><p>块切好了，怎么存才能被找到？</p><span class="mp-go">02 索引 →</span></a>
  <a class="mp-card tone-blue" href="./evaluation.html"><h3>接着读 · 评测</h3><p>recall@k 到底怎么算，测试集怎么攒。</p><span class="mp-go">06 评测 →</span></a>
  <a class="mp-card" href="./runnable.html"><h3>接着读 · 动手</h3><p>按句切 vs 整篇不切，在浏览器里看差别。</p><span class="mp-go">跑一遍 →</span></a>
</div>
