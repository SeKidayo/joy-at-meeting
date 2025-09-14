---
layout: home

hero:
  name: "Joy At Meeting"
  text: "优雅实用的 React Hooks 集合"
  tagline: 提升开发效率，让代码更简洁优雅
  image:
    src: /logo.svg
    alt: Joy at Meeting
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 查看 GitHub
      link: https://github.com/SeKidayo/joy-at-meeting

features:
  - icon: 🎯
    title: TypeScript 优先
    details: 完整的 TypeScript 支持，提供优秀的开发体验和类型安全
  - icon: 🚀
    title: 开箱即用
    details: 精心设计的 API，简单易用，无需复杂配置
  - icon: 📦
    title: 按需导入
    details: 支持 Tree Shaking，只打包你使用的 hooks，减小包体积
  - icon: 🔧
    title: 功能丰富
    details: 涵盖状态管理、DOM 操作、异步处理、性能优化等多个方面
  - icon: 🎨
    title: 现代化设计
    details: 遵循 React Hooks 最佳实践，代码简洁优雅
  - icon: 📚
    title: 完善文档
    details: 详细的使用说明和示例，帮助你快速上手
---

## 快速体验

```bash
npm install joy-at-meeting
```

```tsx
import { useLocalStorage, useToggle } from 'joy-at-meeting'

function App() {
  const [name, setName] = useLocalStorage('username', '')
  const [isVisible, toggle] = useToggle(false)

  return (
    <div>
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)}
        placeholder="输入用户名"
      />
      <button onClick={toggle}>
        {isVisible ? '隐藏' : '显示'}
      </button>
      {isVisible && <p>Hello, {name}!</p>}
    </div>
  )
}
```

## 特色 Hooks

### 状态管理
- **useLocalStorage** - 持久化状态到本地存储
- **useToggle** - 布尔值状态切换
- **useCounter** - 计数器状态管理

### DOM 操作
- **useClickOutside** - 检测元素外部点击
- **useScrollPosition** - 监听滚动位置
- **useElementSize** - 监听元素尺寸变化

### 性能优化
- **useDebounce** - 防抖处理
- **useThrottle** - 节流处理
- **useMemoizedCallback** - 回调函数记忆化

### 异步处理
- **useAsync** - 异步操作状态管理
- **useFetch** - HTTP 请求封装

[查看所有 Hooks →](/api/state-hooks)