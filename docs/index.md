---
layout: page
title: RAG 这件事
description: 从切分、索引到召回、重排、生成与评测，把 RAG 每个环节讲透，并提供一条浏览器里能跑起来的流水线。
---

<div class="mp-wrap">

<div class="home-hero">
  <div class="home-hero-info">
    <BrandMark />
    <h1 class="home-hero-name">RAG 这件事</h1>
    <p class="home-hero-text">把检索、重排、生成串成一条能跑的流水线，而不是一堆参数玄学。</p>
    <p class="mp-lead home-hero-lead">凌晨一点还在调 top-k 的朋友，先别调了：答案错，多半不是 k 不对，是前面切块、索引、召回里某一环早就把证据弄丢了。这里用 6 个环节、9 页教程、20 多个带出处的内外资料、1 条浏览器里能跑的流水线，把这件事从头捋一遍。</p>
    <div class="home-hero-actions">
      <a class="btn btn-primary" href="./rag/what-is-rag.html">从开卷考试讲起 →</a>
      <a class="btn" href="./rag/runnable.html">直接跑一遍流水线</a>
      <a class="btn" href="./rag/resources.html">翻资源地图</a>
    </div>
  </div>
  <div class="home-hero-media"><RagFlow /></div>
</div>

<div class="mp-section">
  <p class="mp-eyebrow">WHY THIS SITE</p>
  <h2 class="mp-h2">RAG 的难点不在背参数，在知道哪一步坏了。</h2>
  <p class="mp-lead">「chunk_size 设 512 还是 1024」是搜索引擎里最容易搜到的问题，也是最容易把人带偏的问题。真正决定效果的是：证据有没有被完整切开、编码模型有没有见过你的行话、召回的候选里到底有没有答案、送进 prompt 的那几块排在第几位、以及你有没有一个能指出坏在哪一环的评测集。</p>

  <div class="mp-stats">
    <div class="mp-stat"><div class="mp-num">6</div><div class="mp-label">个环节，切分 / 索引 / 召回 / 重排 / 生成 / 评测</div></div>
    <div class="mp-stat"><div class="mp-num">9</div><div class="mp-label">页教程，按流水线顺序排，不按名词表排</div></div>
    <div class="mp-stat"><div class="mp-num">20+</div><div class="mp-label">个国内外资料来源，每个都给了超链接与口径</div></div>
    <div class="mp-stat"><div class="mp-num">1</div><div class="mp-label">条能在浏览器里点着玩的端到端流水线</div></div>
  </div>
</div>

<div class="mp-section">
  <p class="mp-eyebrow coral">三件不一样的事</p>
  <h2 class="mp-h2">别的教程给你结论，这里给你一条会动的路。</h2>
  <div class="mp-grid">
    <a class="mp-card tone-coral" href="./rag/chunking.html">
      <h3>每一步都讲「坏了会怎样」</h3>
      <p>切错块、嵌错模、召不回、排错序、塞太满、评不出——六个环节各配一种典型翻车现场，以及怎么把锅定位到具体那一环。</p>
      <span class="mp-go">从切分开始 01 →</span>
    </a>
    <a class="mp-card tone-blue" href="./rag/runnable.html">
      <h3>能跑，不是能抄</h3>
      <p>站内交互组件把切分、玩具嵌入、混合召回、重排、带引用生成串起来；再给一份不到百行的 Python 最小实现，本地换自己的文档就能跑。</p>
      <span class="mp-go">去跑一遍 →</span>
    </a>
    <a class="mp-card" href="./rag/resources.html">
      <h3>来源摆桌上</h3>
      <p>原论文、官方文档、工程博客、中文社区与开源项目分门别类，全部注明出处与链接；数字带口径，不把某家博客的实测当宇宙真理。</p>
      <span class="mp-go">看资源地图 →</span>
    </a>
  </div>
</div>

<div class="mp-section">
  <p class="mp-eyebrow">HOW TO READ</p>
  <h2 class="mp-h2">按顺序走一遍，比跳着搜十篇博客省时间。</h2>
  <div class="mp-steps">
    <div class="mp-step"><b>先建立直觉</b><span><strong>开卷考试</strong>：搞清楚 RAG 补的是「证据」不是「智商」，顺手判断你这需求到底要不要上 RAG。</span></div>
    <div class="mp-step"><b>再走六个环节</b><span>从<strong>切分 → 索引 → 召回 → 重排 → 生成 → 评测</strong>依次读，每章开头都先给答案，每章结尾都告诉你下一环接什么。</span></div>
    <div class="mp-step"><b>然后动手</b><span>在<strong>交互流水线</strong>上换问题、换切法、开关混合召回与重排，亲眼看着第一名换人；再把 Python 版本搬到本地。</span></div>
    <div class="mp-step"><b>最后带着来源回去吵</b><span>用<strong>资源地图</strong>里的论文与文档核对每个说法，尤其核对那些被转述了三手的数字。</span></div>
  </div>
</div>

<div class="mp-section">
  <p class="mp-quote">「模型说得像不像，是生成的事；模型凭什么这么说，是检索的事。RAG 的全部工作，就是把『凭什么』这三个字钉在纸面上。」</p>
</div>

<div class="mp-section">
  <p class="mp-eyebrow">顺手收藏</p>
  <h2 class="mp-h2">三个最常被翻回去的入口。</h2>
  <div class="mp-grid">
    <a class="mp-card" href="./rag/evaluation.html"><h3>评测：先有尺子再调参</h3><p>RAG 三角、忠实度与上下文精度，附一份最小测试集的做法。</p><span class="mp-go">去评测 →</span></a>
    <a class="mp-card tone-blue" href="./rag/generation.html"><h3>生成：上下文是预算</h3><p>为什么把最关键的证据放中间，等于把它扔了。</p><span class="mp-go">去生成 →</span></a>
    <a class="mp-card tone-lime" href="./rag/resources.html"><h3>资源：国内外都在写什么</h3><p>从 Lewis 2020 到 BGE、RAGFlow、Dify，一张表收齐。</p><span class="mp-go">去资源页 →</span></a>
  </div>
</div>

</div>
