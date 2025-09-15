# DOM Hooks

DOM 操作相关的 React hooks，帮助你更优雅地处理 DOM 交互。

## useClickOutside

检测元素外部的点击事件。

### 语法

```tsx
useClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  handler: (event: Event) => void,
  mouseEvent?: keyof DocumentEventMap,
  touchEvent?: keyof DocumentEventMap
)
```

### 参数

- `ref` (RefObject): 要监听的元素引用
- `handler` (function): 点击外部时的回调函数
- `mouseEvent` (string, 可选): 要监听的鼠标事件类型，默认为 `'mousedown'`
- `touchEvent` (string, 可选): 要监听的触摸事件类型，默认为 `'touchstart'`

### 示例

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
          <div onClick={() => console.log('Item 1')}>菜单项 1</div>
          <div onClick={() => console.log('Item 2')}>菜单项 2</div>
          <div onClick={() => console.log('Item 3')}>菜单项 3</div>
        </div>
      )}
    </div>
  )
}
```

### 高级示例

```tsx
function Modal() {
  const [isOpen, setIsOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // 只监听 mousedown 事件
  useClickOutside(modalRef, () => {
    setIsOpen(false)
  }, 'mousedown')

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div ref={modalRef} className="modal-content">
        <h2>模态框</h2>
        <p>点击外部区域关闭</p>
        <button onClick={() => setIsOpen(false)}>关闭</button>
      </div>
    </div>
  )
}
```

---

## useScrollPosition

监听窗口或特定元素的滚动位置。

### 语法

```tsx
const { x, y } = useScrollPosition(options?: UseScrollPositionOptions)
```

### UseScrollPositionOptions

```tsx
interface UseScrollPositionOptions {
  element?: RefObject<HTMLElement>  // 要监听的元素，默认为 window
  useWindow?: boolean              // 是否监听 window 滚动，默认为 true
  wait?: number                    // 节流延迟时间（毫秒），默认为 100
}
```

### 返回值

返回一个对象，包含：
- `x` (number): 水平滚动位置
- `y` (number): 垂直滚动位置

### 示例

```tsx
import { useScrollPosition } from 'joy-at-meeting'

function ScrollIndicator() {
  const { x, y } = useScrollPosition()
  
  // 计算滚动进度
  const scrollProgress = Math.min(
    (y / (document.body.scrollHeight - window.innerHeight)) * 100,
    100
  )

  return (
    <div className="scroll-indicator">
      <div>滚动位置: ({x}, {y})</div>
      <div className="progress-bar">
        <div 
          className="progress" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </div>
  )
}
```

### 监听特定元素

```tsx
function ScrollableContent() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { x, y } = useScrollPosition({ 
    element: containerRef,
    useWindow: false,
    wait: 50 // 更频繁的更新
  })

  return (
    <div>
      <div>容器滚动位置: ({x}, {y})</div>
      <div 
        ref={containerRef}
        style={{ height: '300px', overflow: 'auto' }}
      >
        {/* 长内容 */}
        <div style={{ height: '1000px' }}>
          滚动内容...
        </div>
      </div>
    </div>
  )
}
```

---

## useElementSize

监听元素尺寸变化。

### 语法

```tsx
const { width, height } = useElementSize<T extends HTMLElement>(
  ref: RefObject<T>
)
```

### 参数

- `ref` (RefObject): 要监听的元素引用

### 返回值

返回一个对象，包含：
- `width` (number): 元素宽度
- `height` (number): 元素高度

### 示例

```tsx
import { useRef } from 'react'
import { useElementSize } from 'joy-at-meeting'

function ResizableBox() {
  const boxRef = useRef<HTMLDivElement>(null)
  const { width, height } = useElementSize(boxRef)

  return (
    <div>
      <div>尺寸: {width} x {height}</div>
      <div 
        ref={boxRef}
        style={{ 
          width: '50%', 
          height: '200px', 
          border: '1px solid #ccc',
          resize: 'both',
          overflow: 'auto',
          minWidth: '100px',
          minHeight: '100px'
        }}
      >
        <p>拖拽右下角调整大小</p>
        <p>当前尺寸会实时更新</p>
      </div>
    </div>
  )
}
```

### 响应式布局

```tsx
function ResponsiveComponent() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { width } = useElementSize(containerRef)
  
  const isMobile = width < 768
  const isTablet = width >= 768 && width < 1024
  const isDesktop = width >= 1024

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <h2>
        当前设备: {isMobile ? '手机' : isTablet ? '平板' : '桌面'}
      </h2>
      <p>容器宽度: {width}px</p>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1fr 1fr 1fr',
        gap: '1rem'
      }}>
        <div>项目 1</div>
        <div>项目 2</div>
        <div>项目 3</div>
      </div>
    </div>
  )
}
```

---

## useHover

监听元素的鼠标悬停状态。

### 语法

```tsx
const [isHovered, hoverProps] = useHover<T extends HTMLElement>(
  options?: UseHoverOptions
)
```

### UseHoverOptions

```tsx
interface UseHoverOptions {
  enterDelay?: number  // 鼠标进入延迟（毫秒），默认为 0
  leaveDelay?: number  // 鼠标离开延迟（毫秒），默认为 0
}
```

### 返回值

返回一个数组，包含：
- `isHovered` (boolean): 是否处于悬停状态
- `hoverProps` (object): 包含 `onMouseEnter` 和 `onMouseLeave` 的属性对象

### 示例

```tsx
import { useHover } from 'joy-at-meeting'

function HoverCard() {
  const [isHovered, hoverProps] = useHover()

  return (
    <div 
      {...hoverProps}
      style={{
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: isHovered ? '#f0f0f0' : 'white',
        transition: 'background-color 0.2s',
        cursor: 'pointer'
      }}
    >
      <h3>悬停卡片</h3>
      <p>状态: {isHovered ? '悬停中' : '正常'}</p>
    </div>
  )
}
```

### 带延迟的悬停

```tsx
function TooltipTrigger() {
  const [isHovered, hoverProps] = useHover({
    enterDelay: 500,  // 500ms 后显示
    leaveDelay: 200   // 200ms 后隐藏
  })

  return (
    <div style={{ position: 'relative' }}>
      <button {...hoverProps}>
        悬停显示提示
      </button>
      
      {isHovered && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'black',
          color: 'white',
          padding: '8px',
          borderRadius: '4px',
          whiteSpace: 'nowrap'
        }}>
          这是一个提示信息
        </div>
      )}
    </div>
  )
}
```

---

## useFocus

监听元素的焦点状态。

### 语法

```tsx
const { isFocused, isFocusedWithin, focusProps } = useFocus<T extends HTMLElement>(
  options?: UseFocusOptions
)
```

### UseFocusOptions

```tsx
interface UseFocusOptions {
  onFocus?: (event: FocusEvent) => void     // 获得焦点回调
  onBlur?: (event: FocusEvent) => void      // 失去焦点回调
  onFocusChange?: (isFocused: boolean) => void  // 焦点状态变化回调
}
```

### 返回值

返回一个对象，包含：
- `isFocused` (boolean): 元素是否获得焦点
- `isFocusedWithin` (boolean): 元素或其子元素是否获得焦点
- `focusProps` (object): 包含焦点事件处理器的属性对象

### 示例

```tsx
import { useFocus } from 'joy-at-meeting'

function FocusableInput() {
  const { isFocused, focusProps } = useFocus({
    onFocusChange: (focused) => {
      console.log('焦点状态变化:', focused)
    }
  })

  return (
    <div>
      <input 
        {...focusProps}
        placeholder="点击获得焦点"
        style={{
          border: `2px solid ${isFocused ? 'blue' : 'gray'}`,
          outline: 'none',
          padding: '8px'
        }}
      />
      <p>焦点状态: {isFocused ? '已获得' : '未获得'}</p>
    </div>
  )
}
```

### 监听容器焦点

```tsx
function FormContainer() {
  const { isFocusedWithin, focusProps } = useFocus()

  return (
    <div 
      {...focusProps}
      style={{
        padding: '20px',
        border: `2px solid ${isFocusedWithin ? 'blue' : 'gray'}`,
        borderRadius: '8px'
      }}
    >
      <h3>表单容器 {isFocusedWithin && '(活跃)'}</h3>
      <input placeholder="姓名" />
      <input placeholder="邮箱" />
      <textarea placeholder="备注" />
    </div>
  )
}
```

---

## useKeyPress

监听键盘按键事件。

### 语法

```tsx
const isPressed = useKeyPress(
  targetKey: KeyType | KeyType[],
  options?: UseKeyPressOptions
)

const isPressed = useKeyCombo(
  keys: string[],
  options?: UseKeyPressOptions
)
```

### 参数

- `targetKey` (KeyType | KeyType[]): 要监听的按键
- `keys` (string[]): 组合键数组
- `options` (UseKeyPressOptions, 可选): 配置选项

### UseKeyPressOptions

```tsx
interface UseKeyPressOptions {
  target?: RefObject<HTMLElement>  // 监听目标，默认为 window
  eventType?: 'keydown' | 'keyup' // 监听事件类型，默认为 'keydown'
  useKeyCombo?: boolean           // 是否使用组合键模式，默认为 false
}
```

### 返回值

- `isPressed` (boolean): 按键是否被按下

### 示例

```tsx
import { useKeyPress, useKeyCombo } from 'joy-at-meeting'

function KeyboardShortcuts() {
  const isEscPressed = useKeyPress('Escape')
  const isEnterPressed = useKeyPress('Enter')
  const isCtrlS = useKeyCombo(['Control', 's'])
  const isCtrlShiftP = useKeyCombo(['Control', 'Shift', 'p'])

  useEffect(() => {
    if (isEscPressed) {
      console.log('ESC 键被按下')
    }
  }, [isEscPressed])

  useEffect(() => {
    if (isCtrlS) {
      console.log('Ctrl+S 保存快捷键')
      // 阻止默认保存行为
      event?.preventDefault()
    }
  }, [isCtrlS])

  return (
    <div>
      <p>按键状态:</p>
      <ul>
        <li>ESC: {isEscPressed ? '按下' : '未按下'}</li>
        <li>Enter: {isEnterPressed ? '按下' : '未按下'}</li>
        <li>Ctrl+S: {isCtrlS ? '按下' : '未按下'}</li>
        <li>Ctrl+Shift+P: {isCtrlShiftP ? '按下' : '未按下'}</li>
      </ul>
    </div>
  )
}
```

### 游戏控制

```tsx
function GameControls() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  
  const isUpPressed = useKeyPress(['ArrowUp', 'w', 'W'])
  const isDownPressed = useKeyPress(['ArrowDown', 's', 'S'])
  const isLeftPressed = useKeyPress(['ArrowLeft', 'a', 'A'])
  const isRightPressed = useKeyPress(['ArrowRight', 'd', 'D'])
  const isSpacePressed = useKeyPress(' ')

  useEffect(() => {
    const speed = 5
    let newX = position.x
    let newY = position.y

    if (isUpPressed) newY -= speed
    if (isDownPressed) newY += speed
    if (isLeftPressed) newX -= speed
    if (isRightPressed) newX += speed

    if (newX !== position.x || newY !== position.y) {
      setPosition({ x: newX, y: newY })
    }
  }, [isUpPressed, isDownPressed, isLeftPressed, isRightPressed, position])

  return (
    <div style={{ position: 'relative', width: '400px', height: '300px', border: '1px solid #ccc' }}>
      <div 
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          width: '20px',
          height: '20px',
          backgroundColor: isSpacePressed ? 'red' : 'blue',
          borderRadius: '50%'
        }}
      />
      <p>使用 WASD 或方向键移动，空格键变色</p>
    </div>
  )
}
```

---

## useIntersectionObserver

监听元素与视口的交叉状态。

### 语法

```tsx
const { isIntersecting, entry } = useIntersectionObserver<T extends HTMLElement>(
  ref: RefObject<T>,
  options?: UseIntersectionObserverOptions
)
```

### UseIntersectionObserverOptions

```tsx
interface UseIntersectionObserverOptions {
  threshold?: number | number[]  // 触发阈值
  root?: Element | null         // 根元素
  rootMargin?: string          // 根边距
}
```

### 返回值

返回一个对象，包含：
- `isIntersecting` (boolean): 是否在视口中
- `entry` (IntersectionObserverEntry | null): 交叉观察器条目

### 示例

```tsx
import { useRef } from 'react'
import { useIntersectionObserver } from 'joy-at-meeting'

function LazyImage({ src, alt }: { src: string; alt: string }) {
  const imgRef = useRef<HTMLImageElement>(null)
  const { isIntersecting } = useIntersectionObserver(imgRef, {
    threshold: 0.1
  })

  return (
    <img 
      ref={imgRef}
      src={isIntersecting ? src : undefined}
      alt={alt}
      style={{
        width: '100%',
        height: '200px',
        backgroundColor: '#f0f0f0',
        objectFit: 'cover'
      }}
    />
  )
}
```

---

## useWindowSize

监听窗口尺寸变化。

### 语法

```tsx
const { width, height } = useWindowSize(options?: UseWindowSizeOptions)
```

### UseWindowSizeOptions

```tsx
interface UseWindowSizeOptions {
  wait?: number  // 防抖延迟时间（毫秒），默认为 100
}
```

### 返回值

返回一个对象，包含：
- `width` (number): 窗口宽度
- `height` (number): 窗口高度

### 示例

```tsx
import { useWindowSize } from 'joy-at-meeting'

function ResponsiveLayout() {
  const { width, height } = useWindowSize()
  
  const isMobile = width < 768
  const isTablet = width >= 768 && width < 1024

  return (
    <div>
      <h2>窗口尺寸: {width} x {height}</h2>
      <p>设备类型: {isMobile ? '手机' : isTablet ? '平板' : '桌面'}</p>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1fr 1fr 1fr',
        gap: '1rem'
      }}>
        <div>内容 1</div>
        <div>内容 2</div>
        <div>内容 3</div>
      </div>
    </div>
  )
}
```