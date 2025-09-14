# 安装

## 环境要求

- **React**: >= 16.8.0 (支持 Hooks)
- **TypeScript**: >= 4.0 (可选，但推荐)
- **Node.js**: >= 14.0

## 包管理器安装

### npm

```bash
npm install joy-at-meeting
```

### yarn

```bash
yarn add joy-at-meeting
```

### pnpm

```bash
pnpm add joy-at-meeting
```

## CDN 引入

如果你不使用构建工具，也可以通过 CDN 直接引入：

```html
<!-- 开发版本 -->
<script src="https://unpkg.com/joy-at-meeting@latest/dist/index.js"></script>

<!-- 生产版本（压缩） -->
<script src="https://unpkg.com/joy-at-meeting@latest/dist/index.min.js"></script>
```

## 验证安装

安装完成后，你可以创建一个简单的组件来验证是否正常工作：

```tsx
import React from 'react'
import { useToggle } from 'joy-at-meeting'

function TestComponent() {
  const [isOn, toggle] = useToggle(false)

  return (
    <div>
      <p>状态: {isOn ? '开启' : '关闭'}</p>
      <button onClick={toggle}>切换</button>
    </div>
  )
}

export default TestComponent
```

如果组件正常渲染并且按钮可以切换状态，说明安装成功！

## TypeScript 配置

如果你使用 TypeScript，确保你的 `tsconfig.json` 包含以下配置：

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  }
}
```

## 构建工具配置

### Webpack

如果你使用 Webpack，确保配置支持 ES6 模块：

```javascript
module.exports = {
  // ... 其他配置
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  }
}
```

### Vite

Vite 开箱即用支持 TypeScript 和 React：

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()]
})
```

### Create React App

Create React App 无需额外配置，直接安装使用即可。

## 按需导入配置

为了获得最佳的 Tree Shaking 效果，建议使用按需导入：

```tsx
// ✅ 推荐：按需导入
import { useLocalStorage, useToggle } from 'joy-at-meeting'

// ❌ 不推荐：全量导入
import * as JoyHooks from 'joy-at-meeting'
```

## Babel 配置（可选）

如果你需要支持较老的浏览器，可以配置 Babel：

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "browsers": ["> 1%", "last 2 versions"]
      }
    }],
    "@babel/preset-react",
    "@babel/preset-typescript"
  ]
}
```

## 常见问题

### Q: 安装后提示找不到模块？

A: 请检查：
1. 是否正确安装了依赖
2. 导入路径是否正确
3. TypeScript 配置是否正确

### Q: 类型定义不生效？

A: 确保：
1. 使用 TypeScript >= 4.0
2. 正确配置了 `tsconfig.json`
3. IDE 支持 TypeScript

### Q: 打包体积过大？

A: 建议：
1. 使用按需导入
2. 确保构建工具支持 Tree Shaking
3. 检查是否有重复依赖

## 下一步

安装完成后，你可以：

- 查看 [基本用法](/guide/basic-usage) 了解如何使用
- 浏览 [API 文档](/api/state-hooks) 查看所有可用的 hooks
- 查看 [GitHub 仓库](https://github.com/SeKidayo/joy-at-meeting) 获取更多信息