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

## 组合使用

多个状态 hooks 可以组合使用：

```tsx
import { useLocalStorage, useToggle } from 'joy-at-meeting'

function GameSettings() {
  // 持久化游戏设置
  const [settings, setSettings] = useLocalStorage('gameSettings', {
    difficulty: 'normal',
    sound: true
  })
  
  // 控制设置面板显示
  const [showSettings, toggleSettings] = useToggle(false)
  
  return (
    <div>
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