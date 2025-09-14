# Async Hooks

异步处理相关的 React hooks，帮助你更优雅地处理异步操作。

## useAsync

管理异步操作的状态，包括加载、成功、错误状态。

### 语法

```tsx
const { data, loading, error, execute } = useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies?: any[],
  immediate?: boolean
)
```

### 参数

- `asyncFunction` (function): 返回 Promise 的异步函数
- `dependencies` (array, 可选): 依赖数组，变化时重新执行
- `immediate` (boolean, 可选): 是否立即执行，默认为 `true`

### 返回值

返回一个对象，包含：
- `data` (T | null): 异步操作的结果数据
- `loading` (boolean): 是否正在加载
- `error` (Error | null): 错误信息
- `execute` (function): 手动执行异步函数

### 基础示例

```tsx
import { useAsync } from 'joy-at-meeting'

function UserProfile({ userId }: { userId: string }) {
  const fetchUser = async () => {
    const response = await fetch(`/api/users/${userId}`)
    if (!response.ok) {
      throw new Error('获取用户信息失败')
    }
    return response.json()
  }

  const { data: user, loading, error } = useAsync(fetchUser, [userId])

  if (loading) return <div>加载中...</div>
  if (error) return <div>错误: {error.message}</div>
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

  const { data: newUser, loading, error, execute } = useAsync(
    createUser,
    [],
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
      
      <button type="submit" disabled={loading}>
        {loading ? '创建中...' : '创建用户'}
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

  const { data, loading, error, execute } = useAsync(fetchPosts, [page])

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
        <button onClick={refresh} disabled={loading}>
          刷新
        </button>
        <button onClick={execute} disabled={loading}>
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
        <button onClick={loadMore} disabled={loading}>
          {loading ? '加载中...' : '加载更多'}
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

HTTP 请求的封装，基于 `useAsync` 实现。

### 语法

```tsx
const { data, loading, error, refetch } = useFetch<T>(
  url: string,
  options?: RequestInit,
  dependencies?: any[]
)
```

### 参数

- `url` (string): 请求的 URL
- `options` (RequestInit, 可选): fetch 选项
- `dependencies` (array, 可选): 依赖数组，变化时重新请求

### 返回值

返回一个对象，包含：
- `data` (T | null): 响应数据
- `loading` (boolean): 是否正在加载
- `error` (Error | null): 错误信息
- `refetch` (function): 重新请求函数

### 基础示例

```tsx
import { useFetch } from 'joy-at-meeting'

function WeatherWidget({ city }: { city: string }) {
  const { data: weather, loading, error, refetch } = useFetch(
    `/api/weather?city=${city}`,
    {
      headers: {
        'Authorization': 'Bearer your-api-key'
      }
    },
    [city] // 城市变化时重新请求
  )

  if (loading) return <div>获取天气信息中...</div>
  if (error) return <div>获取天气失败: {error.message}</div>

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
function CommentForm({ postId }: { postId: string }) {
  const [comment, setComment] = useState('')
  const [shouldSubmit, setShouldSubmit] = useState(false)

  const { data, loading, error } = useFetch(
    '/api/comments',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        postId,
        content: comment
      })
    },
    [shouldSubmit] // 只有当 shouldSubmit 为 true 时才发送请求
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (comment.trim()) {
      setShouldSubmit(true)
    }
  }

  useEffect(() => {
    if (data && !loading && !error) {
      setComment('')
      setShouldSubmit(false)
      console.log('评论提交成功:', data)
    }
  }, [data, loading, error])

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="写下你的评论..."
        rows={4}
        style={{ width: '100%' }}
      />
      
      <button type="submit" disabled={loading || !comment.trim()}>
        {loading ? '提交中...' : '提交评论'}
      </button>
      
      {error && <p style={{ color: 'red' }}>提交失败: {error.message}</p>}
      {data && <p style={{ color: 'green' }}>评论提交成功!</p>}
    </form>
  )
}
```

### 条件请求

```tsx
function UserDashboard({ userId }: { userId?: string }) {
  // 只有当 userId 存在时才发送请求
  const shouldFetch = Boolean(userId)
  
  const { data: user, loading, error } = useFetch(
    userId ? `/api/users/${userId}/dashboard` : '',
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    },
    [userId, shouldFetch]
  )

  if (!userId) {
    return <div>请先登录</div>
  }

  if (loading) return <div>加载用户数据中...</div>
  if (error) return <div>加载失败: {error.message}</div>

  return (
    <div>
      <h2>欢迎, {user?.name}</h2>
      <div>
        <h3>统计信息</h3>
        <p>文章数: {user?.stats.posts}</p>
        <p>评论数: {user?.stats.comments}</p>
        <p>点赞数: {user?.stats.likes}</p>
      </div>
    </div>
  )
}
```

### 分页数据

```tsx
function ProductList() {
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState('all')
  
  const { data, loading, error, refetch } = useFetch(
    `/api/products?page=${page}&category=${category}&limit=12`,
    {},
    [page, category]
  )

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory)
    setPage(1) // 重置到第一页
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <select 
          value={category} 
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="all">全部分类</option>
          <option value="electronics">电子产品</option>
          <option value="clothing">服装</option>
          <option value="books">图书</option>
        </select>
        
        <button onClick={refetch} disabled={loading}>
          刷新
        </button>
      </div>
      
      {loading && <div>加载中...</div>}
      {error && <div>加载失败: {error.message}</div>}
      
      {data && (
        <div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '1rem' 
          }}>
            {data.products.map((product: any) => (
              <div key={product.id} style={{ border: '1px solid #ccc', padding: '1rem' }}>
                <h4>{product.name}</h4>
                <p>{product.price}</p>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              上一页
            </button>
            
            <span style={{ margin: '0 1rem' }}>
              第 {page} 页，共 {data.totalPages} 页
            </span>
            
            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={page >= data.totalPages || loading}
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
```

### 错误重试

```tsx
function DataWithRetry() {
  const [retryCount, setRetryCount] = useState(0)
  
  const { data, loading, error, refetch } = useFetch(
    '/api/unreliable-endpoint',
    {},
    [retryCount]
  )

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
  }

  if (loading) {
    return (
      <div>
        加载中... {retryCount > 0 && `(重试第 ${retryCount} 次)`}
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <p style={{ color: 'red' }}>加载失败: {error.message}</p>
        <button onClick={handleRetry}>
          重试 {retryCount > 0 && `(${retryCount})`}
        </button>
      </div>
    )
  }

  return (
    <div>
      <h3>数据加载成功</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
```

### 特性

- ✅ 基于 fetch API
- ✅ 自动 JSON 解析
- ✅ 支持所有 HTTP 方法
- ✅ 错误处理
- ✅ 依赖数组自动重新请求
- ✅ TypeScript 类型安全

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
  
  const { data: results, loading, error } = useFetch(
    debouncedQuery ? `/api/search?q=${debouncedQuery}` : '',
    {},
    [debouncedQuery]
  )
  
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
      
      {loading && <div>搜索中...</div>}
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