---
layout: home

hero:
  name: "Joy At Meeting"
  text: "现代化 React Hooks 工具库"
  tagline: 为 React 开发者精心打造的高质量 Hooks 集合，让开发更加优雅高效
  image:
    src: /logo.svg
    alt: Joy At Meeting
  actions:
    - theme: brand
      text: 立即开始
      link: /guide/getting-started
    - theme: alt
      text: GitHub
      link: https://github.com/SeKidayo/joy-at-meeting

features:
  - icon: ⚡
    title: 极致性能
    details: 经过精心优化的 hooks，最小化重渲染，提供卓越的运行时性能
  - icon: 🎯
    title: TypeScript 原生
    details: 100% TypeScript 编写，提供完整的类型定义和智能提示
  - icon: 🧩
    title: 模块化设计
    details: 支持按需导入和 Tree Shaking，只打包你需要的功能
  - icon: 🔧
    title: 功能全面
    details: 涵盖状态管理、DOM 操作、异步处理、表单处理、性能优化等 50+ hooks
  - icon: 🎨
    title: 开发体验
    details: 遵循 React 最佳实践，API 设计直观，学习成本低
  - icon: 📊
    title: 数据驱动
    details: 提供丰富的数据处理和状态管理 hooks，简化复杂业务逻辑
---

## 🚀 快速体验

### 安装

::: code-group

```bash [npm]
npm install joy-at-meeting
```

```bash [yarn]
yarn add joy-at-meeting
```

```bash [pnpm]
pnpm add joy-at-meeting
```

:::

## 📊 项目数据

<div class="stats-container">
  <div class="stat-item">
    <div class="stat-number">50+</div>
    <div class="stat-label">实用 Hooks</div>
  </div>
  <div class="stat-item">
    <div class="stat-number">100%</div>
    <div class="stat-label">TypeScript</div>
  </div>
  <div class="stat-item">
    <div class="stat-number">0</div>
    <div class="stat-label">运行时依赖</div>
  </div>
  <div class="stat-item">
    <div class="stat-number">< 5KB</div>
    <div class="stat-label">核心包大小</div>
  </div>
</div>

## 🎯 核心特性

### 状态管理
- **useLocalStorage** - 本地存储状态管理
- **useSessionStorage** - 会话存储状态管理
- **useToggle** - 布尔值切换状态管理
- **usePrevious** - 获取前一个值

### DOM 操作
- **useClickOutside** - 检测元素外部点击
- **useHover** - 鼠标悬停状态
- **useIntersectionObserver** - 元素可见性检测
- **useWindowSize** - 窗口尺寸监听

### 异步处理
- **useAsync** - 异步操作状态管理
- **useFetch** - HTTP 请求封装

### 性能优化
- **useDebounce** - 防抖处理
- **useThrottle** - 节流处理
- **useMemoizedCallback** - 回调函数缓存

### 表单处理
- **useForm** - 表单状态管理
- **useValidation** - 表单验证

[查看所有 Hooks →](/api/state-hooks)

## 🌟 为什么选择 Joy At Meeting？

### 🔥 开发效率提升
- 减少 80% 的样板代码
- 统一的 API 设计风格
- 完善的 TypeScript 支持

### 📦 轻量级设计
- 零运行时依赖
- 支持按需导入
- 优秀的 Tree Shaking 支持

<style>
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
  padding: 2rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--vp-c-brand-1);
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
