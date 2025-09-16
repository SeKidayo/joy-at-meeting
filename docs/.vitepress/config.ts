import { defineConfig } from 'vitepress';

/**
 * VitePress 配置文件
 * 定义站点的基本信息、主题配置和导航结构
 */
export default defineConfig({
  title: 'Joy At Meeting',
  description: '一个强大且易用的 React Hooks 工具库',
  base: '/joy-at-meeting/',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'zh-CN' }],
    ['meta', { name: 'og:site_name', content: 'Joy At Meeting' }],
    ['meta', { name: 'og:image', content: '/og-image.png' }],
  ],

  // 主题配置
  themeConfig: {
    logo: '/logo.svg',

    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      {
        text: '指南',
        items: [
          { text: '快速开始', link: '/guide/getting-started' },
          { text: '安装', link: '/guide/installation' },
          { text: '基础用法', link: '/guide/basic-usage' },
          { text: '最佳实践', link: '/guide/best-practices' },
          { text: '高级用法', link: '/guide/advanced-usage' },
        ],
      },
      {
        text: 'API',
        items: [
          { text: '状态管理', link: '/api/state-hooks' },
          { text: 'DOM 操作', link: '/api/dom-hooks' },
          { text: '异步处理', link: '/api/async-hooks' },
          { text: '性能优化', link: '/api/performance-hooks' },
          { text: '表单处理', link: '/api/form-hooks' },
        ],
      },
    ],

    // 侧边栏
    sidebar: {
      '/guide/': [
        {
          text: '开始使用',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '安装指南', link: '/guide/installation' },
            { text: '基础用法', link: '/guide/basic-usage' },
            { text: '代码预览', link: '/guide/code-preview' },
          ],
        },
        {
          text: '深入学习',
          items: [
            { text: '最佳实践', link: '/guide/best-practices' },
            { text: '高级用法', link: '/guide/advanced-usage' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'State Hooks',
          items: [
            {
              text: 'useLocalStorage',
              link: '/api/state-hooks#uselocalstorage',
            },
            { text: 'useToggle', link: '/api/state-hooks#usetoggle' },
            { text: 'useCounter', link: '/api/state-hooks#usecounter' },
            { text: 'usePrevious', link: '/api/state-hooks#useprevious' },
          ],
        },
        {
          text: 'DOM Hooks',
          items: [
            { text: 'useClickOutside', link: '/api/dom-hooks#useclickoutside' },
            {
              text: 'useScrollPosition',
              link: '/api/dom-hooks#usescrollposition',
            },
            { text: 'useElementSize', link: '/api/dom-hooks#useelementsize' },
            { text: 'useHover', link: '/api/dom-hooks#usehover' },
            { text: 'useFocus', link: '/api/dom-hooks#usefocus' },
            { text: 'useKeyPress', link: '/api/dom-hooks#usekeypress' },
            {
              text: 'useIntersectionObserver',
              link: '/api/dom-hooks#useintersectionobserver',
            },
            { text: 'useWindowSize', link: '/api/dom-hooks#usewindowsize' },
          ],
        },
        {
          text: 'Async Hooks',
          items: [
            { text: 'useAsync', link: '/api/async-hooks#useasync' },
            { text: 'useFetch', link: '/api/async-hooks#usefetch' },
          ],
        },
        {
          text: 'Performance Hooks',
          items: [
            { text: 'useDebounce', link: '/api/performance-hooks#usedebounce' },
            { text: 'useThrottle', link: '/api/performance-hooks#usethrottle' },
            {
              text: 'useMemoizedCallback',
              link: '/api/performance-hooks#usememoizedcallback',
            },
          ],
        },
        {
          text: 'Form Hooks',
          items: [
            { text: 'useForm', link: '/api/form-hooks#useform' },
            { text: 'useValidation', link: '/api/form-hooks#usevalidation' },
          ],
        },
      ],
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/SeKidayo/joy-at-meeting' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/joy-at-meeting' },
    ],

    // 页脚
    footer: {
      message: '基于 MIT 许可证发布',
      copyright: 'Copyright © 2024 Joy At Meeting',
    },

    editLink: {
      pattern:
        'https://github.com/SeKidayo/joy-at-meeting/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面',
    },

    // 搜索
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                },
              },
            },
          },
        },
      },
    },
  },

  // Markdown 配置
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    lineNumbers: true,
  },
});
