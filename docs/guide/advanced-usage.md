# 高级用法

本指南将介绍 Joy At Meeting 的高级使用技巧，帮助你构建更复杂、更强大的应用程序。

## 🎯 复杂状态管理模式

### 1. 状态机模式

使用多个 hooks 组合实现状态机模式，管理复杂的业务流程。

```tsx
import { useState, useCallback } from 'react'
import { useLocalStorage, useAsync } from 'joy-at-meeting'

// 订单状态机
type OrderState = 'draft' | 'submitting' | 'processing' | 'completed' | 'failed'

function useOrderStateMachine() {
  const [state, setState] = useState<OrderState>('draft')
  const [orderData, setOrderData] = useLocalStorage('draft-order', {})
  const [error, setError] = useState<string | null>(null)
  
  const { execute: submitOrder, loading } = useAsync(
    async (data) => {
      setState('submitting')
      try {
        const result = await api.submitOrder(data)
        setState('processing')
        return result
      } catch (err) {
        setState('failed')
        setError(err.message)
        throw err
      }
    },
    [],
    { immediate: false }
  )
  
  const transitions = {
    draft: {
      submit: () => submitOrder(orderData),
      updateData: (data) => setOrderData(prev => ({ ...prev, ...data }))
    },
    submitting: {
      // 提交中不允许任何操作
    },
    processing: {
      complete: () => setState('completed'),
      fail: (error) => {
        setState('failed')
        setError(error)
      }
    },
    completed: {
      reset: () => {
        setState('draft')
        setOrderData({})
        setError(null)
      }
    },
    failed: {
      retry: () => setState('draft'),
      reset: () => {
        setState('draft')
        setOrderData({})
        setError(null)
      }
    }
  }
  
  return {
    state,
    orderData,
    error,
    loading,
    actions: transitions[state] || {}
  }
}

// 使用状态机
function OrderForm() {
  const { state, orderData, error, actions } = useOrderStateMachine()
  
  const renderByState = () => {
    switch (state) {
      case 'draft':
        return (
          <form onSubmit={(e) => {
            e.preventDefault()
            actions.submit?.()
          }}>
            <input
              value={orderData.customerName || ''}
              onChange={(e) => actions.updateData?.({ customerName: e.target.value })}
              placeholder="客户姓名"
            />
            <button type="submit">提交订单</button>
          </form>
        )
      
      case 'submitting':
        return <div>正在提交订单...</div>
      
      case 'processing':
        return <div>订单处理中...</div>
      
      case 'completed':
        return (
          <div>
            <div>订单已完成！</div>
            <button onClick={actions.reset}>创建新订单</button>
          </div>
        )
      
      case 'failed':
        return (
          <div>
            <div>订单失败: {error}</div>
            <button onClick={actions.retry}>重试</button>
            <button onClick={actions.reset}>重新开始</button>
          </div>
        )
    }
  }
  
  return <div>{renderByState()}</div>
}
```

### 2. 全局状态管理

创建全局状态管理系统，在多个组件间共享状态。

```tsx
import { createContext, useContext } from 'react'
import { useLocalStorage, useToggle } from 'joy-at-meeting'

// 创建全局状态上下文
const AppStateContext = createContext(null)

function AppStateProvider({ children }) {
  // 用户状态
  const [user, setUser] = useLocalStorage('user', null)
  const [isAuthenticated, setIsAuthenticated] = useState(!!user)
  
  // UI 状态
  const [theme, setTheme] = useLocalStorage('theme', 'light')
  const [sidebarOpen, toggleSidebar] = useToggle(false)
  const [notifications, setNotifications] = useLocalStorage('notifications', [])
  
  // 应用设置
  const [settings, setSettings] = useLocalStorage('app-settings', {
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    autoSave: true
  })
  
  const login = useCallback(async (credentials) => {
    try {
      const userData = await api.login(credentials)
      setUser(userData)
      setIsAuthenticated(true)
      return userData
    } catch (error) {
      throw error
    }
  }, [])
  
  const logout = useCallback(() => {
    setUser(null)
    setIsAuthenticated(false)
    // 清除敏感数据
    localStorage.removeItem('auth-token')
  }, [])
  
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...notification
    }
    setNotifications(prev => [newNotification, ...prev].slice(0, 50)) // 最多保留50条
  }, [])
  
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])
  
  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }, [])
  
  const value = {
    // 状态
    user,
    isAuthenticated,
    theme,
    sidebarOpen,
    notifications,
    settings,
    
    // 操作
    login,
    logout,
    setTheme,
    toggleSidebar,
    addNotification,
    removeNotification,
    updateSettings
  }
  
  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  )
}

// 自定义 Hook 来使用全局状态
function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider')
  }
  return context
}

// 使用全局状态
function Header() {
  const { user, theme, setTheme, toggleSidebar, logout } = useAppState()
  
  return (
    <header className={`header theme-${theme}`}>
      <button onClick={toggleSidebar}>菜单</button>
      <div>欢迎, {user?.name}</div>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        切换主题
      </button>
      <button onClick={logout}>退出</button>
    </header>
  )
}
```

## 🚀 高性能数据处理

### 1. 虚拟滚动与大数据集

处理大量数据时，结合虚拟滚动技术优化性能。

```tsx
import { useMemo, useState, useCallback } from 'react'
import { useDebounce, useWindowSize, useScrollPosition } from 'joy-at-meeting'

function useVirtualList({
  items,
  itemHeight,
  containerHeight,
  overscan = 5
}) {
  const [scrollTop, setScrollTop] = useState(0)
  
  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight)
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length
    )
    
    return {
      start: Math.max(0, start - overscan),
      end
    }
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length])
  
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end).map((item, index) => ({
      ...item,
      index: visibleRange.start + index
    }))
  }, [items, visibleRange])
  
  const totalHeight = items.length * itemHeight
  const offsetY = visibleRange.start * itemHeight
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop
  }
}

function VirtualizedList({ data, searchTerm }) {
  const { height: windowHeight } = useWindowSize()
  const containerHeight = windowHeight - 200 // 减去头部和其他元素高度
  
  // 搜索功能
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  
  const filteredData = useMemo(() => {
    if (!debouncedSearchTerm) return data
    return data.filter(item => 
      item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    )
  }, [data, debouncedSearchTerm])
  
  const {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop
  } = useVirtualList({
    items: filteredData,
    itemHeight: 60,
    containerHeight
  })
  
  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop)
  }, [])
  
  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map(item => (
            <div
              key={item.id}
              style={{ height: 60, padding: '10px', borderBottom: '1px solid #eee' }}
            >
              <div>{item.name}</div>
              <div>{item.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

### 2. 智能缓存策略

实现多层缓存策略，优化数据获取性能。

```tsx
import { useAsync, useLocalStorage } from 'joy-at-meeting'

// 缓存管理器
class CacheManager {
  private memoryCache = new Map()
  private cacheExpiry = new Map()
  
  set(key: string, data: any, ttl: number = 5 * 60 * 1000) { // 默认5分钟
    this.memoryCache.set(key, data)
    this.cacheExpiry.set(key, Date.now() + ttl)
  }
  
  get(key: string) {
    const expiry = this.cacheExpiry.get(key)
    if (expiry && Date.now() > expiry) {
      this.memoryCache.delete(key)
      this.cacheExpiry.delete(key)
      return null
    }
    return this.memoryCache.get(key)
  }
  
  clear() {
    this.memoryCache.clear()
    this.cacheExpiry.clear()
  }
}

const cacheManager = new CacheManager()

function useSmartCache(key: string, fetcher: () => Promise<any>, options = {}) {
  const {
    memoryTTL = 5 * 60 * 1000, // 内存缓存5分钟
    persistTTL = 24 * 60 * 60 * 1000, // 持久化缓存24小时
    staleWhileRevalidate = true
  } = options
  
  const [persistedData, setPersistedData] = useLocalStorage(
    `cache_${key}`,
    { data: null, timestamp: 0 }
  )
  
  const { data, loading, error, execute } = useAsync(
    async () => {
      // 1. 检查内存缓存
      const memoryData = cacheManager.get(key)
      if (memoryData) {
        return memoryData
      }
      
      // 2. 检查持久化缓存
      const now = Date.now()
      const isPersistedValid = persistedData.timestamp && 
        (now - persistedData.timestamp) < persistTTL
      
      if (isPersistedValid && persistedData.data) {
        // 使用持久化数据，同时在后台更新
        cacheManager.set(key, persistedData.data, memoryTTL)
        
        if (staleWhileRevalidate) {
          // 后台更新数据
          fetcher().then(freshData => {
            cacheManager.set(key, freshData, memoryTTL)
            setPersistedData({ data: freshData, timestamp: Date.now() })
          }).catch(() => {
            // 静默失败，继续使用缓存数据
          })
        }
        
        return persistedData.data
      }
      
      // 3. 获取新数据
      const freshData = await fetcher()
      
      // 更新所有缓存层
      cacheManager.set(key, freshData, memoryTTL)
      setPersistedData({ data: freshData, timestamp: Date.now() })
      
      return freshData
    },
    [key],
    { immediate: true }
  )
  
  const invalidate = useCallback(() => {
    cacheManager.clear()
    setPersistedData({ data: null, timestamp: 0 })
    execute()
  }, [execute, setPersistedData])
  
  return {
    data,
    loading,
    error,
    refetch: execute,
    invalidate
  }
}

// 使用智能缓存
function UserProfile({ userId }) {
  const {
    data: user,
    loading,
    error,
    invalidate
  } = useSmartCache(
    `user_${userId}`,
    () => api.getUser(userId),
    {
      memoryTTL: 2 * 60 * 1000, // 内存缓存2分钟
      persistTTL: 10 * 60 * 1000, // 持久化缓存10分钟
      staleWhileRevalidate: true
    }
  )
  
  if (loading && !user) return <LoadingSpinner />
  if (error && !user) return <ErrorMessage error={error} />
  
  return (
    <div>
      <UserCard user={user} />
      <button onClick={invalidate}>刷新数据</button>
    </div>
  )
}
```

## 🎨 复杂 UI 模式

### 1. 多步骤向导

创建复杂的多步骤表单向导。

```tsx
import { useState, useCallback } from 'react'
import { useLocalStorage, useForm } from 'joy-at-meeting'

function useWizard(steps, options = {}) {
  const { persistKey, onComplete } = options
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [wizardData, setWizardData] = useLocalStorage(
    persistKey || 'wizard-data',
    {}
  )
  
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1
  const canGoNext = completedSteps.has(currentStep)
  const canGoPrev = currentStep > 0
  
  const goNext = useCallback(() => {
    if (canGoNext && !isLastStep) {
      setCurrentStep(prev => prev + 1)
    } else if (isLastStep && canGoNext) {
      onComplete?.(wizardData)
    }
  }, [canGoNext, isLastStep, onComplete, wizardData])
  
  const goPrev = useCallback(() => {
    if (canGoPrev) {
      setCurrentStep(prev => prev - 1)
    }
  }, [canGoPrev])
  
  const goToStep = useCallback((stepIndex) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex)
    }
  }, [steps.length])
  
  const completeStep = useCallback((stepIndex, data) => {
    setCompletedSteps(prev => new Set([...prev, stepIndex]))
    setWizardData(prev => ({ ...prev, ...data }))
  }, [])
  
  const resetWizard = useCallback(() => {
    setCurrentStep(0)
    setCompletedSteps(new Set())
    setWizardData({})
  }, [])
  
  return {
    currentStep,
    currentStepData: steps[currentStep],
    completedSteps,
    wizardData,
    isFirstStep,
    isLastStep,
    canGoNext,
    canGoPrev,
    goNext,
    goPrev,
    goToStep,
    completeStep,
    resetWizard,
    progress: ((completedSteps.size) / steps.length) * 100
  }
}

// 向导步骤定义
const registrationSteps = [
  {
    id: 'personal',
    title: '个人信息',
    description: '请填写您的基本信息'
  },
  {
    id: 'account',
    title: '账户设置',
    description: '设置您的登录信息'
  },
  {
    id: 'preferences',
    title: '偏好设置',
    description: '自定义您的使用偏好'
  },
  {
    id: 'confirmation',
    title: '确认信息',
    description: '请确认您的注册信息'
  }
]

function RegistrationWizard() {
  const {
    currentStep,
    currentStepData,
    completedSteps,
    wizardData,
    isFirstStep,
    isLastStep,
    canGoNext,
    canGoPrev,
    goNext,
    goPrev,
    completeStep,
    resetWizard,
    progress
  } = useWizard(registrationSteps, {
    persistKey: 'registration-wizard',
    onComplete: async (data) => {
      try {
        await api.register(data)
        alert('注册成功！')
        resetWizard()
      } catch (error) {
        alert('注册失败：' + error.message)
      }
    }
  })
  
  const handleStepComplete = (stepData) => {
    completeStep(currentStep, stepData)
    goNext()
  }
  
  const renderStep = () => {
    switch (currentStepData.id) {
      case 'personal':
        return (
          <PersonalInfoStep
            initialData={wizardData}
            onComplete={handleStepComplete}
          />
        )
      
      case 'account':
        return (
          <AccountSetupStep
            initialData={wizardData}
            onComplete={handleStepComplete}
          />
        )
      
      case 'preferences':
        return (
          <PreferencesStep
            initialData={wizardData}
            onComplete={handleStepComplete}
          />
        )
      
      case 'confirmation':
        return (
          <ConfirmationStep
            data={wizardData}
            onComplete={handleStepComplete}
          />
        )
      
      default:
        return null
    }
  }
  
  return (
    <div className="wizard">
      {/* 进度条 */}
      <div className="wizard-progress">
        <div 
          className="progress-bar" 
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* 步骤指示器 */}
      <div className="wizard-steps">
        {registrationSteps.map((step, index) => (
          <div
            key={step.id}
            className={`step ${
              index === currentStep ? 'active' : ''
            } ${
              completedSteps.has(index) ? 'completed' : ''
            }`}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-title">{step.title}</div>
          </div>
        ))}
      </div>
      
      {/* 当前步骤内容 */}
      <div className="wizard-content">
        <h2>{currentStepData.title}</h2>
        <p>{currentStepData.description}</p>
        {renderStep()}
      </div>
      
      {/* 导航按钮 */}
      <div className="wizard-navigation">
        <button
          onClick={goPrev}
          disabled={!canGoPrev}
        >
          上一步
        </button>
        
        <button
          onClick={goNext}
          disabled={!canGoNext}
        >
          {isLastStep ? '完成注册' : '下一步'}
        </button>
      </div>
    </div>
  )
}

// 个人信息步骤组件
function PersonalInfoStep({ initialData, onComplete }) {
  const { values, errors, handleChange, handleSubmit, isValid } = useForm({
    initialValues: {
      firstName: initialData.firstName || '',
      lastName: initialData.lastName || '',
      email: initialData.email || '',
      phone: initialData.phone || ''
    },
    validationSchema: {
      firstName: [validationRules.required('请输入名字')],
      lastName: [validationRules.required('请输入姓氏')],
      email: [
        validationRules.required('请输入邮箱'),
        validationRules.email('请输入有效的邮箱地址')
      ],
      phone: [validationRules.required('请输入手机号')]
    },
    onSubmit: onComplete
  })
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          name="firstName"
          value={values.firstName}
          onChange={handleChange}
          placeholder="名字"
        />
        {errors.firstName && <span className="error">{errors.firstName}</span>}
      </div>
      
      <div className="form-group">
        <input
          name="lastName"
          value={values.lastName}
          onChange={handleChange}
          placeholder="姓氏"
        />
        {errors.lastName && <span className="error">{errors.lastName}</span>}
      </div>
      
      <div className="form-group">
        <input
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          placeholder="邮箱"
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      
      <div className="form-group">
        <input
          name="phone"
          value={values.phone}
          onChange={handleChange}
          placeholder="手机号"
        />
        {errors.phone && <span className="error">{errors.phone}</span>}
      </div>
      
      <button type="submit" disabled={!isValid}>
        继续
      </button>
    </form>
  )
}
```

## 🔧 自定义 Hooks 开发

### 1. 创建可复用的业务 Hooks

```tsx
import { useCallback, useRef } from 'react'
import { useAsync, useLocalStorage, useDebounce } from 'joy-at-meeting'

// 文件上传 Hook
function useFileUpload(options = {}) {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB
    allowedTypes = ['image/*'],
    multiple = false,
    onProgress,
    onSuccess,
    onError
  } = options
  
  const fileInputRef = useRef(null)
  
  const { execute: uploadFile, loading } = useAsync(
    async (files) => {
      const formData = new FormData()
      
      if (multiple) {
        Array.from(files).forEach((file, index) => {
          formData.append(`file_${index}`, file)
        })
      } else {
        formData.append('file', files[0])
      }
      
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100
            onProgress?.(progress)
          }
        })
        
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const result = JSON.parse(xhr.responseText)
            onSuccess?.(result)
            resolve(result)
          } else {
            const error = new Error(`Upload failed: ${xhr.statusText}`)
            onError?.(error)
            reject(error)
          }
        })
        
        xhr.addEventListener('error', () => {
          const error = new Error('Upload failed')
          onError?.(error)
          reject(error)
        })
        
        xhr.open('POST', '/api/upload')
        xhr.send(formData)
      })
    },
    [],
    { immediate: false }
  )
  
  const validateFiles = useCallback((files) => {
    const fileArray = Array.from(files)
    
    for (const file of fileArray) {
      // 检查文件大小
      if (file.size > maxSize) {
        throw new Error(`文件 ${file.name} 超过最大大小限制`)
      }
      
      // 检查文件类型
      const isValidType = allowedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -1))
        }
        return file.type === type
      })
      
      if (!isValidType) {
        throw new Error(`文件 ${file.name} 类型不支持`)
      }
    }
    
    return true
  }, [maxSize, allowedTypes])
  
  const selectFiles = useCallback(() => {
    fileInputRef.current?.click()
  }, [])
  
  const handleFileSelect = useCallback((e) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    try {
      validateFiles(files)
      uploadFile(files)
    } catch (error) {
      onError?.(error)
    }
  }, [validateFiles, uploadFile, onError])
  
  return {
    selectFiles,
    uploading: loading,
    fileInputRef,
    handleFileSelect
  }
}

// 无限滚动 Hook
function useInfiniteScroll(fetchMore, options = {}) {
  const {
    threshold = 100,
    enabled = true
  } = options
  
  const [hasMore, setHasMore] = useState(true)
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  
  const { execute: loadMore, loading } = useAsync(
    async () => {
      const result = await fetchMore(page)
      
      if (result.items.length === 0) {
        setHasMore(false)
        return
      }
      
      setItems(prev => [...prev, ...result.items])
      setPage(prev => prev + 1)
      
      if (result.items.length < result.pageSize) {
        setHasMore(false)
      }
    },
    [page, fetchMore],
    { immediate: false }
  )
  
  const { scrollY } = useScrollPosition()
  
  useEffect(() => {
    if (!enabled || !hasMore || loading) return
    
    const documentHeight = document.documentElement.scrollHeight
    const windowHeight = window.innerHeight
    const scrollTop = scrollY
    
    if (documentHeight - (scrollTop + windowHeight) <= threshold) {
      loadMore()
    }
  }, [scrollY, enabled, hasMore, loading, threshold, loadMore])
  
  const reset = useCallback(() => {
    setItems([])
    setPage(1)
    setHasMore(true)
  }, [])
  
  return {
    items,
    loading,
    hasMore,
    loadMore,
    reset
  }
}

// 使用示例
function FileUploadComponent() {
  const [progress, setProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState([])
  
  const {
    selectFiles,
    uploading,
    fileInputRef,
    handleFileSelect
  } = useFileUpload({
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/*', 'application/pdf'],
    multiple: true,
    onProgress: setProgress,
    onSuccess: (result) => {
      setUploadedFiles(prev => [...prev, result])
      setProgress(0)
    },
    onError: (error) => {
      alert(error.message)
      setProgress(0)
    }
  })
  
  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,application/pdf"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      
      <button onClick={selectFiles} disabled={uploading}>
        选择文件
      </button>
      
      {uploading && (
        <div>
          <div>上传中... {Math.round(progress)}%</div>
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      
      <div>
        {uploadedFiles.map((file, index) => (
          <div key={index}>
            已上传: {file.filename}
          </div>
        ))}
      </div>
    </div>
  )
}
```

通过这些高级用法，你可以构建更加复杂和强大的应用程序，充分发挥 Joy At Meeting 的潜力。