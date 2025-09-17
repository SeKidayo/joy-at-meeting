# 代码预览功能

VitePress 支持多种代码预览和演示功能，让文档更加生动和实用。

## 基础代码高亮

### TypeScript/JavaScript

```typescript
import { useState } from 'react'
import { useToggle } from 'joy-at-meeting'

function ToggleExample() {
  const [isOn, toggle] = useToggle(false)
  
  return (
    <button onClick={toggle}>
      {isOn ? '开启' : '关闭'}
    </button>
  )
}
```

### 带行号的代码

```typescript {1,3-5}
import { useState } from 'react'
import { useToggle } from 'joy-at-meeting'

function ToggleExample() {
  const [isOn, toggle] = useToggle(false)
  
  return (
    <button onClick={toggle}>
      {isOn ? '开启' : '关闭'}
    </button>
  )
}
```

## 代码组示例

::: code-group

```typescript [useToggle.ts]
import { useState, useCallback } from 'react'

export function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue)
  
  const toggle = useCallback(() => {
    setValue(prev => !prev)
  }, [])
  
  const setTrue = useCallback(() => {
    setValue(true)
  }, [])
  
  const setFalse = useCallback(() => {
    setValue(false)
  }, [])
  
  return [value, toggle, setTrue, setFalse] as const
}
```

```tsx [Example.tsx]
import React from 'react'
import { useToggle } from './useToggle'

function ToggleDemo() {
  const [isVisible, toggle, show, hide] = useToggle(false)
  
  return (
    <div>
      <div className="controls">
        <button onClick={toggle}>切换</button>
        <button onClick={show}>显示</button>
        <button onClick={hide}>隐藏</button>
      </div>
      
      {isVisible && (
        <div className="content">
          <p>这是可切换的内容</p>
        </div>
      )}
    </div>
  )
}

export default ToggleDemo
```

```css [styles.css]
.controls {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.controls button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.controls button:hover {
  background: #f5f5f5;
  border-color: #999;
}

.content {
  padding: 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

:::

## 交互式代码演示

### 使用自定义演示组件

我们创建了一个自定义的 `HookDemo` 组件来展示 hooks 的实际效果：

<HookDemo title="useToggle Hook 演示">
  <template #demo>
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <div style="display: flex; gap: 8px; align-items: center;">
        <button 
          @click="toggleValue" 
          style="padding: 8px 16px; border: 1px solid #ddd; border-radius: 4px; background: white; cursor: pointer;"
        >
          {{ isOn ? '关闭' : '开启' }}
        </button>
        <span style="color: var(--vp-c-text-1);">状态: {{ isOn ? '✅ 开启' : '❌ 关闭' }}</span>
      </div>
      <div style="display: flex; gap: 8px;">
        <button 
          @click="setTrue" 
          style="padding: 6px 12px; border: 1px solid #28a745; color: #28a745; background: white; border-radius: 4px; cursor: pointer;"
        >
          强制开启
        </button>
        <button 
          @click="setFalse" 
          style="padding: 6px 12px; border: 1px solid #dc3545; color: #dc3545; background: white; border-radius: 4px; cursor: pointer;"
        >
          强制关闭
        </button>
      </div>
    </div>
  </template>
  
  <template #code>

```typescript
import { useState, useCallback } from 'react'

// useToggle Hook 实现
export function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue)
  
  const toggle = useCallback(() => {
    setValue(prev => !prev)
  }, [])
  
  const setTrue = useCallback(() => {
    setValue(true)
  }, [])
  
  const setFalse = useCallback(() => {
    setValue(false)
  }, [])
  
  return [value, toggle, setTrue, setFalse] as const
}

// 使用示例
function ToggleDemo() {
  const [isOn, toggle, setTrue, setFalse] = useToggle(false)
  
  return (
    <div>
      <button onClick={toggle}>
        {isOn ? '关闭' : '开启'}
      </button>
      <span>状态: {isOn ? '✅ 开启' : '❌ 关闭'}</span>
      
      <div>
        <button onClick={setTrue}>强制开启</button>
        <button onClick={setFalse}>强制关闭</button>
      </div>
    </div>
  )
}
```

  </template>
  
  <template #description>
    <p><strong>useToggle</strong> 是一个用于管理布尔状态的 Hook，提供了切换、强制设置为 true 或 false 的功能。</p>
    <h5>特性：</h5>
    <ul>
      <li>✅ 支持初始值设置</li>
      <li>✅ 提供 toggle 切换功能</li>
      <li>✅ 提供强制设置 true/false 的方法</li>
      <li>✅ 使用 useCallback 优化性能</li>
      <li>✅ TypeScript 类型安全</li>
    </ul>
    <h5>适用场景：</h5>
    <ul>
      <li>模态框显示/隐藏</li>
      <li>开关状态管理</li>
      <li>折叠面板控制</li>
      <li>主题切换</li>
    </ul>
  </template>
</HookDemo>

<script setup>
import { ref } from 'vue'
import HookDemo from '../.vitepress/components/HookDemo.vue'

// 模拟 useToggle 的行为
const isOn = ref(false)

const toggleValue = () => {
  isOn.value = !isOn.value
}

const setTrue = () => {
  isOn.value = true
}

const setFalse = () => {
  isOn.value = false
}
</script>

### 实时编辑器集成

你也可以使用 VitePress 的插件来集成在线代码编辑器：

```vue
<template>
  <div class="demo-container">
    <!-- 代码演示区域 -->
    <div class="demo-preview">
      <ToggleDemo />
    </div>
    
    <!-- 代码编辑器 -->
    <div class="demo-code">
      <CodeEditor 
        :code="demoCode" 
        language="tsx"
        @change="updateCode"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ToggleDemo from './components/ToggleDemo.vue'
import CodeEditor from './components/CodeEditor.vue'

const demoCode = ref(`
import React from 'react'
import { useToggle } from 'joy-at-meeting'

function ToggleDemo() {
  const [isVisible, toggle] = useToggle(false)
  
  return (
    <div>
      <button onClick={toggle}>
        {isVisible ? '隐藏' : '显示'}
      </button>
      {isVisible && <p>Hello World!</p>}
    </div>
  )
}

export default ToggleDemo
`)

function updateCode(newCode) {
  demoCode.value = newCode
}
</script>
```

## 代码块功能增强

### 1. 代码复制功能

VitePress 自动为所有代码块添加复制按钮：

```typescript
// 这个代码块右上角会有复制按钮
import { useLocalStorage } from 'joy-at-meeting'

function App() {
  const [name, setName] = useLocalStorage('username', '')
  
  return (
    <input 
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="输入用户名"
    />
  )
}
```

### 2. 代码折叠

```typescript
// 长代码可以设置折叠
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { 
  useLocalStorage, 
  useToggle, 
  useDebounce,
  useThrottle,
  useAsync,
  useFetch
} from 'joy-at-meeting'

interface User {
  id: number
  name: string
  email: string
}

function ComplexComponent() {
  // 状态管理
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useLocalStorage('search', '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // 防抖搜索
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  
  // 异步数据获取
  const fetchUsers = useCallback(async (search: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/users?search=${search}`)
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  // 监听搜索词变化
  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchUsers(debouncedSearchTerm)
    } else {
      setUsers([])
    }
  }, [debouncedSearchTerm, fetchUsers])
  
  // 过滤用户
  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    )
  }, [users, debouncedSearchTerm])
  
  return (
    <div className="user-search">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="搜索用户..."
        className="search-input"
      />
      
      {isLoading && <div className="loading">加载中...</div>}
      {error && <div className="error">错误: {error}</div>}
      
      <div className="user-list">
        {filteredUsers.map(user => (
          <div key={user.id} className="user-item">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ComplexComponent
```

### 3. 代码差异对比

```typescript
// 旧版本
function useToggle(initialValue: boolean) {
  const [value, setValue] = useState(initialValue)
  
  const toggle = () => {
    setValue(!value) // [!code --]
  }
  
  return [value, toggle]
}

// 新版本
function useToggle(initialValue: boolean = false) { // [!code ++]
  const [value, setValue] = useState(initialValue)
  
  const toggle = useCallback(() => { // [!code ++]
    setValue(prev => !prev) // [!code ++]
  }, []) // [!code ++]
  
  return [value, toggle]
}
```

## 集成第三方预览工具

### CodeSandbox 集成

你可以在文档中嵌入 CodeSandbox：

<iframe 
  src="https://codesandbox.io/embed/joy-at-meeting-demo-xyz123?fontsize=14&hidenavigation=1&theme=dark"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="Joy At Meeting Demo"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

### StackBlitz 集成

```html
<iframe 
  src="https://stackblitz.com/edit/react-joy-at-meeting?embed=1&file=src/App.tsx"
  style="width:100%; height:500px; border:0; border-radius: 4px;"
  title="Joy At Meeting on StackBlitz"
></iframe>
```

## 自定义代码预览组件

你可以创建自定义的 Vue 组件来增强代码预览功能：

```vue
<!-- .vitepress/components/CodePreview.vue -->
<template>
  <div class="code-preview">
    <div class="preview-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.name"
        :class="{ active: activeTab === tab.name }"
        @click="activeTab = tab.name"
      >
        {{ tab.label }}
      </button>
    </div>
    
    <div class="preview-content">
      <div v-if="activeTab === 'preview'" class="demo-area">
        <slot name="demo" />
      </div>
      
      <div v-else class="code-area">
        <slot name="code" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('preview')
const tabs = [
  { name: 'preview', label: '预览' },
  { name: 'code', label: '代码' }
]
</script>

<style scoped>
.code-preview {
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  overflow: hidden;
}

.preview-tabs {
  display: flex;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-border);
}

.preview-tabs button {
  padding: 8px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.preview-tabs button.active {
  background: var(--vp-c-bg);
  color: var(--vp-c-brand);
}

.preview-content {
  padding: 16px;
}

.demo-area {
  min-height: 200px;
}
</style>
```

## 配置代码预览功能

在 VitePress 配置中启用代码预览功能：

```typescript
// .vitepress/config.ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  // ... 其他配置
  
  markdown: {
    // 启用代码行号
    lineNumbers: true,
    
    // 配置代码高亮
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    
    // 自定义代码块配置
    config: (md) => {
      // 添加自定义代码块处理
      md.use(require('markdown-it-container'), 'demo', {
        render: (tokens, idx) => {
          const token = tokens[idx]
          if (token.nesting === 1) {
            return `<div class="demo-container">`
          } else {
            return `</div>`
          }
        }
      })
    }
  },
  
  // 配置 Vue 组件
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.includes('-')
      }
    }
  }
})
```

## 最佳实践

### 1. 代码示例组织

- 将复杂示例拆分为多个文件
- 使用代码组展示相关文件
- 提供完整的可运行示例

### 2. 交互性增强

- 添加实时预览功能
- 提供可编辑的代码示例
- 集成在线编辑器

### 3. 用户体验

- 确保代码可复制
- 提供清晰的注释
- 使用语法高亮
- 添加错误处理示例

通过这些功能，VitePress 可以提供丰富的代码预览和演示体验，让文档更加生动和实用。