# Async Hooks

异步处理相关的 React hooks，帮助你更优雅地处理异步操作。

## useAsync

管理异步操作的状态，包括加载、成功、错误状态。

### 语法

```tsx
const { data, error, status, isLoading, isSuccess, isError, execute, reset } = useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  immediate?: boolean
)
```

### 参数

- `asyncFunction` (function): 返回 Promise 的异步函数
- `immediate` (boolean, 可选): 是否立即执行，默认为 `false`

### 返回值

返回一个对象，包含：
- `data` (T | null): 异步操作的结果数据
- `error` (Error | null): 错误信息
- `status` (AsyncStatus): 当前状态 ('idle' | 'pending' | 'success' | 'error')
- `isLoading` (boolean): 是否正在加载
- `isSuccess` (boolean): 是否成功
- `isError` (boolean): 是否出错
- `execute` (function): 手动执行异步函数
- `reset` (function): 重置状态

### 基础示例

```tsx
import { useAsync } from 'joy-at-meeting'
import { useEffect } from 'react'

function UserProfile({ userId }: { userId: string }) {
  const fetchUser = async (id: string) => {
    const response = await fetch(`/api/users/${id}`)
    if (!response.ok) {
      throw new Error('获取用户信息失败')
    }
    return response.json()
  }

  const { data: user, isLoading, isError, error, execute, reset } = useAsync(fetchUser)

  // 当userId变化时重新获取用户信息
  useEffect(() => {
    if (userId) {
      execute(userId)
    }
  }, [userId, execute])

  if (isLoading) return <div>加载中...</div>
  if (isError) return <div>错误: {error?.message}</div>
  if (!user) return <div>用户不存在</div>

  return (
    <div>
      <h2>{user.name}</h2>
      <p>邮箱: {user.email}</p>
      <p>注册时间: {user.createdAt}</p>
    </div>
  )
}
```

### 手动执行

```tsx
function CreateUser() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })

  const createUser = async () => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    
    if (!response.ok) {
      throw new Error('创建用户失败')
    }
    
    return response.json()
  }

  const { data: newUser, isLoading, error, execute } = useAsync(
    createUser,
    false // 不立即执行
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    execute()
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="姓名"
        required
      />
      <input
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="邮箱"
        type="email"
        required
      />
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? '创建中...' : '创建用户'}
      </button>
      
      {error && <p style={{ color: 'red' }}>错误: {error.message}</p>}
      {newUser && <p style={{ color: 'green' }}>用户创建成功!</p>}
    </form>
  )
}
```

### 高级示例：数据刷新

```tsx
function PostList() {
  const [page, setPage] = useState(1)
  const [posts, setPosts] = useState<any[]>([])

  const fetchPosts = async () => {
    const response = await fetch(`/api/posts?page=${page}&limit=10`)
    const data = await response.json()
    
    if (page === 1) {
      setPosts(data.posts)
    } else {
      setPosts(prev => [...prev, ...data.posts])
    }
    
    return data
  }

  const { data, isLoading, error, execute } = useAsync(fetchPosts)

  const loadMore = () => {
    setPage(prev => prev + 1)
  }

  const refresh = () => {
    setPage(1)
    setPosts([])
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={refresh} disabled={isLoading}>
          刷新
        </button>
        <button onClick={execute} disabled={isLoading}>
          重新加载
        </button>
      </div>
      
      {error && <p style={{ color: 'red' }}>错误: {error.message}</p>}
      
      <div>
        {posts.map(post => (
          <div key={post.id} style={{ padding: '1rem', border: '1px solid #ccc', margin: '0.5rem 0' }}>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
          </div>
        ))}
      </div>
      
      {data?.hasMore && (
        <button onClick={loadMore} disabled={isLoading}>
          {isLoading ? '加载中...' : '加载更多'}
        </button>
      )}
    </div>
  )
}
```

### 特性

- ✅ 自动管理加载、成功、错误状态
- ✅ 支持依赖数组自动重新执行
- ✅ 支持手动执行
- ✅ 错误处理
- ✅ TypeScript 类型安全

---

## useFetch

HTTP 请求的封装，基于 `useAsync` 实现，提供更便捷的网络请求功能。

### 语法

```tsx
const { data, error, status, isLoading, isSuccess, isError, execute, reset, refetch } = useFetch<T>(
  initialUrl?: string,
  initialOptions?: FetchOptions,
  immediate?: boolean
)
```

### 参数

- `initialUrl` (string, 可选): 初始请求URL
- `initialOptions` (FetchOptions, 可选): 初始请求选项
- `immediate` (boolean, 可选): 是否立即执行请求，默认为 `false`

### FetchOptions

```tsx
interface FetchOptions extends Omit<RequestInit, 'method' | 'body'> {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: any                                    // 请求体数据
  params?: Record<string, string | number | boolean>  // 查询参数
  baseURL?: string                             // 基础URL
  timeout?: number                             // 请求超时时间（毫秒）
}
```

### 返回值

返回一个对象，包含：
- `data` (T | null): 响应数据
- `error` (Error | null): 错误信息
- `status` (AsyncStatus): 当前状态
- `isLoading` (boolean): 是否正在加载
- `isSuccess` (boolean): 是否成功
- `isError` (boolean): 是否出错
- `execute` (function): 执行请求函数
- `reset` (function): 重置状态
- `refetch` (function): 重新请求函数

### 基础示例

```tsx
import { useFetch } from 'joy-at-meeting'
import { useEffect } from 'react'

function WeatherWidget({ city }: { city: string }) {
  const { data: weather, isLoading, isError, error, execute, refetch } = useFetch<{
    temperature: number
    description: string
    humidity: number
  }>()

  // 当城市变化时重新请求
  useEffect(() => {
    if (city) {
      execute('/api/weather', {
        params: { city },
        headers: {
          'Authorization': 'Bearer your-api-key'
        }
      })
    }
  }, [city, execute])

  if (isLoading) return <div>获取天气信息中...</div>
  if (isError) return <div>获取天气失败: {error?.message}</div>

  return (
    <div>
      <h3>{city} 天气</h3>
      {weather && (
        <div>
          <p>温度: {weather.temperature}°C</p>
          <p>天气: {weather.description}</p>
          <p>湿度: {weather.humidity}%</p>
        </div>
      )}
      <button onClick={refetch}>刷新天气</button>
    </div>
  )
}
```

### POST 请求示例

```tsx
import { useState } from 'react'

function CommentForm({ postId }: { postId: string }) {
  const [comment, setComment] = useState('')
  const { data, isLoading, isError, error, execute, reset } = useFetch<{
    id: string
    content: string
    createdAt: string
  }>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (comment.trim()) {
      await execute('/api/comments', {
        method: 'POST',
        data: {
          postId,
          content: comment
        }
      })
      
      // 成功后清空表单
      if (!isError) {
        setComment('')
      }
    }
  }

  const handleReset = () => {
    setComment('')
    reset()
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="写下你的评论..."
        rows={4}
        required
      />
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button type="submit" disabled={isLoading}>
          {isLoading ? '发布中...' : '发布评论'}
        </button>
        <button type="button" onClick={handleReset}>
          重置
        </button>
      </div>
      
      {isError && <p style={{ color: 'red' }}>发布失败: {error?.message}</p>}
      {data && <p style={{ color: 'green' }}>评论发布成功!</p>}
    </form>
  )
}

```

### 条件请求示例

```tsx
function UserDashboard({ userId }: { userId?: string }) {
  const { data: user, isLoading, isError, error, execute } = useFetch<{
    name: string
    email: string
    stats: {
      posts: number
      followers: number
    }
  }>()

  // 只有当 userId 存在时才发送请求
  useEffect(() => {
    if (userId) {
      execute(`/api/users/${userId}/dashboard`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
    }
  }, [userId, execute])

  if (!userId) {
    return <div>请先登录</div>
  }

  if (isLoading) return <div>加载用户信息中...</div>
  if (isError) return <div>加载失败: {error?.message}</div>

  return (
    <div>
      <h2>用户仪表板</h2>
      {user && (
        <div>
          <h3>欢迎, {user.name}!</h3>
          <p>邮箱: {user.email}</p>
          <div>
            <p>发布文章: {user.stats.posts}</p>
            <p>关注者: {user.stats.followers}</p>
          </div>
        </div>
      )}
    </div>
  )
}
```

### 特性

- ✅ 基于 useAsync 构建，继承所有异步状态管理功能
- ✅ 支持多种 HTTP 方法（GET、POST、PUT、DELETE、PATCH）
- ✅ 自动处理请求体序列化和查询参数
- ✅ 支持请求超时设置
- ✅ 灵活的配置选项
- ✅ TypeScript 类型安全
- ✅ 错误处理和重试机制
- ✅ 支持条件请求和手动触发

---

## 总结

`useAsync` 和 `useFetch` 提供了强大而灵活的异步操作管理能力：

- **useAsync**: 通用异步操作管理，适用于任何返回 Promise 的函数
- **useFetch**: 专门针对 HTTP 请求优化，提供更便捷的网络请求功能

两个 hooks 都提供了完整的状态管理、错误处理和 TypeScript 支持，让你能够轻松处理各种异步场景。

## 组合使用

异步 hooks 可以与其他 hooks 组合使用：

```tsx
import { 
  useFetch, 
  useLocalStorage, 
  useDebounce 
} from 'joy-at-meeting'

function SmartSearch() {
  const [query, setQuery] = useState('')
  const [searchHistory, setSearchHistory] = useLocalStorage('searchHistory', [])
  const debouncedQuery = useDebounce(query, 500)
  
  const { data: results, isLoading, error, execute } = useFetch<{
    total: number
    items: Array<{ id: string; title: string }>
  }>()
  
  // 当搜索词变化时执行搜索
  useEffect(() => {
    if (debouncedQuery) {
      execute('/api/search', {
        params: { q: debouncedQuery }
      })
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
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="搜索..."
      />
      
      {isLoading && <div>搜索中...</div>}
      {error && <div>搜索失败: {error.message}</div>}
      
      {results && (
        <div>
          <h3>搜索结果 ({results.total})</h3>
          {results.items.map((item: any) => (
            <div key={item.id}>{item.title}</div>
          ))}
        </div>
      )}
      
      {searchHistory.length > 0 && (
        <div>
          <h4>搜索历史</h4>
          {searchHistory.map((term, index) => (
            <button key={index} onClick={() => setQuery(term)}>
              {term}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```