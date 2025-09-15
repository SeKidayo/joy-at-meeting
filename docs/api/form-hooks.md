# Form Hooks

表单处理相关的 React hooks，简化表单状态管理、验证和提交流程。

## useForm

强大的表单状态管理 hook，支持验证、错误处理和提交。

### 语法

```tsx
const {
  values,
  errors,
  touched,
  isValid,
  isSubmitting,
  handleChange,
  handleBlur,
  handleSubmit,
  setFieldValue,
  setFieldError,
  resetForm
} = useForm<T>({
  initialValues: T,
  validationSchema?: ValidationSchema,
  onSubmit: (values: T) => void | Promise<void>
})
```

### 参数

- `initialValues` (object): 表单初始值
- `validationSchema` (object, 可选): 验证规则
- `onSubmit` (function): 表单提交处理函数

### 返回值

返回一个对象，包含：
- `values` (T): 当前表单值
- `errors` (object): 验证错误信息
- `touched` (object): 字段是否被触摸过
- `isValid` (boolean): 表单是否有效
- `isSubmitting` (boolean): 是否正在提交
- `handleChange` (function): 处理输入变化
- `handleBlur` (function): 处理失焦事件
- `handleSubmit` (function): 处理表单提交
- `setFieldValue` (function): 设置字段值
- `setFieldError` (function): 设置字段错误
- `resetForm` (function): 重置表单

### 基础示例

```tsx
import { useForm } from 'joy-at-meeting'

interface LoginForm {
  email: string
  password: string
}

function LoginForm() {
  const {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit
  } = useForm<LoginForm>({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: {
      email: {
        required: '邮箱不能为空',
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: '请输入有效的邮箱地址'
        }
      },
      password: {
        required: '密码不能为空',
        minLength: {
          value: 6,
          message: '密码至少需要6个字符'
        }
      }
    },
    onSubmit: async (values) => {
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        })
        
        if (response.ok) {
          console.log('登录成功')
        } else {
          throw new Error('登录失败')
        }
      } catch (error) {
        console.error('登录错误:', error)
      }
    }
  })
  
  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="email">邮箱</label>
        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{
            width: '100%',
            padding: '8px',
            borderColor: errors.email && touched.email ? 'red' : '#ccc'
          }}
        />
        {errors.email && touched.email && (
          <div style={{ color: 'red', fontSize: '14px' }}>
            {errors.email}
          </div>
        )}
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="password">密码</label>
        <input
          id="password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{
            width: '100%',
            padding: '8px',
            borderColor: errors.password && touched.password ? 'red' : '#ccc'
          }}
        />
        {errors.password && touched.password && (
          <div style={{ color: 'red', fontSize: '14px' }}>
            {errors.password}
          </div>
        )}
      </div>
      
      <button 
        type="submit" 
        disabled={!isValid || isSubmitting}
        style={{
          padding: '10px 20px',
          backgroundColor: isValid ? '#007bff' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isValid ? 'pointer' : 'not-allowed'
        }}
      >
        {isSubmitting ? '登录中...' : '登录'}
      </button>
    </form>
  )
}
```

### 复杂表单示例

```tsx
interface UserRegistrationForm {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  account: {
    username: string
    password: string
    confirmPassword: string
  }
  preferences: {
    newsletter: boolean
    notifications: boolean
    theme: 'light' | 'dark'
  }
}

function RegistrationForm() {
  const {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    resetForm
  } = useForm<UserRegistrationForm>({
    initialValues: {
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      },
      account: {
        username: '',
        password: '',
        confirmPassword: ''
      },
      preferences: {
        newsletter: false,
        notifications: true,
        theme: 'light'
      }
    },
    validationSchema: {
      'personalInfo.firstName': {
        required: '名字不能为空'
      },
      'personalInfo.lastName': {
        required: '姓氏不能为空'
      },
      'personalInfo.email': {
        required: '邮箱不能为空',
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: '请输入有效的邮箱地址'
        }
      },
      'account.username': {
        required: '用户名不能为空',
        minLength: {
          value: 3,
          message: '用户名至少需要3个字符'
        }
      },
      'account.password': {
        required: '密码不能为空',
        minLength: {
          value: 8,
          message: '密码至少需要8个字符'
        },
        pattern: {
          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          message: '密码必须包含大小写字母和数字'
        }
      },
      'account.confirmPassword': {
        required: '请确认密码',
        validate: (value, allValues) => {
          return value === allValues.account.password || '密码不匹配'
        }
      }
    },
    onSubmit: async (values) => {
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        })
        
        if (response.ok) {
          console.log('注册成功')
          resetForm()
        } else {
          throw new Error('注册失败')
        }
      } catch (error) {
        console.error('注册错误:', error)
      }
    }
  })
  
  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
      <fieldset style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
        <legend>个人信息</legend>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label>名字</label>
            <input
              name="personalInfo.firstName"
              value={values.personalInfo.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ width: '100%', padding: '8px' }}
            />
            {errors['personalInfo.firstName'] && touched['personalInfo.firstName'] && (
              <div style={{ color: 'red', fontSize: '12px' }}>
                {errors['personalInfo.firstName']}
              </div>
            )}
          </div>
          
          <div>
            <label>姓氏</label>
            <input
              name="personalInfo.lastName"
              value={values.personalInfo.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ width: '100%', padding: '8px' }}
            />
            {errors['personalInfo.lastName'] && touched['personalInfo.lastName'] && (
              <div style={{ color: 'red', fontSize: '12px' }}>
                {errors['personalInfo.lastName']}
              </div>
            )}
          </div>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>邮箱</label>
          <input
            name="personalInfo.email"
            type="email"
            value={values.personalInfo.email}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{ width: '100%', padding: '8px' }}
          />
          {errors['personalInfo.email'] && touched['personalInfo.email'] && (
            <div style={{ color: 'red', fontSize: '12px' }}>
              {errors['personalInfo.email']}
            </div>
          )}
        </div>
        
        <div>
          <label>电话</label>
          <input
            name="personalInfo.phone"
            type="tel"
            value={values.personalInfo.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
      </fieldset>
      
      <fieldset style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
        <legend>账户信息</legend>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>用户名</label>
          <input
            name="account.username"
            value={values.account.username}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{ width: '100%', padding: '8px' }}
          />
          {errors['account.username'] && touched['account.username'] && (
            <div style={{ color: 'red', fontSize: '12px' }}>
              {errors['account.username']}
            </div>
          )}
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>密码</label>
          <input
            name="account.password"
            type="password"
            value={values.account.password}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{ width: '100%', padding: '8px' }}
          />
          {errors['account.password'] && touched['account.password'] && (
            <div style={{ color: 'red', fontSize: '12px' }}>
              {errors['account.password']}
            </div>
          )}
        </div>
        
        <div>
          <label>确认密码</label>
          <input
            name="account.confirmPassword"
            type="password"
            value={values.account.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{ width: '100%', padding: '8px' }}
          />
          {errors['account.confirmPassword'] && touched['account.confirmPassword'] && (
            <div style={{ color: 'red', fontSize: '12px' }}>
              {errors['account.confirmPassword']}
            </div>
          )}
        </div>
      </fieldset>
      
      <fieldset style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
        <legend>偏好设置</legend>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>
            <input
              name="preferences.newsletter"
              type="checkbox"
              checked={values.preferences.newsletter}
              onChange={handleChange}
              style={{ marginRight: '8px' }}
            />
            订阅邮件通知
          </label>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>
            <input
              name="preferences.notifications"
              type="checkbox"
              checked={values.preferences.notifications}
              onChange={handleChange}
              style={{ marginRight: '8px' }}
            />
            接收推送通知
          </label>
        </div>
        
        <div>
          <label>主题</label>
          <select
            name="preferences.theme"
            value={values.preferences.theme}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="light">浅色主题</option>
            <option value="dark">深色主题</option>
          </select>
        </div>
      </fieldset>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button 
          type="submit" 
          disabled={!isValid || isSubmitting}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: isValid ? '#007bff' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isValid ? 'pointer' : 'not-allowed'
          }}
        >
          {isSubmitting ? '注册中...' : '注册'}
        </button>
        
        <button 
          type="button"
          onClick={resetForm}
          style={{
            padding: '12px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          重置
        </button>
      </div>
    </form>
  )
}
```

### 动态表单示例

```tsx
interface DynamicFormData {
  title: string
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
}

function DynamicForm() {
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setFieldValue
  } = useForm<DynamicFormData>({
    initialValues: {
      title: '',
      items: [{
        id: '1',
        name: '',
        quantity: 1,
        price: 0
      }]
    },
    validationSchema: {
      title: {
        required: '标题不能为空'
      }
    },
    onSubmit: (values) => {
      console.log('提交数据:', values)
    }
  })
  
  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      price: 0
    }
    setFieldValue('items', [...values.items, newItem])
  }
  
  const removeItem = (index: number) => {
    const newItems = values.items.filter((_, i) => i !== index)
    setFieldValue('items', newItems)
  }
  
  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...values.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setFieldValue('items', newItems)
  }
  
  const totalAmount = values.items.reduce((sum, item) => {
    return sum + (item.quantity * item.price)
  }, 0)
  
  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <label>订单标题</label>
        <input
          name="title"
          value={values.title}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px' }}
        />
        {errors.title && (
          <div style={{ color: 'red', fontSize: '12px' }}>
            {errors.title}
          </div>
        )}
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>订单项目</h3>
          <button 
            type="button" 
            onClick={addItem}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            添加项目
          </button>
        </div>
        
        {values.items.map((item, index) => (
          <div key={item.id} style={{ 
            display: 'grid', 
            gridTemplateColumns: '2fr 1fr 1fr auto', 
            gap: '0.5rem', 
            alignItems: 'center',
            marginBottom: '0.5rem',
            padding: '0.5rem',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}>
            <input
              placeholder="项目名称"
              value={item.name}
              onChange={(e) => updateItem(index, 'name', e.target.value)}
              style={{ padding: '4px' }}
            />
            
            <input
              type="number"
              placeholder="数量"
              min="1"
              value={item.quantity}
              onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
              style={{ padding: '4px' }}
            />
            
            <input
              type="number"
              placeholder="单价"
              min="0"
              step="0.01"
              value={item.price}
              onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
              style={{ padding: '4px' }}
            />
            
            <button
              type="button"
              onClick={() => removeItem(index)}
              disabled={values.items.length === 1}
              style={{
                padding: '4px 8px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: values.items.length === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              删除
            </button>
          </div>
        ))}
        
        <div style={{ 
          textAlign: 'right', 
          marginTop: '1rem', 
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px'
        }}>
          <strong>总金额: ¥{totalAmount.toFixed(2)}</strong>
        </div>
      </div>
      
      <button 
        type="submit"
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        提交订单
      </button>
    </form>
  )
}
```

### 特性

- ✅ 强大的验证系统
- ✅ 嵌套对象支持
- ✅ 动态表单支持
- ✅ 异步提交处理
- ✅ TypeScript 类型安全
- ✅ 自动错误处理

---

## useFormField

单个表单字段的状态管理 hook。

### 语法

```tsx
const {
  value,
  error,
  touched,
  isValid,
  setValue,
  setError,
  setTouched,
  validate,
  reset
} = useFormField<T>({
  initialValue: T,
  validation?: ValidationRule
})
```

### 参数

- `initialValue` (T): 字段初始值
- `validation` (object, 可选): 验证规则

### 返回值

返回一个对象，包含：
- `value` (T): 当前字段值
- `error` (string | null): 错误信息
- `touched` (boolean): 是否被触摸过
- `isValid` (boolean): 字段是否有效
- `setValue` (function): 设置字段值
- `setError` (function): 设置错误信息
- `setTouched` (function): 设置触摸状态
- `validate` (function): 手动验证
- `reset` (function): 重置字段

### 基础示例

```tsx
import { useFormField } from 'joy-at-meeting'

function EmailField() {
  const {
    value,
    error,
    touched,
    isValid,
    setValue,
    setTouched,
    validate
  } = useFormField({
    initialValue: '',
    validation: {
      required: '邮箱不能为空',
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: '请输入有效的邮箱地址'
      }
    }
  })
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }
  
  const handleBlur = () => {
    setTouched(true)
    validate()
  }
  
  return (
    <div>
      <label>邮箱地址</label>
      <input
        type="email"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        style={{
          width: '100%',
          padding: '8px',
          borderColor: error && touched ? 'red' : isValid && touched ? 'green' : '#ccc'
        }}
      />
      
      {error && touched && (
        <div style={{ color: 'red', fontSize: '14px' }}>
          {error}
        </div>
      )}
      
      {isValid && touched && (
        <div style={{ color: 'green', fontSize: '14px' }}>
          ✓ 邮箱格式正确
        </div>
      )}
    </div>
  )
}
```

### 异步验证示例

```tsx
function UsernameField() {
  const [isChecking, setIsChecking] = useState(false)
  
  const {
    value,
    error,
    touched,
    isValid,
    setValue,
    setError,
    setTouched
  } = useFormField({
    initialValue: '',
    validation: {
      required: '用户名不能为空',
      minLength: {
        value: 3,
        message: '用户名至少需要3个字符'
      }
    }
  })
  
  const debouncedValue = useDebounce(value, 500)
  
  useEffect(() => {
    if (debouncedValue && debouncedValue.length >= 3) {
      setIsChecking(true)
      
      // 检查用户名是否可用
      fetch(`/api/check-username?username=${debouncedValue}`)
        .then(response => response.json())
        .then(data => {
          if (data.exists) {
            setError('用户名已被占用')
          } else {
            setError(null)
          }
        })
        .catch(() => {
          setError('检查用户名时出错')
        })
        .finally(() => {
          setIsChecking(false)
        })
    }
  }, [debouncedValue, setError])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }
  
  const handleBlur = () => {
    setTouched(true)
  }
  
  return (
    <div>
      <label>用户名</label>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{
            width: '100%',
            padding: '8px',
            paddingRight: '30px',
            borderColor: error && touched ? 'red' : isValid && touched ? 'green' : '#ccc'
          }}
        />
        
        {isChecking && (
          <div style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)'
          }}>
            ⏳
          </div>
        )}
      </div>
      
      {error && touched && (
        <div style={{ color: 'red', fontSize: '14px' }}>
          {error}
        </div>
      )}
      
      {isValid && touched && !isChecking && (
        <div style={{ color: 'green', fontSize: '14px' }}>
          ✓ 用户名可用
        </div>
      )}
    </div>
  )
}
```

### 特性

- ✅ 单字段状态管理
- ✅ 实时验证
- ✅ 异步验证支持
- ✅ TypeScript 类型安全

## 组合使用

表单 hooks 可以与其他 hooks 组合使用：

```tsx
import { 
  useForm, 
  useFormField,
  useLocalStorage,
  useDebounce 
} from 'joy-at-meeting'

function AdvancedContactForm() {
  // 使用 localStorage 保存草稿
  const [draft, setDraft] = useLocalStorage('contactFormDraft', null)
  
  const {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue
  } = useForm({
    initialValues: draft || {
      name: '',
      email: '',
      subject: '',
      message: '',
      priority: 'normal'
    },
    validationSchema: {
      name: { required: '姓名不能为空' },
      email: {
        required: '邮箱不能为空',
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: '请输入有效的邮箱地址'
        }
      },
      subject: { required: '主题不能为空' },
      message: {
        required: '消息不能为空',
        minLength: {
          value: 10,
          message: '消息至少需要10个字符'
        }
      }
    },
    onSubmit: async (values) => {
      try {
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        })
        
        // 清除草稿
        setDraft(null)
        console.log('消息发送成功')
      } catch (error) {
        console.error('发送失败:', error)
      }
    }
  })
  
  // 防抖保存草稿
  const debouncedValues = useDebounce(values, 1000)
  
  useEffect(() => {
    if (debouncedValues && Object.values(debouncedValues).some(v => v)) {
      setDraft(debouncedValues)
    }
  }, [debouncedValues, setDraft])
  
  // 字符计数
  const messageLength = values.message.length
  const maxLength = 500
  
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>联系我们</h2>
      
      {draft && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#e7f3ff', 
          borderRadius: '4px', 
          marginBottom: '1rem' 
        }}>
          📝 检测到草稿，已自动恢复
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label>姓名 *</label>
            <input
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ width: '100%', padding: '8px' }}
            />
            {errors.name && touched.name && (
              <div style={{ color: 'red', fontSize: '12px' }}>{errors.name}</div>
            )}
          </div>
          
          <div>
            <label>邮箱 *</label>
            <input
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ width: '100%', padding: '8px' }}
            />
            {errors.email && touched.email && (
              <div style={{ color: 'red', fontSize: '12px' }}>{errors.email}</div>
            )}
          </div>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>主题 *</label>
          <input
            name="subject"
            value={values.subject}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{ width: '100%', padding: '8px' }}
          />
          {errors.subject && touched.subject && (
            <div style={{ color: 'red', fontSize: '12px' }}>{errors.subject}</div>
          )}
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>优先级</label>
          <select
            name="priority"
            value={values.priority}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="low">低</option>
            <option value="normal">普通</option>
            <option value="high">高</option>
            <option value="urgent">紧急</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>消息 *</label>
            <span style={{ 
              fontSize: '12px', 
              color: messageLength > maxLength ? 'red' : '#666' 
            }}>
              {messageLength}/{maxLength}
            </span>
          </div>
          <textarea
            name="message"
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={6}
            maxLength={maxLength}
            style={{ 
              width: '100%', 
              padding: '8px',
              borderColor: messageLength > maxLength ? 'red' : '#ccc'
            }}
          />
          {errors.message && touched.message && (
            <div style={{ color: 'red', fontSize: '12px' }}>{errors.message}</div>
          )}
        </div>
        
        <button 
          type="submit" 
          disabled={!isValid || isSubmitting || messageLength > maxLength}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isValid && messageLength <= maxLength ? '#007bff' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isValid && messageLength <= maxLength ? 'pointer' : 'not-allowed'
          }}
        >
          {isSubmitting ? '发送中...' : '发送消息'}
        </button>
      </form>
    </div>
  )
}
```

这个示例展示了如何组合使用表单 hooks 与其他 hooks 来创建一个功能丰富的联系表单，包括草稿保存、字符计数、实时验证等功能。

## useValidation

强大的表单验证 hook，提供丰富的内置验证规则和自定义验证功能。

### 语法

```tsx
const { validate, validateAll, createValidator } = useValidation({
  rules: ValidationRule[],
  stopOnFirstError?: boolean
})
```

### 参数

- `rules` (ValidationRule[]): 验证规则数组
- `stopOnFirstError` (boolean, 可选): 是否在第一个错误时停止验证，默认为 true

### 返回值

返回一个对象，包含：
- `validate` (function): 验证单个值的函数
- `validateAll` (function): 验证多个值的函数
- `createValidator` (function): 创建验证器的函数

### 内置验证规则

```tsx
import { validationRules } from 'joy-at-meeting'

// 必填验证
validationRules.required('此字段为必填项')

// 长度验证
validationRules.minLength(3, '最少3个字符')
validationRules.maxLength(50, '最多50个字符')

// 数值验证
validationRules.min(0, '最小值为0')
validationRules.max(100, '最大值为100')

// 格式验证
validationRules.email('请输入有效的邮箱地址')
validationRules.phone('请输入有效的手机号码')
validationRules.url('请输入有效的URL')
validationRules.number('请输入有效的数字')
validationRules.integer('请输入有效的整数')

// 正则表达式验证
validationRules.pattern(/^[a-zA-Z0-9]+$/, '只能包含字母和数字')

// 密码验证
validationRules.password({
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true
}, '密码不符合要求')

// 确认密码验证
validationRules.confirmPassword(passwordValue, '密码不匹配')
```

### 基础示例

```tsx
import { useValidation, validationRules } from 'joy-at-meeting'

function ValidationExample() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | undefined>()
  
  const { validate } = useValidation({
    rules: [
      validationRules.required('邮箱不能为空'),
      validationRules.email('请输入有效的邮箱地址')
    ]
  })
  
  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    
    const validationError = await validate(value, 'email')
    setError(validationError)
  }
  
  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="请输入邮箱"
        style={{
          padding: '8px',
          borderColor: error ? 'red' : '#ccc'
        }}
      />
      {error && (
        <div style={{ color: 'red', fontSize: '14px' }}>
          {error}
        </div>
      )}
    </div>
  )
}
```

### 批量验证示例

```tsx
interface FormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  age: number
}

function BatchValidationExample() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: 0
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const { validateAll, createValidator } = useValidation()
  
  // 为不同字段创建不同的验证器
  const validators = {
    username: createValidator([
      validationRules.required('用户名不能为空'),
      validationRules.minLength(3, '用户名至少3个字符'),
      validationRules.pattern(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线')
    ]),
    email: createValidator([
      validationRules.required('邮箱不能为空'),
      validationRules.email('请输入有效的邮箱地址')
    ]),
    password: createValidator([
      validationRules.required('密码不能为空'),
      validationRules.password({
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true
      }, '密码必须包含大小写字母、数字，且至少8位')
    ]),
    confirmPassword: createValidator([
      validationRules.required('请确认密码'),
      validationRules.confirmPassword(formData.password, '密码不匹配')
    ]),
    age: createValidator([
      validationRules.required('年龄不能为空'),
      validationRules.min(18, '年龄必须大于等于18岁'),
      validationRules.max(120, '年龄必须小于等于120岁')
    ])
  }
  
  const validateForm = async () => {
    const validationPromises = Object.entries(formData).map(
      async ([field, value]) => {
        const validator = validators[field as keyof typeof validators]
        if (validator) {
          const error = await validator(value, field)
          return { field, error }
        }
        return { field, error: undefined }
      }
    )
    
    const results = await Promise.all(validationPromises)
    const newErrors: Record<string, string> = {}
    
    results.forEach(({ field, error }) => {
      if (error) {
        newErrors[field] = error
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const isValid = await validateForm()
    if (isValid) {
      console.log('表单验证通过:', formData)
    } else {
      console.log('表单验证失败:', errors)
    }
  }
  
  const handleFieldChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // 清除该字段的错误
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }
  
  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label>用户名</label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => handleFieldChange('username', e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderColor: errors.username ? 'red' : '#ccc'
          }}
        />
        {errors.username && (
          <div style={{ color: 'red', fontSize: '12px' }}>
            {errors.username}
          </div>
        )}
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <label>邮箱</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleFieldChange('email', e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderColor: errors.email ? 'red' : '#ccc'
          }}
        />
        {errors.email && (
          <div style={{ color: 'red', fontSize: '12px' }}>
            {errors.email}
          </div>
        )}
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <label>密码</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => handleFieldChange('password', e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderColor: errors.password ? 'red' : '#ccc'
          }}
        />
        {errors.password && (
          <div style={{ color: 'red', fontSize: '12px' }}>
            {errors.password}
          </div>
        )}
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <label>确认密码</label>
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderColor: errors.confirmPassword ? 'red' : '#ccc'
          }}
        />
        {errors.confirmPassword && (
          <div style={{ color: 'red', fontSize: '12px' }}>
            {errors.confirmPassword}
          </div>
        )}
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <label>年龄</label>
        <input
          type="number"
          value={formData.age}
          onChange={(e) => handleFieldChange('age', parseInt(e.target.value) || 0)}
          style={{
            width: '100%',
            padding: '8px',
            borderColor: errors.age ? 'red' : '#ccc'
          }}
        />
        {errors.age && (
          <div style={{ color: 'red', fontSize: '12px' }}>
            {errors.age}
          </div>
        )}
      </div>
      
      <button
        type="submit"
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        提交
      </button>
    </form>
  )
}
```

### 自定义验证规则

```tsx
// 创建自定义验证规则
const customValidationRule: ValidationRule<string> = (value, fieldName) => {
  if (value && value.includes('admin')) {
    return '用户名不能包含"admin"'
  }
  return undefined
}

// 异步验证规则
const asyncValidationRule: ValidationRule<string> = async (value) => {
  if (!value) return undefined
  
  try {
    const response = await fetch(`/api/check-username?username=${value}`)
    const data = await response.json()
    
    if (!data.available) {
      return '用户名已被占用'
    }
  } catch (error) {
    return '验证用户名时发生错误'
  }
  
  return undefined
}

function CustomValidationExample() {
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [isValidating, setIsValidating] = useState(false)
  
  const { validate } = useValidation({
    rules: [
      validationRules.required('用户名不能为空'),
      validationRules.minLength(3, '用户名至少3个字符'),
      customValidationRule,
      asyncValidationRule
    ],
    stopOnFirstError: true
  })
  
  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUsername(value)
    setIsValidating(true)
    
    try {
      const validationError = await validate(value, 'username')
      setError(validationError)
    } finally {
      setIsValidating(false)
    }
  }
  
  return (
    <div>
      <input
        type="text"
        value={username}
        onChange={handleUsernameChange}
        placeholder="请输入用户名"
        style={{
          padding: '8px',
          borderColor: error ? 'red' : '#ccc'
        }}
      />
      {isValidating && (
        <div style={{ color: '#666', fontSize: '12px' }}>
          验证中...
        </div>
      )}
      {error && !isValidating && (
        <div style={{ color: 'red', fontSize: '12px' }}>
          {error}
        </div>
      )}
    </div>
  )
}
```

### 特性

- **丰富的内置验证规则**: 提供常用的验证规则，如必填、长度、格式等
- **自定义验证规则**: 支持创建自定义的同步和异步验证规则
- **批量验证**: 可以同时验证多个字段
- **错误控制**: 支持在第一个错误时停止验证或收集所有错误
- **TypeScript 支持**: 完整的类型定义和类型安全
- **性能优化**: 使用 useMemo 和 useCallback 优化性能
- **灵活组合**: 可以与其他 hooks 灵活组合使用