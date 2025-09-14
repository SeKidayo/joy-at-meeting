import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import pkg from './package.json' with { type: 'json' };

/**
 * Rollup配置 - 用于构建React Hooks库
 * 支持CommonJS、ES Module和TypeScript声明文件输出
 */
const config = [
  // 主要构建配置
  {
    input: 'src/index.ts',
    external: ['react'],
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'named'
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true
      }
    ],
    plugins: [
      resolve({
        browser: true
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false
      })
    ]
  },
  // TypeScript声明文件配置
  {
    input: 'src/index.ts',
    output: {
      file: pkg.types,
      format: 'esm'
    },
    plugins: [dts()],
    external: ['react']
  }
];

export default config;