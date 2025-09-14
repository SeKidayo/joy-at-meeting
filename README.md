# Joy At Meeting

一个优雅且实用的 React Hooks 库，提供常用的自定义 Hooks 来简化 React 开发。

## 特性

- 🚀 **轻量级**: 零依赖，体积小巧
- 📦 **TypeScript**: 完整的类型定义支持
- 🔧 **易用性**: 简单直观的API设计
- 🎯 **实用性**: 涵盖常见的React开发场景
- 📱 **兼容性**: 支持React 16.8+
- 🏗️ **模块化**: 按功能分类，支持按需导入
- ⚡ **高性能**: 内置性能优化和防抖节流
- 🌐 **异步处理**: 完善的异步状态管理
- 📋 **表单处理**: 强大的表单验证和状态管理
- 🖱️ **DOM交互**: 丰富的DOM事件和状态监听
- 🎨 **用户体验**: 提升交互体验的实用工具

## 安装

```bash
npm install joy-at-meeting
```

或者使用 yarn:

```bash
yarn add joy-at-meeting
```

## 快速开始

```tsx
import React, { useRef } from 'react';
import {
  useLocalStorage,
  useToggle,
  useCounter,
  useHover,
  useClickOutside,
  useKeyPress
} from 'joy-at-meeting';

function App() {
  const [name, setName, removeName] = useLocalStorage('username', '');
  const [isVisible, toggle] = useToggle(false);
  const [count, increment, decrement, reset] = useCounter(0);
  
  // DOM 交互示例
  const hoverRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const isHovered = useHover(hoverRef);
  const isEnterPressed = useKeyPress('Enter');
  
  useClickOutside(modalRef, () => {
    if (isVisible) toggle();
  });

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="输入用户名 (按Enter键切换计数器)"
        onKeyDown={(e) => e.key === 'Enter' && toggle()}
      />
      <button onClick={removeName}>清除用户名</button>
      
      <div
        ref={hoverRef}
        style={{
          padding: '10px',
          backgroundColor: isHovered ? '#f0f0f0' : 'transparent',
          border: '1px solid #ccc',
          margin: '10px 0'
        }}
      >
        悬停状态: {isHovered ? '悬停中' : '未悬停'}
      </div>
      
      <button onClick={toggle}>
        {isVisible ? '隐藏' : '显示'} 计数器
      </button>
      
      {isEnterPressed && <p>检测到Enter键按下!</p>}
      
      {isVisible && (
        <div
          ref={modalRef}
          style={{
            padding: '20px',
            border: '2px solid #007bff',
            borderRadius: '8px',
            margin: '10px 0'
          }}
        >
          <p>计数: {count}</p>
          <button onClick={increment}>+</button>
          <button onClick={decrement}>-</button>
          <button onClick={reset}>重置</button>
          <p><small>点击外部区域关闭</small></p>
        </div>
      )}
    </div>
  );
}
```

## API 文档

### 状态管理 Hooks

#### useLocalStorage

管理 localStorage 的 Hook，支持自动序列化和反序列化。

```tsx
const { value, setValue, removeValue } = useLocalStorage(key, initialValue);
```

**参数:**
- `key: string` - localStorage 的键名
- `initialValue: T` - 初始值

**返回值:**
- `value: T` - 当前存储的值
- `setValue: (value: T | ((prev: T) => T)) => void` - 设置新值
- `removeValue: () => void` - 移除存储的值

#### useToggle

管理布尔状态的 Hook，提供便捷的切换操作。

```tsx
const { value, toggle, setTrue, setFalse, setValue } = useToggle(initialValue);
```

**参数:**
- `initialValue?: boolean` - 初始布尔值，默认为 false

**返回值:**
- `value: boolean` - 当前布尔值
- `toggle: () => void` - 切换值
- `setTrue: () => void` - 设置为 true
- `setFalse: () => void` - 设置为 false
- `setValue: (value: boolean) => void` - 设置特定值

#### useCounter

管理计数器状态的 Hook，提供常用的计数操作。

```tsx
const { count, increment, decrement, reset, setCount } = useCounter(initialValue);
```

**参数:**
- `initialValue?: number` - 初始计数值，默认为 0

**返回值:**
- `count: number` - 当前计数值
- `increment: () => void` - 增加计数
- `decrement: () => void` - 减少计数
- `reset: () => void` - 重置计数
- `setCount: (value: number | ((prev: number) => number)) => void` - 设置特定值

### 异步处理 Hooks

#### useAsync

管理异步操作状态的 Hook。

```tsx
const { data, error, isLoading, execute, reset } = useAsync(asyncFunction);
```

**参数:**
- `asyncFunction: (...args: any[]) => Promise<T>` - 异步函数
- `immediate: boolean` - 是否立即执行，默认为 false

**返回值:**
- `data: T | null` - 异步操作的数据
- `error: Error | null` - 错误信息
- `status: AsyncStatus` - 当前状态
- `isLoading: boolean` - 是否正在加载
- `execute: (...args: any[]) => Promise<T>` - 执行异步操作
- `reset: () => void` - 重置状态

#### useFetch

HTTP请求的 Hook，基于 useAsync 实现。

```tsx
const { data, error, isLoading, execute, refetch } = useFetch('/api/users');
```

**参数:**
- `initialUrl?: string` - 初始请求URL
- `initialOptions?: FetchOptions` - 初始请求选项
- `immediate: boolean` - 是否立即执行请求，默认为 false

**返回值:**
- 继承 useAsync 的所有返回值
- `refetch: () => Promise<T>` - 重新请求函数

### DOM 操作 Hooks

#### useClickOutside

检测元素外部的点击事件。

```tsx
const ref = useRef<HTMLDivElement>(null);
useClickOutside(ref, () => {
  console.log('点击了外部区域');
});
```

**参数:**
- `ref: RefObject<T>` - 要监听的元素引用
- `handler: (event: Event) => void` - 点击外部时的回调函数
- `mouseEvent?: keyof DocumentEventMap` - 鼠标事件类型，默认为 'mousedown'
- `touchEvent?: keyof DocumentEventMap` - 触摸事件类型，默认为 'touchstart'

#### useElementSize

监听元素尺寸变化，使用 ResizeObserver API。

```tsx
const ref = useRef<HTMLDivElement>(null);
const { width, height } = useElementSize(ref);
```

**参数:**
- `ref: RefObject<T>` - 要监听的元素引用

**返回值:**
- `ElementSize` - 元素尺寸对象
  - `width: number` - 元素宽度
  - `height: number` - 元素高度

#### useHover

监听元素的鼠标悬停状态。

```tsx
const ref = useRef<HTMLDivElement>(null);
const isHovered = useHover(ref, {
  mouseEnterDelayMS: 100,
  mouseLeaveDelayMS: 200
});
```

**参数:**
- `ref: RefObject<T>` - 要监听的元素引用
- `options?: UseHoverOptions` - 配置选项
  - `mouseEnterDelayMS?: number` - 鼠标进入延迟时间
  - `mouseLeaveDelayMS?: number` - 鼠标离开延迟时间

**返回值:**
- `boolean` - 是否处于悬停状态

#### useKeyPress

监听键盘按键事件。

```tsx
const isPressed = useKeyPress('Enter');
const isEscPressed = useKeyPress(['Escape', 'Esc']);
```

**参数:**
- `targetKey: string | string[]` - 要监听的按键或按键数组
- `options?: UseKeyPressOptions` - 配置选项
  - `event?: 'keydown' | 'keyup'` - 监听的事件类型
  - `target?: EventTarget | null` - 监听的目标元素
  - `exactMatch?: boolean` - 是否精确匹配

**返回值:**
- `boolean` - 按键是否被按下

#### useIntersectionObserver

监听元素与视口交叉状态的 Hook。

```tsx
const { ref, isIntersecting, entry } = useIntersectionObserver({
  threshold: 0.5,
  triggerOnce: true
});
```

**参数:**
- `options: UseIntersectionObserverOptions` - 配置选项
  - `root?: Element | null` - 根元素
  - `rootMargin?: string` - 根边距
  - `threshold?: number | number[]` - 触发阈值
  - `triggerOnce?: boolean` - 是否只触发一次

**返回值:**
- `ref: (node: Element | null) => void` - 元素引用
- `entry: IntersectionObserverEntry | null` - 交叉条目信息
- `isIntersecting: boolean` - 是否正在交叉

#### useWindowSize

监听窗口尺寸变化的 Hook。

```tsx
const { width, height } = useWindowSize({ debounceMs: 100 });
```

**参数:**
- `options?: UseWindowSizeOptions` - 配置选项
  - `debounceMs?: number` - 防抖延迟时间
  - `initialSize?: WindowSize` - 初始尺寸（用于SSR）

**返回值:**
- `WindowSize` - 窗口尺寸对象
  - `width: number` - 窗口宽度
  - `height: number` - 窗口高度

#### useFocus

管理元素焦点状态的 Hook。

```tsx
const { ref, isFocused, setFocus, removeFocus } = useFocus();
```

**返回值:**
- `ref: RefObject<T>` - 元素引用
- `isFocused: boolean` - 是否获得焦点
- `setFocus: () => void` - 设置焦点
- `removeFocus: () => void` - 移除焦点

#### useScrollPosition

监听滚动位置的 Hook。

```tsx
const { x, y } = useScrollPosition();
```

**返回值:**
- `ScrollPosition` - 滚动位置对象
  - `x: number` - 水平滚动位置
  - `y: number` - 垂直滚动位置

### 性能优化 Hooks

#### useDebounce

防抖处理的 Hook，延迟更新值直到指定时间内没有新的变化。

```tsx
const debouncedValue = useDebounce(value, delay);
```

**参数:**
- `value: T` - 需要防抖的值
- `delay: number` - 延迟时间（毫秒）

**返回值:**
- `T` - 防抖后的值

#### useMemoizedCallback

创建稳定回调函数引用的 Hook。

```tsx
const memoizedCallback = useMemoizedCallback(callback);
```

**参数:**
- `callback: T` - 要缓存的回调函数

**返回值:**
- `memoizedCallback: T` - 稳定的回调函数引用

#### useThrottle

节流处理的 Hook。

```tsx
const throttledValue = useThrottle(value, 1000, { leading: true, trailing: false });
```

**参数:**
- `value: T` - 要节流的值
- `delay: number` - 节流延迟时间（毫秒）
- `options?: UseThrottleOptions` - 配置选项

**返回值:**
- `throttledValue: T` - 节流后的值

### 表单处理 Hooks

#### useForm

表单状态管理的 Hook。

```tsx
const {
  formState,
  getFieldProps,
  handleSubmit,
  resetForm
} = useForm({
  fields: {
    email: { required: true, validate: validationRules.email() },
    password: { required: true }
  },
  onSubmit: async (values) => {
    // 处理表单提交
  }
});
```

**参数:**
- `config: FormConfig` - 表单配置

**返回值:**
- `formState: FormState` - 表单状态
- `getFieldProps: (name: string) => FieldProps` - 获取字段属性
- `handleSubmit: (event?: React.FormEvent) => Promise<void>` - 提交处理函数
- 其他表单操作函数...

#### useValidation

表单验证的 Hook。

```tsx
const { validate, validateAll } = useValidation({
  rules: [validationRules.required(), validationRules.email()]
});
```

**参数:**
- `config?: ValidatorConfig` - 验证器配置

**返回值:**
- `validate: (value: any, fieldName?: string) => Promise<string | undefined>` - 验证函数
- `validateAll: (values: Record<string, any>) => Promise<Record<string, string | undefined>>` - 批量验证
- `createValidator: (rules: ValidationRule[]) => ValidationRule` - 创建验证器

### 工具 Hooks

#### usePrevious

获取上一次渲染值的 Hook，用于比较前后状态变化。

```tsx
const previousValue = usePrevious(value);
```

**参数:**
- `value: T` - 当前值

**返回值:**
- `T | undefined` - 上一次的值

## 开发

### 本地开发

```bash
# 克隆项目
git clone https://github.com/SeKidayo/joy-at-meeting.git
cd joy-at-meeting

# 安装依赖
npm install

# 开发模式（监听文件变化）
npm run dev

# 构建
npm run build

# 类型检查
npm run type-check

# 代码检查和修复
npm run lint
npm run lint:fix

# 代码格式化
npm run format
npm run format:check

# 测试
npm run test
npm run test:coverage

# 文档开发和构建
npm run docs:dev
npm run docs:build
npm run docs:preview
```

### 项目结构

```
joy-at-meeting/
├── src/
│   ├── hooks/
│   │   ├── async/              # 异步处理 Hooks
│   │   │   ├── useAsync.ts
│   │   │   └── useFetch.ts
│   │   ├── dom/                # DOM 操作 Hooks
│   │   │   ├── useClickOutside.ts
│   │   │   ├── useElementSize.ts
│   │   │   ├── useFocus.ts
│   │   │   ├── useHover.ts
│   │   │   ├── useIntersectionObserver.ts
│   │   │   ├── useKeyPress.ts
│   │   │   ├── useScrollPosition.ts
│   │   │   └── useWindowSize.ts
│   │   ├── form/               # 表单处理 Hooks
│   │   │   ├── useForm.ts
│   │   │   └── useValidation.ts
│   │   ├── performance/        # 性能优化 Hooks
│   │   │   ├── useDebounce.ts
│   │   │   ├── useMemoizedCallback.ts
│   │   │   └── useThrottle.ts
│   │   ├── state/              # 状态管理 Hooks
│   │   │   ├── useCounter.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   └── useToggle.ts
│   │   └── utils/              # 工具 Hooks
│   │       └── usePrevious.ts
│   └── index.ts
├── docs/                       # VitePress 文档
│   ├── .vitepress/
│   ├── api/
│   ├── guide/
│   └── index.md
├── scripts/
│   └── pre-publish.cjs
├── dist/
├── package.json
├── tsconfig.json
├── rollup.config.js
└── README.md
```

## 发布到 NPM

1. 确保所有测试通过
2. 更新版本号
3. 构建项目
4. 发布

```bash
# 快速发布（补丁版本）
npm run release:patch

# 发布次要版本
npm run release:minor

# 发布主要版本
npm run release:major

# 手动发布流程
npm version patch  # 或 minor, major
npm run build
npm publish
```

## 文档

在线文档: [https://SeKidayo.github.io/joy-at-meeting/](https://SeKidayo.github.io/joy-at-meeting/)

本地查看文档:
```bash
npm run docs:dev
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License