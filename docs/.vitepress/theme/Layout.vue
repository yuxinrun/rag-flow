<script setup lang="ts">
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ListenBar from './components/ListenBar.vue'

const { page } = useData()
</script>

<template>
  <Transition name="sa-page" mode="out-in">
    <DefaultTheme.Layout :key="page.relativePath" />
  </Transition>
  <!-- 放在 Transition 外：换页不打断朗读 -->
  <ListenBar />
</template>
