# 最佳实践

本指南将帮助你更好地使用 Joy At Meeting，遵循 React Hooks 最佳实践，编写高质量的代码。

## 🎯 核心原则

### 1. 遵循 Hooks 规则

始终在函数组件的顶层调用 Hooks，不要在循环、条件或嵌套函数中调用。

```tsx
// ✅ 正确
function MyComponent() {
  const [count, setCount] = useLocalStorage('count', 0)
  const [isVisible, toggle] = useToggle(false)
  
  // 组件逻辑...
}

// ❌ 错误
function MyComponent({ shouldUseStorage }) {
  if (shouldUseStorage) {
    const [count, setCount] = useLocalStorage('count', 0) // 不要这样做！
  }
}
```

### 2. 合理使用依赖数组

对于有依赖的 Hooks，确保依赖数组完整且准确。

```tsx
// ✅ 正确
function UserProfile({ userId }) {
  const { data, loading } = useAsync(async () => {
    return fetchUser(userId)
  }, [userId]) // 包含所有依赖
  
  return loading ? <Loading /> : <UserCard user={data} />
}

// ❌ 错误
function UserProfile({ userId }) {
  const { data, loading } = useAsync(async () => {
    return fetchUser(userId)
  }, []) // 缺少 userId 依赖
}
```

## 🚀 性能优化

### 1. 使用防抖和节流

对于频繁触发的事件，使用 `useDebounce` 和 `useThrottle` 来优化性能。

```tsx
import { useDebounce, useThrottle } from 'joy-at-meeting'

function SearchInput() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  
  // 只有当用户停止输入 300ms 后才执行搜索
  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery)
    }
  }, [debouncedQuery])
  
  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="搜索..."
    />
  )
}

function ScrollHandler() {
  const [scrollY, setScrollY] = useState(0)
  
  const throttledHandleScroll = useThrottle(() => {
    setScrollY(window.scrollY)
  }, 100)
  
  useEffect(() => {
    window.addEventListener('scroll', throttledHandleScroll)
    return () => window.removeEventListener('scroll', throttledHandleScroll)
  }, [throttledHandleScroll])
  
  return <div>滚动位置: {scrollY}px</div>
}
```

### 2. 缓存昂贵的计算

使用 `useMemoizedCallback` 来缓存回调函数，避免不必要的重新渲染。

```tsx
import { useMemoizedCallback } from 'joy-at-meeting'

function ExpensiveComponent({ items, onItemClick }) {
  // 缓存回调函数，避免子组件不必要的重渲染
  const handleItemClick = useMemoizedCallback((item) => {
    // 执行一些昂贵的操作
    const processedItem = expensiveProcessing(item)
    onItemClick(processedItem)
  }, [onItemClick])
  
  return (
    <div>
      {items.map(item => (
        <ExpensiveItem
          key={item.id}
          item={item}
          onClick={handleItemClick}
        />
      ))}
    </div>
  )
}
```

## 🎨 状态管理模式

### 1. 本地状态 vs 持久化状态

根据数据的生命周期选择合适的状态管理方式。

```tsx
function UserDashboard() {
  // 临时 UI 状态 - 使用普通 useState
  const [activeTab, setActiveTab] = useState('profile')
  const [isModalOpen, toggle] = useToggle(false)
  
  // 用户偏好 - 使用 useLocalStorage 持久化
  const [theme, setTheme] = useLocalStorage('theme', 'light')
  const [language, setLanguage] = useLocalStorage('language', 'zh-CN')
  
  // 会话状态 - 使用 sessionStorage
  const [sessionData, setSessionData] = useSessionStorage('session', {})
  
  return (
    <div className={`dashboard theme-${theme}`}>
      {/* 组件内容 */}
    </div>
  )
}
```

### 2. 复合状态管理

对于复杂的状态，可以组合多个 Hooks 来实现。

```tsx
function ShoppingCart() {
  // 购物车数据持久化
  const [cartItems, setCartItems] = useLocalStorage('cart', [])
  
  // UI 状态
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // 计算属性
  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [cartItems])
  
  const addToCart = useMemoizedCallback(async (product) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // 检查库存
      const available = await checkInventory(product.id)
      if (!available) {
        throw new Error('商品库存不足')
      }
      
      setCartItems(prev => {
        const existing = prev.find(item => item.id === product.id)
        if (existing) {
          return prev.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
        return [...prev, { ...product, quantity: 1 }]
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  return (
    <div>
      <div>总价: ¥{totalPrice}</div>
      {error && <div className="error">{error}</div>}
      {/* 购物车内容 */}
    </div>
  )
}
```

## 🔧 表单处理最佳实践

### 1. 统一的表单管理

使用 `useForm` 来统一管理表单状态和验证。

```tsx
import { useForm, validationRules } from 'joy-at-meeting'

function UserRegistrationForm() {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isValid,
    isSubmitting
  } = useForm({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: {
      username: [
        validationRules.required('用户名不能为空'),
        validationRules.minLength(3, '用户名至少3个字符')
      ],
      email: [
        validationRules.required('邮箱不能为空'),
        validationRules.email('请输入有效的邮箱地址')
      ],
      password: [
        validationRules.required('密码不能为空'),
        validationRules.minLength(8, '密码至少8个字符'),
        validationRules.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          '密码必须包含大小写字母和数字'
        )
      ],
      confirmPassword: [
        validationRules.required('请确认密码'),
        (value, allValues) => {
          if (value !== allValues.password) {
            return '两次密码输入不一致'
          }
        }
      ]
    },
    onSubmit: async (values) => {
      await registerUser(values)
    }
  })
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="username"
          value={values.username}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="用户名"
        />
        {touched.username && errors.username && (
          <span className="error">{errors.username}</span>
        )}
      </div>
      
      <div>
        <input
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="邮箱"
        />
        {touched.email && errors.email && (
          <span className="error">{errors.email}</span>
        )}
      </div>
      
      <div>
        <input
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="密码"
        />
        {touched.password && errors.password && (
          <span className="error">{errors.password}</span>
        )}
      </div>
      
      <div>
        <input
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="确认密码"
        />
        {touched.confirmPassword && errors.confirmPassword && (
          <span className="error">{errors.confirmPassword}</span>
        )}
      </div>
      
      <button
        type="submit"
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? '注册中...' : '注册'}
      </button>
    </form>
  )
}
```

## 🌐 异步数据处理

### 1. 统一的异步状态管理

使用 `useAsync` 来统一处理异步操作的加载、成功和错误状态。

```tsx
import { useAsync } from 'joy-at-meeting'

function UserList() {
  const {
    data: users,
    loading,
    error,
    execute: refetch
  } = useAsync(async () => {
    const response = await fetch('/api/users')
    if (!response.ok) {
      throw new Error('获取用户列表失败')
    }
    return response.json()
  })
  
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} onRetry={refetch} />
  
  return (
    <div>
      <button onClick={refetch}>刷新</button>
      <ul>
        {users?.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

### 2. 条件性数据获取

根据条件来决定是否执行异步操作。

```tsx
function UserProfile({ userId }) {
  const {
    data: user,
    loading,
    error
  } = useAsync(
    async () => {
      if (!userId) return null
      return fetchUser(userId)
    },
    [userId],
    {
      immediate: !!userId // 只有当 userId 存在时才立即执行
    }
  )
  
  if (!userId) return <div>请选择用户</div>
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  
  return <UserCard user={user} />
}
```

## 🎯 测试建议

### 1. 测试 Hooks 的行为

```tsx
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from 'joy-at-meeting'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'default'))
    expect(result.current[0]).toBe('default')
  })
  
  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'initial'))
    
    act(() => {
      result.current[1]('updated')
    })
    
    expect(result.current[0]).toBe('updated')
    expect(localStorage.getItem('test')).toBe('"updated"')
  })
})
```

### 2. 模拟异步操作

```tsx
import { renderHook, waitFor } from '@testing-library/react'
import { useAsync } from 'joy-at-meeting'

describe('useAsync', () => {
  it('should handle successful async operation', async () => {
    const mockFn = jest.fn().mockResolvedValue('success')
    const { result } = renderHook(() => useAsync(mockFn))
    
    expect(result.current.loading).toBe(true)
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.data).toBe('success')
    expect(result.current.error).toBeNull()
  })
})
```

## 📚 常见问题

### Q: 如何在 SSR 环境中使用 localStorage hooks？

A: Joy At Meeting 的 localStorage hooks 内置了 SSR 支持，会自动检测环境并降级处理。

```tsx
// 在服务端渲染时，会使用内存存储，不会报错
function MyComponent() {
  const [value, setValue] = useLocalStorage('key', 'default')
  // 组件会正常工作，无需额外处理
}
```

### Q: 如何避免不必要的重渲染？

A: 使用 `useMemoizedCallback` 和合理的依赖数组。

```tsx
function Parent() {
  const [count, setCount] = useState(0)
  
  // ✅ 使用 useMemoizedCallback 避免子组件重渲染
  const handleClick = useMemoizedCallback(() => {
    console.log('clicked')
  }, [])
  
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ExpensiveChild onClick={handleClick} />
    </div>
  )
}
```

### Q: 如何处理复杂的表单验证？

A: 使用 `useValidation` 配合自定义验证规则。

```tsx
const customValidation = {
  asyncEmailCheck: async (email) => {
    const exists = await checkEmailExists(email)
    if (exists) {
      return '该邮箱已被注册'
    }
  }
}

function RegistrationForm() {
  const { validate, errors } = useValidation({
    email: [
      validationRules.required(),
      validationRules.email(),
      customValidation.asyncEmailCheck
    ]
  })
  
  // 使用验证逻辑
}
```

## 🚀 进阶技巧

### 1. 创建自定义 Hooks

基于 Joy At Meeting 的基础 Hooks 创建更高级的自定义 Hooks。

```tsx
import { useLocalStorage, useAsync } from 'joy-at-meeting'

// 自定义用户偏好 Hook
function useUserPreferences() {
  const [theme, setTheme] = useLocalStorage('theme', 'light')
  const [language, setLanguage] = useLocalStorage('language', 'zh-CN')
  const [notifications, setNotifications] = useLocalStorage('notifications', true)
  
  const toggleTheme = () => {
    setTheme(current => current === 'light' ? 'dark' : 'light')
  }
  
  return {
    theme,
    language,
    notifications,
    setTheme,
    setLanguage,
    setNotifications,
    toggleTheme
  }
}

// 自定义数据获取 Hook
function useUserData(userId) {
  const { data, loading, error, execute } = useAsync(
    async () => {
      const [user, posts, followers] = await Promise.all([
        fetchUser(userId),
        fetchUserPosts(userId),
        fetchUserFollowers(userId)
      ])
      return { user, posts, followers }
    },
    [userId]
  )
  
  return {
    user: data?.user,
    posts: data?.posts || [],
    followers: data?.followers || [],
    loading,
    error,
    refetch: execute
  }
}
```

### 2. 组合模式

将多个 Hooks 组合使用来实现复杂功能。

```tsx
function useShoppingCart() {
  const [items, setItems] = useLocalStorage('cart-items', [])
  const [isOpen, toggle, , close] = useToggle(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const addItem = useMemoizedCallback(async (product) => {
    setIsLoading(true)
    try {
      // 验证库存
      await validateInventory(product.id)
      
      setItems(prev => {
        const existing = prev.find(item => item.id === product.id)
        if (existing) {
          return prev.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
        return [...prev, { ...product, quantity: 1 }]
      })
      
      // 显示购物车
      toggle()
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  const removeItem = useMemoizedCallback((productId) => {
    setItems(prev => prev.filter(item => item.id !== productId))
  }, [])
  
  const updateQuantity = useMemoizedCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    
    setItems(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    )
  }, [removeItem])
  
  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [items])
  
  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }, [items])
  
  return {
    items,
    isOpen,
    isLoading,
    totalPrice,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    toggle,
    close
  }
}
```

通过遵循这些最佳实践，你可以更好地利用 Joy At Meeting 提供的 Hooks，编写出高质量、可维护的 React 应用程序。