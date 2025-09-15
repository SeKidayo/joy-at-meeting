# 基本用法

本页面将通过实际示例展示如何使用 Joy at Meeting 中的各种 hooks。

## 状态管理 Hooks

### useLocalStorage

持久化状态到浏览器本地存储：

```tsx
import { useLocalStorage } from 'joy-at-meeting'

function UserProfile() {
  const [user, setUser] = useLocalStorage('user', {
    name: '',
    email: ''
  })

  return (
    <div>
      <input
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
        placeholder="姓名"
      />
      <input
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="邮箱"
      />
      <p>当前用户: {user.name} ({user.email})</p>
    </div>
  )
}
```

### useToggle

简化布尔值状态的切换：

```tsx
import { useToggle } from 'joy-at-meeting'

function ToggleExample() {
  const [isVisible, toggle, setVisible] = useToggle(false)
  const [isEnabled, toggleEnabled] = useToggle(true)

  return (
    <div>
      <button onClick={toggle}>
        {isVisible ? '隐藏' : '显示'} 内容
      </button>
      <button onClick={() => setVisible(true)}>强制显示</button>
      
      {isVisible && (
        <div>
          <p>这是可切换的内容</p>
          <button onClick={toggleEnabled}>
            {isEnabled ? '禁用' : '启用'} 功能
          </button>
        </div>
      )}
    </div>
  )
}
```

### useCounter

计数器状态管理：

```tsx
import { useCounter } from 'joy-at-meeting'

function CounterExample() {
  const { count, increment, decrement, reset, set } = useCounter(0, {
    min: 0,
    max: 100,
    step: 5
  })

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={increment}>+5</button>
      <button onClick={decrement}>-5</button>
      <button onClick={() => set(50)}>设为 50</button>
      <button onClick={reset}>重置</button>
    </div>
  )
}
```

## DOM 操作 Hooks

### useClickOutside

检测元素外部点击：

```tsx
import { useRef, useState } from 'react'
import { useClickOutside } from 'joy-at-meeting'

function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useClickOutside(menuRef, () => {
    setIsOpen(false)
  })

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        菜单 {isOpen ? '▲' : '▼'}
      </button>
      {isOpen && (
        <div ref={menuRef} className="dropdown-menu">
          <div>菜单项 1</div>
          <div>菜单项 2</div>
          <div>菜单项 3</div>
        </div>
      )}
    </div>
  )
}
```

### useScrollPosition

监听滚动位置：

```tsx
import { useScrollPosition } from 'joy-at-meeting'

function ScrollIndicator() {
  const { x, y } = useScrollPosition()
  const progress = (y / (document.body.scrollHeight - window.innerHeight)) * 100

  return (
    <div className="scroll-indicator">
      <div>滚动位置: ({x}, {y})</div>
      <div className="progress-bar">
        <div 
          className="progress" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
```

### useElementSize

监听元素尺寸变化：

```tsx
import { useRef } from 'react'
import { useElementSize } from 'joy-at-meeting'

function ResizableBox() {
  const boxRef = useRef<HTMLDivElement>(null)
  const { width, height } = useElementSize(boxRef)

  return (
    <div>
      <div 
        ref={boxRef}
        style={{ 
          width: '50%', 
          height: '200px', 
          border: '1px solid #ccc',
          resize: 'both',
          overflow: 'auto'
        }}
      >
        <p>尺寸: {width} x {height}</p>
        <p>拖拽右下角调整大小</p>
      </div>
    </div>
  )
}
```

## 性能优化 Hooks

### useDebounce

防抖处理：

```tsx
import { useState, useEffect } from 'react'
import { useDebounce } from 'joy-at-meeting'

function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  // 模拟搜索 API 调用
  useEffect(() => {
    if (debouncedSearchTerm) {
      console.log('搜索:', debouncedSearchTerm)
      // 执行搜索逻辑
    }
  }, [debouncedSearchTerm])

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="输入搜索关键词..."
      />
      <p>实时输入: {searchTerm}</p>
      <p>防抖后: {debouncedSearchTerm}</p>
    </div>
  )
}
```

### useThrottle

节流处理：

```tsx
import { useState, useEffect } from 'react'
import { useThrottle } from 'joy-at-meeting'

function MouseTracker() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const throttledMousePos = useThrottle(mousePos, 100)

  const handleMouseMove = (e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div>
      <p>实时位置: ({mousePos.x}, {mousePos.y})</p>
      <p>节流位置: ({throttledMousePos.x}, {throttledMousePos.y})</p>
    </div>
  )
}
```

## 异步处理 Hooks

### useAsync

异步操作状态管理：

```tsx
import { useAsync } from 'joy-at-meeting'

function UserList() {
  const fetchUsers = async () => {
    const response = await fetch('/api/users')
    if (!response.ok) throw new Error('获取用户失败')
    return response.json()
  }

  const { data: users, isLoading, error, execute } = useAsync(fetchUsers)

  return (
    <div>
      <button onClick={execute} disabled={isLoading}>
        {isLoading ? '加载中...' : '获取用户'}
      </button>
      
      {error && <p style={{ color: 'red' }}>错误: {error.message}</p>}
      
      {users && (
        <ul>
          {users.map((user: any) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

### useFetch

HTTP 请求封装：

```tsx
import { useFetch } from 'joy-at-meeting'
import { useEffect } from 'react'

function PostDetail({ postId }: { postId: string }) {
  const { data: post, isLoading, error, execute } = useFetch<{
    title: string
    content: string
  }>()

  useEffect(() => {
    if (postId) {
      execute(`/api/posts/${postId}`, {
        headers: {
          'Authorization': 'Bearer token'
        }
      })
    }
  }, [postId, execute])

  if (isLoading) return <div>加载中...</div>
  if (error) return <div>错误: {error.message}</div>
  if (!post) return <div>未找到文章</div>

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}
```

## 表单处理 Hooks

### useForm

表单状态管理：

```tsx
import { useForm } from 'joy-at-meeting'

function ContactForm() {
  const { values, errors, handleChange, handleSubmit, reset } = useForm({
    initialValues: {
      name: '',
      email: '',
      message: ''
    },
    validate: (values) => {
      const errors: any = {}
      if (!values.name) errors.name = '姓名不能为空'
      if (!values.email) errors.email = '邮箱不能为空'
      if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = '邮箱格式不正确'
      }
      return errors
    },
    onSubmit: (values) => {
      console.log('提交表单:', values)
      // 处理表单提交
    }
  })

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="name"
          value={values.name}
          onChange={handleChange}
          placeholder="姓名"
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>
      
      <div>
        <input
          name="email"
          value={values.email}
          onChange={handleChange}
          placeholder="邮箱"
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      
      <div>
        <textarea
          name="message"
          value={values.message}
          onChange={handleChange}
          placeholder="留言"
        />
      </div>
      
      <button type="submit">提交</button>
      <button type="button" onClick={reset}>重置</button>
    </form>
  )
}
```

## 组合使用

多个 hooks 可以组合使用以实现复杂功能：

```tsx
import { 
  useLocalStorage, 
  useToggle, 
  useDebounce, 
  useAsync 
} from 'joy-at-meeting'
import { useState, useEffect } from 'react'

function SmartSearchApp() {
  const [searchHistory, setSearchHistory] = useLocalStorage('searchHistory', [])
  const [showHistory, toggleHistory] = useToggle(false)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  
  const searchAPI = async (q: string) => {
    const response = await fetch(`/api/search?q=${q}`)
    return response.json()
  }
  
  const { data: results, isLoading, execute } = useAsync(searchAPI)
  
  // 当搜索词变化时执行搜索
  useEffect(() => {
    if (debouncedQuery) {
      execute(debouncedQuery)
    }
  }, [debouncedQuery, execute])
  
  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm)
    if (searchTerm && !searchHistory.includes(searchTerm)) {
      setSearchHistory([searchTerm, ...searchHistory.slice(0, 9)])
    }
  }
  
  return (
    <div>
      <div className="search-container">
        <input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="搜索..."
        />
        <button onClick={toggleHistory}>
          {showHistory ? '隐藏' : '显示'} 历史
        </button>
      </div>
      
      {showHistory && (
        <div className="search-history">
          {searchHistory.map((term, index) => (
            <button key={index} onClick={() => setQuery(term)}>
              {term}
            </button>
          ))}
        </div>
      )}
      
      {isLoading && <div>搜索中...</div>}
      
      {results && (
        <div className="search-results">
          {results.map((item: any) => (
            <div key={item.id}>{item.title}</div>
          ))}
        </div>
      )}
    </div>
  )
}
```

## 最佳实践

1. **按需导入**: 只导入需要的 hooks
2. **类型安全**: 充分利用 TypeScript 类型定义
3. **性能优化**: 合理使用防抖和节流
4. **错误处理**: 妥善处理异步操作的错误状态
5. **组合使用**: 多个 hooks 组合实现复杂功能

## 下一步

- 查看 [API 文档](/api/state-hooks) 了解详细的参数和返回值
- 浏览 [GitHub 示例](https://github.com/SeKidayo/joy-at-meeting/tree/main/examples) 获取更多代码示例