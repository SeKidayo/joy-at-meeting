import { defineConfig } from 'vitepress'

/**
 * VitePress 配置文件
 * 定义站点的基本信息、主题配置和导航结构
 */
export default defineConfig({
  title: '相见欢 - Joy At Meeting',
  description: 'A collection of elegant and useful React hooks',
  base: '/joy-at-meeting/',
  
  // 主题配置
  themeConfig: {
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/getting-started' },
      { text: 'API', link: '/api/state-hooks' },
      { text: 'GitHub', link: 'https://github.com/SeKidayo/joy-at-meeting' }
    ],

    // 侧边栏
    sidebar: {
      '/guide/': [
        {
          text: '开始使用',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '安装', link: '/guide/installation' },
            { text: '基本用法', link: '/guide/basic-usage' },
            { text: '代码预览', link: '/guide/code-preview' }
          ]
        },
        {
          text: '项目信息',
          items: [
            { text: '更新日志', link: '/guide/changelog' },
            { text: '贡献指南', link: '/guide/contributing' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'State Hooks',
          items: [
            { text: 'useLocalStorage', link: '/api/state-hooks#uselocalstorage' },
            { text: 'useToggle', link: '/api/state-hooks#usetoggle' },
            { text: 'useCounter', link: '/api/state-hooks#usecounter' },
            { text: 'usePrevious', link: '/api/state-hooks#useprevious' }
          ]
        },
        {
          text: 'DOM Hooks',
          items: [
            { text: 'useClickOutside', link: '/api/dom-hooks#useclickoutside' },
            { text: 'useScrollPosition', link: '/api/dom-hooks#usescrollposition' },
            { text: 'useElementSize', link: '/api/dom-hooks#useelementsize' },
            { text: 'useHover', link: '/api/dom-hooks#usehover' },
            { text: 'useFocus', link: '/api/dom-hooks#usefocus' },
            { text: 'useKeyPress', link: '/api/dom-hooks#usekeypress' },
            { text: 'useIntersectionObserver', link: '/api/dom-hooks#useintersectionobserver' },
            { text: 'useWindowSize', link: '/api/dom-hooks#usewindowsize' }
          ]
        },
        {
          text: 'Async Hooks',
          items: [
            { text: 'useAsync', link: '/api/async-hooks#useasync' },
            { text: 'useFetch', link: '/api/async-hooks#usefetch' }
          ]
        },
        {
          text: 'Performance Hooks',
          items: [
            { text: 'useDebounce', link: '/api/performance-hooks#usedebounce' },
            { text: 'useThrottle', link: '/api/performance-hooks#usethrottle' },
            { text: 'useMemoizedCallback', link: '/api/performance-hooks#usememoizedcallback' }
          ]
        },
        {
          text: 'Form Hooks',
          items: [
            { text: 'useForm', link: '/api/form-hooks#useform' },
            { text: 'useValidation', link: '/api/form-hooks#usevalidation' }
          ]
        }
      ]
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/SeKidayo/joy-at-meeting' }
    ],

    // 页脚
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Joy at Meeting'
    },

    // 搜索
    search: {
      provider: 'local'
    }
  },

  // Markdown 配置
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true
  }
})