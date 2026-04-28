import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  plugins: [
    vue(),
    cssInjectedByJsPlugin(), // 将 CSS 内联进 JS，消除渲染阻塞的外部 CSS 请求
  ],
  test: {
    environment: 'jsdom',
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue'],
          // lucide 不单独分包，让 Rollup tree-shake 只打包实际用到的图标
        },
      },
    },
  },
})
