import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

const app = createApp(App)

// 全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('全局错误捕获:', err)
  console.error('错误信息:', info)
  console.error('组件实例:', instance)

  // 可以在这里添加错误上报服务
  // 例如: Sentry, LogRocket 等
}

// 全局警告处理（仅开发环境）
if (import.meta.env.DEV) {
  app.config.warnHandler = (msg, instance, trace) => {
    console.warn('Vue 警告:', msg)
    console.warn('组件追踪:', trace)
  }
}

app.mount('#app')
