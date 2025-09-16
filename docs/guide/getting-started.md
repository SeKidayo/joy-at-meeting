# 快速开始

欢迎使用 Joy At Meeting！这是一个专为 React 开发者设计的 hooks 库，旨在提供优雅、实用的解决方案。

## 安装

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

## 基本使用

### 按需导入（推荐）

```tsx
import { useLocalStorage, useToggle } from 'joy-at-meeting'

function MyComponent() {
  const [count, setCount] = useLocalStorage('count', 0)
  const [isVisible, toggle] = useToggle(false)

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
      <button onClick={toggle}>
        {isVisible ? '隐藏' : '显示'}
      </button>
      {isVisible && <p>这是一个可切换的内容</p>}
    </div>
  )
}
```

### TypeScript 支持

Joy At Meeting 完全使用 TypeScript 编写，提供完整的类型定义：

```tsx
import { useCounter, UseCounterOptions } from 'joy-at-meeting'

function Counter() {
  const options: UseCounterOptions = {
    min: 0,
    max: 100,
    step: 5
  }
  
  const { count, increment, decrement, reset } = useCounter(10, options)

  return (
    <div>
      <p>当前值: {count}</p>
      <button onClick={increment}>+5</button>
      <button onClick={decrement}>-5</button>
      <button onClick={reset}>重置</button>
    </div>
  )
}
```

## 主要特性

### 🎯 TypeScript 优先
- 完整的类型定义
- 优秀的 IDE 支持
- 类型安全的 API

### 📦 按需导入
- 支持 Tree Shaking
- 减小打包体积
- 只导入需要的功能

### 🚀 开箱即用
- 简洁的 API 设计
- 合理的默认配置
- 无需复杂设置

### 🔧 功能丰富
- **状态管理**: useLocalStorage, useToggle, useCounter
- **DOM 操作**: useClickOutside, useScrollPosition, useElementSize
- **异步处理**: useAsync, useFetch
- **性能优化**: useDebounce, useThrottle, useMemoizedCallback
- **表单处理**: useForm, useValidation

## 下一步

- [安装指南](/guide/installation) - 详细的安装说明
- [基本用法](/guide/basic-usage) - 更多使用示例
- [API 文档](/api/state-hooks) - 完整的 API 参考