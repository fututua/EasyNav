# EasyNav - 项目进度文档

## 技术栈

- Vue 3 (Composition API)
- Vite 5
- Tailwind CSS 3 (`darkMode: 'class'`)
- lucide-vue-next

---

## 完成情况

### [x] 已完成（核心功能全部完成）

- [x] Vite + Vue3 项目结构初始化
- [x] Tailwind CSS 集成
- [x] lucide-vue-next 图标库集成
- [x] 侧边栏组件（固定左侧，含分类列表与图标）
- [x] 资源卡片组件（颜色标识、描述、外链、tags 标签）
- [x] 主内容区栅格布局（1/2/3/4/5 列响应式）
- [x] 移动端汉堡菜单 + 遮罩层收纳侧边栏
- [x] 暗色模式（class 策略，侧边栏 Sun/Moon 切换按钮）
- [x] 暗色模式状态 localStorage 持久化（刷新后记忆）
- [x] 搜索功能 + XCircle 清除按钮
- [x] 搜索支持 name / desc / tags 三字段过滤
- [x] 搜索无结果生动空状态提示
- [x] ResourceCard hover 缩放特效 + 外链图标悬浮变色
- [x] 点击分类平滑滚动到对应 section
- [x] 全部分类下按分类分组展示（带 section 锚点）
- [x] resources.js 数据规范化，每条资源含 tags 数组（18 条，6 分类）
- [x] 收藏功能（★ 按钮，localStorage 持久化，侧边栏"我的收藏"入口）
- [x] index.html SEO 元数据（title / description / keywords / og / favicon）
- [x] UI 像素级对齐修复（侧边栏 border-r 与顶栏 border-b 颜色统一：亮色 gray-200 / 暗色 gray-800）
- [x] 物理对齐结构重构（桌面端 Sidebar 改为文档流内 flex 子元素，Header 在右侧 flex-col 容器顶部，border-r 与 border-b 物理精准对接，彻底消除 1px 错位）
- [x] 嵌套 Flex 结构最终修复：将分割线责任从 aside 的 border-r 转移至右侧容器的 border-l，分割线从容器顶部（含 Header）开始，与 Sidebar 右侧天然无缝对接，彻底解决物理错位问题
- [x] Header 与 Sidebar Logo 区域统一固定高度 h-14，水平分割线完美对齐
- [x] 全部分类视图分类块间距调整：使用 space-y-5 包裹分类列表，替代失效的 first:mt-0 方案

### [ ] 待完成

- [ ] 后端数据接入 / 数据持久化（目前为静态 JS 数据）
- [ ] 资源管理后台（增删改）
- [ ] 部署上线（见 DEPLOY.md）

### [!] 运行命令

```bash
npm install && npm run dev
```

> 访问地址：http://localhost:5173

```bash
# 生产构建
npm run build
```

---

## 暗色模式实现说明

采用 **Tailwind CSS `class` 策略**：

- `tailwind.config.js` 设置 `darkMode: 'class'`
- `toggleDark()` 操作 `document.documentElement.classList`，并写入 `localStorage`
- 页面加载时读取 `localStorage` 恢复上次状态

---

## 文件结构

```
EasyNav/
├── index.html               # SEO 元数据 + SVG favicon
├── package.json
├── vite.config.js           # 生产构建分包配置
├── tailwind.config.js       # darkMode: 'class'
├── postcss.config.js
├── PROGRESS.md              # 本文件
├── DEPLOY.md                # 详细部署指南
└── src/
    ├── main.js
    ├── style.css
    ├── App.vue              # 根组件：布局、暗色、搜索、收藏、平滑滚动
    ├── components/
    │   ├── Sidebar.vue      # 左侧导航 + 收藏入口 + Dark/Light 切换
    │   └── ResourceCard.vue # 卡片：hover 缩放、tags、★ 收藏按钮
    └── data/
        └── resources.js     # 18 条数据，含 tags 字段
```
