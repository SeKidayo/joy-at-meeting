# 贡献指南

感谢您对 `joy-at-meeting` 的关注！我们欢迎任何形式的贡献，包括但不限于：

- 🐛 报告 Bug
- 💡 提出新功能建议
- 📝 改进文档
- 🔧 提交代码修复
- ✨ 添加新的 hooks

## 开发环境设置

### 前置要求

- Node.js >= 16.0.0
- npm >= 7.0.0 或 yarn >= 1.22.0
- Git

### 克隆项目

```bash
# 克隆仓库
git clone https://github.com/your-username/joy-at-meeting.git
cd joy-at-meeting

# 安装依赖
npm install

# 或使用 yarn
yarn install
```

### 项目结构

```
joy-at-meeting/
├── src/                    # 源代码目录
│   ├── hooks/             # hooks 实现
│   │   ├── state/         # 状态管理 hooks
│   │   ├── dom/           # DOM 操作 hooks
│   │   ├── async/         # 异步处理 hooks
│   │   ├── performance/   # 性能优化 hooks
│   │   └── form/          # 表单处理 hooks
│   ├── types/             # TypeScript 类型定义
│   ├── utils/             # 工具函数
│   └── index.ts           # 主入口文件
├── docs/                  # 文档目录
│   ├── .vitepress/        # VitePress 配置
│   ├── guide/             # 使用指南
│   └── api/               # API 文档
├── tests/                 # 测试文件
├── examples/              # 示例代码
└── scripts/               # 构建脚本
```

### 开发脚本

```bash
# 开发模式（监听文件变化）
npm run dev

# 构建项目
npm run build

# 运行测试
npm run test

# 运行测试（监听模式）
npm run test:watch

# 类型检查
npm run type-check

# 代码格式化
npm run format

# 代码检查
npm run lint

# 启动文档开发服务器
npm run docs:dev

# 构建文档
npm run docs:build
```

## 贡献流程

### 1. 创建 Issue

在开始开发之前，请先创建一个 Issue 来描述您要解决的问题或添加的功能。这有助于：

- 避免重复工作
- 获得社区反馈
- 确保功能符合项目方向

### 2. Fork 和分支

```bash
# Fork 项目到您的 GitHub 账户
# 然后克隆您的 fork
git clone https://github.com/your-username/joy-at-meeting.git
cd joy-at-meeting

# 添加上游仓库
git remote add upstream https://github.com/original-owner/joy-at-meeting.git

# 创建功能分支
git checkout -b feature/your-feature-name
# 或者修复分支
git checkout -b fix/your-fix-name
```

### 3. 开发

#### 添加新的 Hook

如果您要添加新的 hook，请遵循以下步骤：

1. **在适当的目录下创建 hook 文件**

```typescript
// src/hooks/state/useYourHook.ts
import { useState, useEffect } from 'react'

/**
 * 您的 hook 描述
 * @param param1 参数1描述
 * @param param2 参数2描述
 * @returns 返回值描述
 */
export function useYourHook(param1: string, param2?: number) {
  const [state, setState] = useState()
  
  useEffect(() => {
    // hook 逻辑
  }, [param1, param2])
  
  return {
    // 返回的值
  }
}
```

2. **添加类型定义**

```typescript
// src/types/index.ts
export interface YourHookOptions {
  option1: string
  option2?: number
}

export interface YourHookReturn {
  value: any
  method: () => void
}
```

3. **在主入口文件中导出**

```typescript
// src/index.ts
export { useYourHook } from './hooks/state/useYourHook'
export type { YourHookOptions, YourHookReturn } from './types'
```

4. **编写测试**

```typescript
// tests/useYourHook.test.ts
import { renderHook, act } from '@testing-library/react'
import { useYourHook } from '../src/hooks/state/useYourHook'

describe('useYourHook', () => {
  it('should work correctly', () => {
    const { result } = renderHook(() => useYourHook('test'))
    
    expect(result.current).toBeDefined()
    // 更多测试...
  })
})
```

5. **添加文档**

在相应的 API 文档文件中添加您的 hook 文档。

#### 修复 Bug

1. 确保您理解问题
2. 编写测试来重现 bug
3. 修复代码
4. 确保测试通过
5. 更新相关文档

### 4. 测试

在提交之前，请确保：

```bash
# 所有测试通过
npm run test

# 类型检查通过
npm run type-check

# 代码格式正确
npm run lint

# 构建成功
npm run build
```

### 5. 提交

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
# 功能提交
git commit -m "feat: add useYourHook for state management"

# 修复提交
git commit -m "fix: resolve memory leak in useAsync"

# 文档提交
git commit -m "docs: update useForm examples"

# 测试提交
git commit -m "test: add tests for useDebounce"

# 重构提交
git commit -m "refactor: simplify useLocalStorage implementation"
```

提交类型：
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构（不是新功能也不是修复）
- `test`: 添加或修改测试
- `chore`: 构建过程或辅助工具的变动

### 6. 创建 Pull Request

```bash
# 推送分支
git push origin feature/your-feature-name
```

然后在 GitHub 上创建 Pull Request，请确保：

- 标题清晰描述变更
- 详细描述变更内容和原因
- 关联相关的 Issue
- 添加适当的标签

#### Pull Request 模板

```markdown
## 变更类型
- [ ] Bug 修复
- [ ] 新功能
- [ ] 文档更新
- [ ] 性能优化
- [ ] 重构

## 描述
简要描述此 PR 的变更内容。

## 相关 Issue
关闭 #(issue 编号)

## 变更详情
- 添加了 useYourHook
- 修复了 useAsync 的内存泄漏问题
- 更新了相关文档

## 测试
- [ ] 添加了新的测试
- [ ] 所有现有测试通过
- [ ] 手动测试通过

## 检查清单
- [ ] 代码遵循项目规范
- [ ] 自我审查了代码
- [ ] 添加了必要的注释
- [ ] 更新了相关文档
- [ ] 没有引入新的警告
```

## 代码规范

### TypeScript

- 使用严格的 TypeScript 配置
- 为所有公共 API 提供类型定义
- 避免使用 `any` 类型
- 使用有意义的变量和函数名

### React Hooks

- 遵循 [React Hooks 规则](https://reactjs.org/docs/hooks-rules.html)
- 使用 `useCallback` 和 `useMemo` 优化性能
- 正确处理依赖数组
- 清理副作用（事件监听器、定时器等）

### 代码风格

我们使用 ESLint 和 Prettier 来保持代码风格一致：

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    '@typescript-eslint/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    // 自定义规则
  }
}
```

### 注释规范

```typescript
/**
 * Hook 的简要描述
 * 
 * @param param1 - 参数1的描述
 * @param param2 - 参数2的描述（可选）
 * @returns 返回值的描述
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { value, setValue } = useYourHook('initial')
 *   return <div>{value}</div>
 * }
 * ```
 */
export function useYourHook(param1: string, param2?: number) {
  // 实现
}
```

## 测试指南

### 测试框架

我们使用以下测试工具：

- **Jest**: 测试运行器
- **@testing-library/react**: React 组件测试
- **@testing-library/react-hooks**: React Hooks 测试

### 测试结构

```typescript
import { renderHook, act } from '@testing-library/react'
import { useYourHook } from '../src/hooks/useYourHook'

describe('useYourHook', () => {
  it('should initialize with correct default value', () => {
    const { result } = renderHook(() => useYourHook('initial'))
    
    expect(result.current.value).toBe('initial')
  })
  
  it('should update value correctly', () => {
    const { result } = renderHook(() => useYourHook('initial'))
    
    act(() => {
      result.current.setValue('updated')
    })
    
    expect(result.current.value).toBe('updated')
  })
  
  it('should handle edge cases', () => {
    // 边界情况测试
  })
  
  it('should cleanup properly', () => {
    // 清理测试
  })
})
```

### 测试覆盖率

我们要求测试覆盖率达到 90% 以上。运行以下命令查看覆盖率：

```bash
npm run test:coverage
```

## 文档规范

### API 文档

每个 hook 都应该有完整的 API 文档，包括：

- 简要描述
- 语法示例
- 参数说明
- 返回值说明
- 使用示例
- 注意事项

### 示例代码

- 提供实际可运行的示例
- 涵盖常见使用场景
- 包含错误处理
- 展示最佳实践

## 发布流程

项目维护者会处理版本发布，但贡献者需要了解：

### 版本规范

我们遵循 [Semantic Versioning](https://semver.org/)：

- `MAJOR`: 不兼容的 API 变更
- `MINOR`: 向后兼容的功能性新增
- `PATCH`: 向后兼容的问题修正

### 变更日志

所有重要变更都会记录在 `CHANGELOG.md` 中。

## 社区

### 行为准则

我们致力于为所有人提供友好、安全和包容的环境。请遵守以下基本准则：

- 尊重他人，保持友善和专业的态度
- 欢迎不同背景和经验水平的贡献者
- 建设性地提供反馈和建议
- 专注于对项目最有利的事情
- 对社区其他成员表现出同理心

### 获取帮助

如果您需要帮助，可以：

- 查看现有的 [Issues](https://github.com/your-username/joy-at-meeting/issues)
- 创建新的 Issue
- 参与 [Discussions](https://github.com/your-username/joy-at-meeting/discussions)

### 联系方式

- GitHub Issues: 报告 bug 和功能请求
- GitHub Discussions: 一般讨论和问题
- Email: maintainer@example.com

## 常见问题

### Q: 我应该如何选择 hook 的分类？

A: 根据 hook 的主要功能：
- `state`: 状态管理相关
- `dom`: DOM 操作相关
- `async`: 异步处理相关
- `performance`: 性能优化相关
- `form`: 表单处理相关

### Q: 如何处理浏览器兼容性？

A: 我们支持现代浏览器（ES2018+）。如果需要特殊的兼容性处理，请在代码中添加注释说明。

### Q: 可以添加依赖第三方库的 hook 吗？

A: 原则上我们希望保持库的轻量性，但如果第三方库能显著提升功能价值，可以讨论。请在 Issue 中详细说明理由。

### Q: 如何确保 hook 的性能？

A: 
- 正确使用 `useCallback` 和 `useMemo`
- 避免不必要的重新渲染
- 及时清理副作用
- 编写性能测试

---

感谢您的贡献！每一个贡献都让 `joy-at-meeting` 变得更好。 🎉