# State Hooks

状态管理相关的 React hooks，帮助你更优雅地管理组件状态。

## useLocalStorage

将状态持久化到浏览器的 localStorage 中，支持跨标签页同步。

### 语法

```tsx
const { value, setValue, removeValue } = useLocalStorage<T>(key: string, initialValue: T)
```

### 参数

- `key` (string): localStorage 的键名
- `initialValue` (T): 初始值

### 返回值

返回一个对象，包含：
- `value` (T): 当前存储的值
- `setValue` (function): 设置新值的函数，支持函数式更新
- `removeValue` (function): 移除存储值的函数

### 示例

```tsx
import { useLocalStorage } from 'joy-at-meeting'

function UserSettings() {
  const { value: theme, setValue: setTheme, removeValue: removeTheme } = useLocalStorage('theme', 'light')
  const { value: user, setValue: setUser } = useLocalStorage('user', {
    name: '',
    email: ''
  })

  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">浅色主题</option>
        <option value="dark">深色主题</option>
      </select>
      
      <input
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
        placeholder="用户名"
      />
      
      <button onClick={removeTheme}>
        重置主题
      </button>
    </div>
  )
}
```

### 特性

- ✅ 自动序列化/反序列化 JSON
- ✅ 支持复杂数据类型
- ✅ 错误处理（localStorage 不可用时降级到内存存储）
- ✅ TypeScript 类型安全

---

## useToggle

简化布尔值状态的切换操作，提供多种便捷的操作方法。

### 语法

```tsx
const { value, toggle, setTrue, setFalse, setValue } = useToggle(initialValue?: boolean)
```

### 参数

- `initialValue` (boolean, 可选): 初始值，默认为 `false`

### 返回值

返回一个对象，包含：
- `value` (boolean): 当前布尔值
- `toggle` (function): 切换值的函数
- `setTrue` (function): 设置为true的函数
- `setFalse` (function): 设置为false的函数
- `setValue` (function): 设置特定值的函数

### 示例

```tsx
import { useToggle } from 'joy-at-meeting'

function Modal() {
  const { value: isOpen, toggle, setFalse: closeModal } = useToggle(false)
  const { value: isLoading, toggle: toggleLoading, setTrue: startLoading, setFalse: stopLoading } = useToggle()

  const handleSubmit = async () => {
    startLoading() // 开始加载
    try {
      await submitForm()
      closeModal() // 关闭模态框
    } finally {
      stopLoading() // 结束加载
    }
  }

  return (
    <div>
      <button onClick={toggle}>打开模态框</button>
      
      {isOpen && (
        <div className="modal">
          <button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? '提交中...' : '提交'}
          </button>
          <button onClick={closeModal}>取消</button>
        </div>
      )}
    </div>
  )
}
```

### 特性

- ✅ 多种操作方法（toggle、setTrue、setFalse）
- ✅ 语义化的API设计
- ✅ TypeScript 类型安全
- ✅ 性能优化（使用useCallback）

---

## useCounter

提供计数器功能，支持增减、重置等操作。

### 语法

```tsx
const { count, increment, decrement, reset, setCount } = useCounter(initialValue?: number)
```

### 参数

- `initialValue` (number, 可选): 初始值，默认为 `0`

### 返回值

返回一个对象，包含：
- `count` (number): 当前计数值
- `increment` (function): 增加计数的函数
- `decrement` (function): 减少计数的函数
- `reset` (function): 重置计数的函数
- `setCount` (function): 设置特定值的函数，支持函数式更新

### 示例

```tsx
import { useCounter } from 'joy-at-meeting'

function QuantitySelector() {
  const { count, increment, decrement, reset, setCount } = useCounter(1)

  const handleDecrement = () => {
    if (count > 1) decrement()
  }

  const handleIncrement = () => {
    if (count < 99) increment()
  }

  return (
    <div>
      <button onClick={handleDecrement} disabled={count <= 1}>-</button>
      <span>数量: {count}</span>
      <button onClick={handleIncrement} disabled={count >= 99}>+</button>
      
      <div>
        <button onClick={() => setCount(10)}>设为 10</button>
        <button onClick={() => setCount(prev => prev + 5)}>+5</button>
        <button onClick={reset}>重置</button>
      </div>
    </div>
  )
}
```

### 高级示例

```tsx
function ScoreBoard() {
  const playerA = useCounter(0)
  const playerB = useCounter(0)

  const resetGame = () => {
    playerA.reset()
    playerB.reset()
  }

  return (
    <div>
      <div>
        <h3>玩家 A: {playerA.count}</h3>
        <button onClick={playerA.increment}>+1</button>
        <button onClick={() => playerA.setCount(prev => prev + 5)}>+5</button>
      </div>
      
      <div>
        <h3>玩家 B: {playerB.count}</h3>
        <button onClick={playerB.increment}>+1</button>
        <button onClick={() => playerB.setCount(prev => prev + 5)}>+5</button>
      </div>
      
      <button onClick={resetGame}>重置游戏</button>
    </div>
  )
}
```

### 特性

- ✅ 简洁的API设计
- ✅ 支持函数式更新
- ✅ 丰富的操作方法
- ✅ TypeScript 类型安全
- ✅ 性能优化（使用useCallback）

---

## usePrevious

获取状态的前一个值。

### 语法

```tsx
const previousValue = usePrevious<T>(value: T)
```

### 参数

- `value` (T): 要跟踪的值

### 返回值

- `previousValue` (T | undefined): 前一个值，首次渲染时为 `undefined`

### 示例

```tsx
import { useState } from 'react'
import { usePrevious } from 'joy-at-meeting'

function ValueTracker() {
  const [count, setCount] = useState(0)
  const previousCount = usePrevious(count)

  return (
    <div>
      <p>当前值: {count}</p>
      <p>前一个值: {previousCount ?? '无'}</p>
      <p>
        变化: {previousCount !== undefined 
          ? count - previousCount 
          : '首次渲染'
        }
      </p>
      
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
    </div>
  )
}
```

### 高级示例

```tsx
function FormFieldTracker() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  const previousFormData = usePrevious(formData)

  const hasChanged = (field: keyof typeof formData) => {
    return previousFormData && 
           previousFormData[field] !== formData[field]
  }

  return (
    <form>
      <div>
        <input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="姓名"
        />
        {hasChanged('name') && <span>✓ 已修改</span>}
      </div>
      
      <div>
        <input
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="邮箱"
        />
        {hasChanged('email') && <span>✓ 已修改</span>}
      </div>
    </form>
  )
}
```

### 特性

- ✅ 简单易用
- ✅ 支持任意类型
- ✅ 性能优化（使用 useRef）
- ✅ TypeScript 类型安全

## 组合使用

多个状态 hooks 可以组合使用：

```tsx
import { useLocalStorage, useToggle, useCounter } from 'joy-at-meeting'

function GameSettings() {
  // 持久化游戏设置
  const [settings, setSettings] = useLocalStorage('gameSettings', {
    difficulty: 'normal',
    sound: true
  })
  
  // 控制设置面板显示
  const [showSettings, toggleSettings] = useToggle(false)
  
  // 游戏分数
  const { count: score, increment: addScore, reset: resetScore } = useCounter(0)
  
  return (
    <div>
      <div>分数: {score}</div>
      <button onClick={addScore}>得分</button>
      <button onClick={resetScore}>重置分数</button>
      
      <button onClick={toggleSettings}>
        {showSettings ? '隐藏' : '显示'} 设置
      </button>
      
      {showSettings && (
        <div>
          <select 
            value={settings.difficulty}
            onChange={(e) => setSettings({ 
              ...settings, 
              difficulty: e.target.value 
            })}
          >
            <option value="easy">简单</option>
            <option value="normal">普通</option>
            <option value="hard">困难</option>
          </select>
          
          <label>
            <input
              type="checkbox"
              checked={settings.sound}
              onChange={(e) => setSettings({ 
                ...settings, 
                sound: e.target.checked 
              })}
            />
            音效
          </label>
        </div>
      )}
    </div>
  )
}
```