# Utils Hooks

工具类 Hooks 提供了一些通用的实用功能，帮助你更好地管理组件状态和数据。

## usePrevious

获取上一次渲染时的值，常用于比较前后状态变化。

### 基本用法

```typescript
import { usePrevious } from 'joy-at-meeting';

function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>当前值: {count}</p>
      <p>上一次的值: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>
        增加
      </button>
    </div>
  );
}
```

### 高级用法

#### 比较对象变化

```typescript
import { usePrevious } from 'joy-at-meeting';

interface User {
  id: number;
  name: string;
  email: string;
}

function UserProfile({ user }: { user: User }) {
  const prevUser = usePrevious(user);

  useEffect(() => {
    if (prevUser && prevUser.id !== user.id) {
      console.log('用户已切换:', prevUser.name, '->', user.name);
    }
  }, [user, prevUser]);

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      {prevUser && prevUser.id !== user.id && (
        <p>从 {prevUser.name} 切换而来</p>
      )}
    </div>
  );
}
```

#### 监听数组变化

```typescript
import { usePrevious } from 'joy-at-meeting';

function TodoList({ todos }: { todos: string[] }) {
  const prevTodos = usePrevious(todos);

  useEffect(() => {
    if (prevTodos && prevTodos.length !== todos.length) {
      const added = todos.length - prevTodos.length;
      if (added > 0) {
        console.log(`新增了 ${added} 个待办事项`);
      } else {
        console.log(`删除了 ${Math.abs(added)} 个待办事项`);
      }
    }
  }, [todos, prevTodos]);

  return (
    <ul>
      {todos.map((todo, index) => (
        <li key={index}>{todo}</li>
      ))}
    </ul>
  );
}
```

#### 表单字段变化追踪

```typescript
import { usePrevious } from 'joy-at-meeting';

function FormField({ value, onChange }: { 
  value: string; 
  onChange: (value: string) => void; 
}) {
  const prevValue = usePrevious(value);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (prevValue !== undefined && prevValue !== value) {
      setHasChanged(true);
      // 3秒后重置变化状态
      const timer = setTimeout(() => setHasChanged(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);

  return (
    <div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          borderColor: hasChanged ? '#ff6b6b' : '#ddd',
          transition: 'border-color 0.3s'
        }}
      />
      {hasChanged && (
        <span style={{ color: '#ff6b6b', fontSize: '12px' }}>
          字段已修改
        </span>
      )}
    </div>
  );
}
```

### API 参考

#### 参数

| 参数 | 类型 | 描述 |
|------|------|------|
| `value` | `T` | 需要追踪的当前值 |

#### 返回值

| 类型 | 描述 |
|------|------|
| `T \| undefined` | 上一次渲染时的值，首次渲染时为 `undefined` |

### 类型定义

```typescript
function usePrevious<T>(value: T): T | undefined;
```

### 注意事项

1. **首次渲染**：第一次渲染时返回 `undefined`，因为没有"上一次"的值
2. **引用比较**：Hook 使用引用比较，对于对象和数组，只有引用改变时才会更新
3. **性能考虑**：每次渲染都会保存当前值，对于大型对象要注意内存使用

### 实际应用场景

- **动画触发**：比较前后状态决定是否播放动画
- **数据变化监听**：监听 props 或 state 的变化
- **表单验证**：比较表单字段的前后值
- **性能优化**：避免不必要的副作用执行
- **用户体验**：显示数据变化的提示信息

### 最佳实践

1. **结合 useEffect 使用**：在 useEffect 中比较前后值
2. **类型安全**：使用 TypeScript 泛型确保类型安全
3. **避免深度比较**：对于复杂对象，考虑使用 JSON.stringify 或专门的深度比较库
4. **内存管理**：对于大型数据结构，注意及时清理不需要的引用

```typescript
// 推荐的使用模式
function MyComponent({ data }: { data: ComplexData }) {
  const prevData = usePrevious(data);
  
  useEffect(() => {
    // 只在数据真正变化时执行副作用
    if (prevData && JSON.stringify(prevData) !== JSON.stringify(data)) {
      // 执行相关逻辑
      handleDataChange(prevData, data);
    }
  }, [data, prevData]);
  
  return <div>{/* 组件内容 */}</div>;
}
```