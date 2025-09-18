# Utils Hooks

工具类 Hooks 提供了一系列实用的功能，帮助您处理常见的开发需求。

## usePrevious

获取上一次渲染时的值，常用于比较前后状态的变化。

### 基本用法

```tsx
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

### API 参考

```tsx
function usePrevious<T>(value: T): T | undefined;
```

**参数：**
- `value: T` - 需要追踪的当前值

**返回值：**
- `T | undefined` - 上一次渲染时的值，首次渲染时为 `undefined`

### 注意事项

- **首次渲染**：第一次渲染时返回 `undefined`，因为没有"上一次"的值
- **引用比较**：Hook 使用引用比较，对于对象和数组，只有引用改变时才会更新
- **性能考虑**：每次渲染都会保存当前值，对于大型对象要注意内存使用

### 最佳实践

1. **结合 useEffect 使用**：在 useEffect 中比较前后值
2. **类型安全**：使用 TypeScript 泛型确保类型安全
3. **避免深度比较**：对于复杂对象，考虑使用 JSON.stringify 或专门的深度比较库
4. **内存管理**：对于大型数据结构，注意及时清理不需要的引用