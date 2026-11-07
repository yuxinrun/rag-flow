import DefaultTheme from 'vitepress/theme'
import type { EnhanceAppContext } from 'vitepress'
import { h } from 'vue'
import './style.css'
import Layout from './Layout.vue'
import BrandMark from './components/BrandMark.vue'
import ListenBar from './components/ListenBar.vue'
import RagFlow from './components/RagFlow.vue'
import PipelineMap from './components/PipelineMap.vue'
import ChunkGallery from './components/ChunkGallery.vue'
import EmbeddingSpace from './components/EmbeddingSpace.vue'
import HybridFuse from './components/HybridFuse.vue'
import RerankFunnel from './components/RerankFunnel.vue'
import ContextBudget from './components/ContextBudget.vue'
import EvalTriangle from './components/EvalTriangle.vue'
import RagPipelineDemo from './components/RagPipelineDemo.vue'

export default {
  extends: DefaultTheme,
  Layout: () => h(Layout),
  enhanceApp({ app }: EnhanceAppContext) {
    app.component('BrandMark', BrandMark)
    app.component('RagFlow', RagFlow)
    app.component('PipelineMap', PipelineMap)
    app.component('ChunkGallery', ChunkGallery)
    app.component('EmbeddingSpace', EmbeddingSpace)
    app.component('HybridFuse', HybridFuse)
    app.component('RerankFunnel', RerankFunnel)
    app.component('ContextBudget', ContextBudget)
    app.component('EvalTriangle', EvalTriangle)
    app.component('RagPipelineDemo', RagPipelineDemo)
  }
}
