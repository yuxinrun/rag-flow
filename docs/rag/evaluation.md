---
title: 评测：不评测的 RAG 是薛定谔的 RAG
description: 从最小测试集讲到 RAG 三角、常用指标与工具，并把七类典型故障映射回具体环节，给出可执行的验收流程。
---

# 评测：不评测的 RAG 是薛定谔的 RAG

周五下午四点，周会投屏。老板指着问答机器人问：「比上周好了多少？」你张了张嘴，说出那句自己都不太信的话：「感觉……挺准的？」会议室安静了两秒，隔壁同事补刀：「我昨天问年假，它给我念了茶水间规定。」**没有尺子的系统，效果只能靠语气和运气**，而语气在周会上通常撑不过第三个追问。

**先给答案**：RAG 评测的核心不是「打个总分」，而是**把锅分给具体环节**。做法是攒一小批带标准答案的真实问题，然后分别测两件事：检索有没有把该找的块带回来（检索侧），答案有没有照着这些块说（生成侧）。两件事一分开，「感觉不太对」就变成了「recall@5 从 0.62 掉到 0.55，切分改动引起的，回滚」。

<EvalTriangle />

## 先有测试集，再谈调参

最小可行的测试集长这样：**30–50 条真实问题**，每条写清楚三样东西——问题原文、标准答案、以及「哪些块算命中」（文档 ID + 段落）。再加 5–10 条**故意没有答案**的问题，专门测系统会不会硬编。问题从客服日志、搜索框历史、同事吐槽里捞，别自己坐在工位上凭空编，因为编出来的问题会不自觉地贴合你刚写的切分规则。

有了它，每个环节都能有一道「验收门」：切分与索引看 recall@k，重排看 top-3 命中率，生成看正确率与忠实度，拒答看那 5–10 条无答案问题的表现。这套东西不需要平台、不需要 GPU，一个 JSON 文件加几十行脚本就够；[RAGAS 的快速开始](https://docs.ragas.io/en/stable/getstarted/rag_eval/) 与 [TruLens 的 RAG Triad 说明](https://www.trulens.org/getting_started/core_concepts/rag_triad/) 都建议从这样的小集合起步。

## RAG 三角：三个节点，三条边，三种锅

TruLens 提出的 **RAG Triad** 把系统画成一个三角：顶点是 Query、Context、Answer，三条边各对应一个指标。Query→Context 是**上下文相关性**（捞回来的块跟问题有没有关系），Context→Answer 是**忠实度 / 接地性**（答案有没有被证据支持），Query→Answer 是**答案相关性**（回答跑题没有）。[RAGAS](https://docs.ragas.io/) 的指标体系与之高度呼应，另外提供上下文精度 / 召回（context precision / recall）等更细的检索侧指标。

这个三角形的实用价值在于**归因**：上下文相关性和答案相关性都低 → 先查召回；上下文相关性高但忠实度低 → 模型在自由发挥，查 prompt 与生成；三条边都还行，但用户就是不满意 → 大概率问题出在测试集没覆盖真实分布，回去补问题。别笑，最后一种比前两种加起来还常见。

<table class="src-table">
  <thead><tr><th>要看什么</th><th>常用指标</th><th>怎么算 / 口径</th><th>工具</th></tr></thead>
  <tbody>
    <tr><td>检索侧</td><td>recall@k、context precision、MRR</td><td>标准答案块是否进前 k；无需 LLM，最便宜也最该先做</td><td>自写脚本 / <a href="https://docs.ragas.io/">RAGAS</a> / <a href="https://github.com/explodinggradients/ragas">ragas 源码</a></td></tr>
    <tr><td>检索+生成接缝</td><td>context relevance / groundedness</td><td>捞回的块与问题是否相关、答案句能否由块推出，多用 LLM-as-judge，需固定裁判模型与提示词</td><td><a href="https://www.trulens.org/">TruLens</a> / <a href="https://docs.ragas.io/">RAGAS</a></td></tr>
    <tr><td>生成侧</td><td>answer relevance、faithfulness、引用可核对率</td><td>回答是否切题、有无幻觉、每个 [n] 是否对得上原文</td><td><a href="https://docs.confident-ai.com/">DeepEval</a> / 人工抽检</td></tr>
    <tr><td>工程侧</td><td>p50 / p95 延迟、单次成本</td><td>自己压测的口径要写清并发数与机器规格，别拿单机数字当线上 SLA</td><td>自写脚本 / <a href="https://docs.smith.langchain.com/">LangSmith</a> 追踪</td></tr>
  </tbody>
</table>

::: info 关于 LLM-as-judge 的一句实话
让模型给模型打分很方便，但它是**带裁判偏置的估计**，不是真值。口径要写死（哪个裁判模型、什么提示词、温度多少），并且定期用人工标注的一小批样本校准；否则你换了裁判，分数变了，还以为系统进步了。RAGAS 与 TruLens 的文档都把这一点写在注意事项里。
:::

## 七种翻车，对应七个不同的修理位置

Barnett 等人 2024 年的 [*Seven Failure Points When Engineering a Retrieval Augmented Generation System*](https://arxiv.org/abs/2401.05856)（口径：作者复盘三个真实 RAG 案例的定性总结，不是大规模统计）列了七类故障，正好可以映射回本教程的环节：**缺内容**（语料里就没有，别调模型）、**没召回**（切分/索引/召回）、**没排进上下文**（top-k 太小或重排失效）、**没被提取**（噪声太多、位置太靠中间）、**格式错**（prompt 契约没定）、**粒度不对**（问题要汇总，系统只给片段）、**答案不完整**（只答了一半）。把「效果不好」翻译成其中一类，修理方案基本就自动浮现了。

<div class="mp-steps">
  <div class="mp-step"><b>冻住基线</b><span>把当前系统的检索结果、prompt、答案全部存一份快照，记录 commit 与配置。没有基线，「提升」只是形容词。</span></div>
  <div class="mp-step"><b>单变量改一处</b><span>一次只动一个环节，跑完整测试集，看对应指标与端到端正确率。两周改五处，等于什么都没学。</span></div>
  <div class="mp-step"><b>分层看结果</b><span>先检索侧指标，再忠实度，再答案正确率。指标打架时按「证据链」优先，别被一个漂亮的总分带跑。</span></div>
  <div class="mp-step"><b>把坏例子收进测试集</b><span>线上每发现一个翻车问题，就补一条进去。测试集是会长的，这比换模型更能让系统稳定变好。</span></div>
</div>

<EvalTriangle />

## 最后一层：用户体验也是评测对象

指标全绿但没人用的系统我见过：回答正确、引用齐全、就是慢到 8 秒，用户早就自己翻文档去了。所以把 p95 延迟、答案长度、拒答率一起放进报表；也别忘了看「引用点不点得回去」这种没有分数、但决定信任感的细节。评测的终点不是让曲线好看，是让周五下午那句「比上周好了多少」有一个能说出口、也经得起追问的答案。

<p class="mp-quote">评测不是给系统打分，是给下一次修改指路：分数只负责说「疼」，分环节的指标才负责说「哪儿疼」。</p>

<div class="mp-grid">
  <a class="mp-card tone-coral" href="./runnable.html"><h3>接着读 · 跑起来</h3><p>把六个环节装进一条能点的流水线。</p><span class="mp-go">动手 →</span></a>
  <a class="mp-card tone-blue" href="./resources.html"><h3>接着读 · 资源</h3><p>评测框架、论文与中文社区的原始链接。</p><span class="mp-go">资源地图 →</span></a>
  <a class="mp-card" href="./what-is-rag.html"><h3>回看 · 全局</h3><p>从头再看一遍六个环节的分工。</p><span class="mp-go">00 认识 RAG ←</span></a>
</div>
