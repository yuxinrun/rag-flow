<script setup lang="ts">
import { withBase } from 'vitepress'

const fish = withBase('/yuxin-run.png')
</script>

<template>
  <span class="hero-pill">
    <img class="brand-logo" :src="fish" alt="鱼心快跑 · 正在奔跑的青色小鱼" width="36" height="24" />
    <span>鱼心快跑 · Yuxin Runs</span>
  </span>
</template>
