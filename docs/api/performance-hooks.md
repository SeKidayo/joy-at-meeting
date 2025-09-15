# Performance Hooks

性能优化相关的 React hooks，帮助你提升应用性能和用户体验。

## useDebounce

防抖 hook，延迟执行频繁变化的值更新。

### 语法

```tsx
const debouncedValue = useDebounce<T>(
  value: T,
  delay: number
)
```

### 参数

- `value` (T): 需要防抖的值
- `delay` (number): 延迟时间（毫秒）

### 返回值

- `debouncedValue` (T): 防抖后的值

### 基础示例

```tsx
import { useDebounce } from 'joy-at-meeting'
import { useState, useEffect } from 'react'

function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  
  // 防抖搜索词，500ms 延迟
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      setLoading(true)
      
      // 模拟 API 调用
      fetch(`/api/search?q=${debouncedSearchTerm}`)
        .then(response => response.json())
        .then(data => {
          setResults(data.results)
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    } else {
      setResults([])
    }
  }, [debouncedSearchTerm])
  
  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="搜索..."
      />
      
      {loading && <div>搜索中...</div>}
      
      <ul>
        {results.map((result: any) => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

### 实时验证示例

```tsx
function FormValidation() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  
  // 防抖邮箱验证，300ms 延迟
  const debouncedEmail = useDebounce(email, 300)
  
  useEffect(() => {
    if (debouncedEmail) {
      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(debouncedEmail)) {
        setEmailError('请输入有效的邮箱地址')
      } else {
        setEmailError('')
        
        // 检查邮箱是否已存在
        fetch(`/api/check-email?email=${debouncedEmail}`)
          .then(response => response.json())
          .then(data => {
            if (data.exists) {
              setEmailError('该邮箱已被注册')
            }
          })
      }
    } else {
      setEmailError('')
    }
  }, [debouncedEmail])
  
  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="请输入邮箱"
        style={{
          borderColor: emailError ? 'red' : email && !emailError ? 'green' : '#ccc'
        }}
      />
      
      {emailError && (
        <p style={{ color: 'red', fontSize: '14px' }}>
          {emailError}
        </p>
      )}
      
      {email && !emailError && debouncedEmail && (
        <p style={{ color: 'green', fontSize: '14px' }}>
          ✓ 邮箱可用
        </p>
      )}
    </div>
  )
}
```

### 窗口大小监听

```tsx
function ResponsiveComponent() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })
  
  // 防抖窗口大小变化，避免频繁重新渲染
  const debouncedWindowSize = useDebounce(windowSize, 100)
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  const isMobile = debouncedWindowSize.width < 768
  const isTablet = debouncedWindowSize.width >= 768 && debouncedWindowSize.width < 1024
  const isDesktop = debouncedWindowSize.width >= 1024
  
  return (
    <div>
      <h2>响应式组件</h2>
      <p>窗口尺寸: {debouncedWindowSize.width} x {debouncedWindowSize.height}</p>
      
      {isMobile && <div>移动端布局</div>}
      {isTablet && <div>平板端布局</div>}
      {isDesktop && <div>桌面端布局</div>}
    </div>
  )
}
```

### 特性

- ✅ 减少不必要的 API 调用
- ✅ 提升搜索体验
- ✅ 优化性能
- ✅ TypeScript 类型安全

---

## useThrottle

节流 hook，限制函数执行频率。

### 语法

```tsx
const throttledValue = useThrottle<T>(
  value: T,
  delay: number,
  options?: UseThrottleOptions
)
```

### 参数

- `value` (T): 需要节流的值
- `delay` (number): 节流延迟时间（毫秒）
- `options` (UseThrottleOptions, 可选): 配置选项

### UseThrottleOptions

```tsx
interface UseThrottleOptions {
  leading?: boolean   // 是否在第一次调用时立即执行，默认为 true
  trailing?: boolean  // 是否在最后一次调用后延迟执行，默认为 true
}

### 返回值

- `throttledValue` (T): 节流后的值

### 滚动监听示例

```tsx
import { useThrottle } from 'joy-at-meeting'
import { useState, useEffect } from 'react'

function ScrollProgress() {
  const [scrollY, setScrollY] = useState(0)
  
  // 节流滚动位置，每 100ms 最多更新一次
  const throttledScrollY = useThrottle(scrollY, 100)
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // 计算滚动进度
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight
  const scrollProgress = Math.min((throttledScrollY / documentHeight) * 100, 100)
  
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${scrollProgress}%`,
        height: '4px',
        backgroundColor: '#007bff',
        zIndex: 1000,
        transition: 'width 0.1s ease'
      }}
    />
  )
}
```

### 鼠标移动跟踪

```tsx
function MouseTracker() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  // 节流鼠标位置，每 50ms 最多更新一次
  const throttledPosition = useThrottle(mousePosition, 50)
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          left: throttledPosition.x - 10,
          top: throttledPosition.y - 10,
          width: '20px',
          height: '20px',
          backgroundColor: 'red',
          borderRadius: '50%',
          pointerEvents: 'none',
          transition: 'all 0.05s ease'
        }}
      />
      
      <div style={{ padding: '20px' }}>
        <h2>鼠标跟踪器</h2>
        <p>鼠标位置: ({throttledPosition.x}, {throttledPosition.y})</p>
        <p>移动鼠标查看红色圆点跟随效果</p>
      </div>
    </div>
  )
}
```

### API 调用限制

```tsx
function RealTimeChart() {
  const [data, setData] = useState([])
  const [updateTrigger, setUpdateTrigger] = useState(0)
  
  // 节流数据更新，每 2 秒最多更新一次
  const throttledTrigger = useThrottle(updateTrigger, 2000)
  
  useEffect(() => {
    // 模拟实时数据获取
    fetch('/api/realtime-data')
      .then(response => response.json())
      .then(newData => setData(newData))
  }, [throttledTrigger])
  
  useEffect(() => {
    // 模拟数据变化触发器
    const interval = setInterval(() => {
      setUpdateTrigger(prev => prev + 1)
    }, 500) // 每 500ms 触发一次，但实际更新被节流到 2 秒
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div>
      <h2>实时图表</h2>
      <p>数据更新次数: {throttledTrigger}</p>
      <div>
        {data.map((item: any, index) => (
          <div key={index} style={{ 
            height: `${item.value}px`, 
            width: '20px', 
            backgroundColor: 'blue',
            display: 'inline-block',
            margin: '0 2px'
          }} />
        ))}
      </div>
    </div>
  )
}
```

### 按钮点击限制

```tsx
function LikeButton({ postId }: { postId: string }) {
  const [likes, setLikes] = useState(0)
  const [clickCount, setClickCount] = useState(0)
  
  // 节流点击，每 1 秒最多处理一次
  const throttledClickCount = useThrottle(clickCount, 1000)
  
  useEffect(() => {
    if (throttledClickCount > 0) {
      // 发送点赞请求
      fetch(`/api/posts/${postId}/like`, {
        method: 'POST'
      })
        .then(response => response.json())
        .then(data => {
          setLikes(data.likes)
        })
    }
  }, [throttledClickCount, postId])
  
  const handleLike = () => {
    setClickCount(prev => prev + 1)
    // 立即更新 UI，给用户反馈
    setLikes(prev => prev + 1)
  }
  
  return (
    <button 
      onClick={handleLike}
      style={{
        padding: '8px 16px',
        backgroundColor: '#ff6b6b',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      ❤️ {likes} 点赞
    </button>
  )
}
```

### 特性

- ✅ 限制函数执行频率
- ✅ 提升滚动性能
- ✅ 减少 API 调用
- ✅ TypeScript 类型安全

---

## useMemoizedCallback

创建一个稳定的回调函数引用，避免子组件不必要的重渲染。

### 语法

```tsx
const memoizedCallback = useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T
): T
```

### 参数

- `callback` (function): 要缓存的回调函数

### 返回值

- `memoizedCallback` (function): 稳定的回调函数引用

### 基础示例

```tsx
import { useMemoizedCallback } from 'joy-at-meeting'
import { useState } from 'react'

function ParentComponent() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')
  
  // 使用 useMemoizedCallback 创建稳定的回调引用
  const handleClick = useMemoizedCallback((value: number) => {
    setCount(prev => prev + value)
    console.log('当前计数:', count + value)
  })
  
  return (
    <div>
      <p>计数: {count}</p>
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)}
        placeholder="输入名称"
      />
      
      {/* ChildComponent 不会因为 name 变化而重新渲染 */}
      <ChildComponent onClick={handleClick} />
    </div>
  )
}

const ChildComponent = React.memo(({ onClick }: { onClick: (value: number) => void }) => {
  console.log('ChildComponent 渲染') // 只在首次渲染时打印
  
  return (
    <div>
      <button onClick={() => onClick(1)}>+1</button>
      <button onClick={() => onClick(5)}>+5</button>
      <button onClick={() => onClick(10)}>+10</button>
    </div>
  )
})
```

### 与 useCallback 的对比

```tsx
function ComparisonExample() {
  const [count, setCount] = useState(0)
  const [other, setOther] = useState('')
  
  // 使用 useCallback - 需要手动管理依赖
  const callbackWithUseCallback = useCallback((value: number) => {
    setCount(prev => prev + value)
    console.log('当前值:', count) // 可能获取到过期的 count 值
  }, [count]) // 每次 count 变化都会创建新的函数引用
  
  // 使用 useMemoizedCallback - 自动获取最新值
  const callbackWithMemoized = useMemoizedCallback((value: number) => {
    setCount(prev => prev + value)
    console.log('当前值:', count) // 总是获取最新的 count 值
  }) // 函数引用永远不变
  
  return (
    <div>
      <p>计数: {count}</p>
      <input 
        value={other} 
        onChange={(e) => setOther(e.target.value)}
        placeholder="其他状态"
      />
      
      {/* 使用 useCallback 的组件会在 count 变化时重新渲染 */}
      <MemoChild title="useCallback" onClick={callbackWithUseCallback} />
      
      {/* 使用 useMemoizedCallback 的组件永远不会重新渲染 */}
      <MemoChild title="useMemoizedCallback" onClick={callbackWithMemoized} />
    </div>
  )
}
```

### 特性

- ✅ 稳定的函数引用，永远不变
- ✅ 自动获取最新的状态和 props
- ✅ 避免子组件不必要的重渲染
- ✅ 无需手动管理依赖数组
- ✅ TypeScript 类型安全

---

## useThrottledCallback

节流回调函数，限制函数执行频率。

### 语法

```tsx
const throttledCallback = useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options?: UseThrottleOptions
): T
```

### 参数

- `callback` (function): 要节流的回调函数
- `delay` (number): 节流延迟时间（毫秒）
- `options` (UseThrottleOptions, 可选): 配置选项

### 返回值

- `throttledCallback` (function): 节流后的回调函数

### 基础示例

```tsx
import { useThrottledCallback } from 'joy-at-meeting'
import { useState } from 'react'

function SearchWithThrottledCallback() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  
  // 节流搜索函数，每 500ms 最多执行一次
  const throttledSearch = useThrottledCallback(
    async (searchTerm: string) => {
      if (searchTerm.trim()) {
        console.log('执行搜索:', searchTerm)
        const response = await fetch(`/api/search?q=${searchTerm}`)
        const data = await response.json()
        setResults(data.results)
      } else {
        setResults([])
      }
    },
    500,
    { leading: true, trailing: true }
  )
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    throttledSearch(value)
  }
  
  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="输入搜索关键词"
        style={{ width: '100%', padding: '8px' }}
      />
      
      <div>
        {results.map((result: any) => (
          <div key={result.id} style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
            {result.title}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 特性

- ✅ 限制回调函数执行频率
- ✅ 支持 leading 和 trailing 配置
- ✅ 保持函数引用稳定
- ✅ TypeScript 类型安全

## 组合使用

性能 hooks 可以组合使用以获得更好的性能优化效果：

```tsx
import { 
  useDebounce, 
  useThrottle, 
  useMemo,
  useFetch 
} from 'joy-at-meeting'

function OptimizedSearchComponent() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({ category: 'all', sortBy: 'relevance' })
  const [scrollY, setScrollY] = useState(0)
  
  // 防抖搜索查询
  const debouncedQuery = useDebounce(query, 300)
  
  // 节流滚动位置
  const throttledScrollY = useThrottle(scrollY, 100)
  
  // 缓存搜索参数
  const searchParams = useMemo(() => {
    const params = new URLSearchParams()
    if (debouncedQuery) params.set('q', debouncedQuery)
    params.set('category', filters.category)
    params.set('sortBy', filters.sortBy)
    return params.toString()
  }, [debouncedQuery, filters])
  
  // 获取搜索结果
  const { data: results, loading, error } = useFetch(
    searchParams ? `/api/search?${searchParams}` : '',
    {},
    [searchParams]
  )
  
  // 缓存过滤后的结果
  const filteredResults = useMemo(() => {
    if (!results) return []
    
    return results.items.filter((item: any) => {
      // 复杂的过滤逻辑
      return item.score > 0.5
    })
  }, [results])
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // 根据滚动位置显示回到顶部按钮
  const showBackToTop = throttledScrollY > 300
  
  return (
    <div>
      <div style={{ position: 'sticky', top: 0, backgroundColor: 'white', padding: '1rem' }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索..."
          style={{ width: '100%', padding: '8px' }}
        />
        
        <div style={{ marginTop: '0.5rem' }}>
          <select 
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          >
            <option value="all">全部分类</option>
            <option value="articles">文章</option>
            <option value="videos">视频</option>
          </select>
          
          <select 
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            style={{ marginLeft: '0.5rem' }}
          >
            <option value="relevance">相关性</option>
            <option value="date">日期</option>
            <option value="popularity">热度</option>
          </select>
        </div>
      </div>
      
      {loading && <div>搜索中...</div>}
      {error && <div>搜索失败: {error.message}</div>}
      
      <div>
        {filteredResults.map((item: any) => (
          <div key={item.id} style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
      
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '10px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: '#007bff',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          ↑
        </button>
      )}
    </div>
  )
}
```

这个示例展示了如何组合使用多个性能 hooks 来创建一个高性能的搜索组件，包括防抖搜索、节流滚动、结果缓存等优化技术。