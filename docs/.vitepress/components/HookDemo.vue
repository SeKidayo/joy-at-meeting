<template>
  <div class="hook-demo">
    <div class="demo-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.name"
        :class="{ active: activeTab === tab.name }"
        @click="activeTab = tab.name"
        class="tab-button"
      >
        {{ tab.label }}
      </button>
    </div>
    
    <div class="demo-content">
      <!-- 预览区域 -->
      <div v-if="activeTab === 'preview'" class="preview-area">
        <div class="demo-container">
          <h4>{{ title }}</h4>
          <slot name="demo" />
        </div>
      </div>
      
      <!-- 代码区域 -->
      <div v-else-if="activeTab === 'code'" class="code-area">
        <slot name="code" />
      </div>
      
      <!-- 说明区域 -->
      <div v-else-if="activeTab === 'description'" class="description-area">
        <slot name="description" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  title: {
    type: String,
    default: 'Hook 演示'
  }
})

const activeTab = ref('preview')
const tabs = [
  { name: 'preview', label: '🎯 预览' },
  { name: 'code', label: '💻 代码' },
  { name: 'description', label: '📝 说明' }
]
</script>

<style scoped>
.hook-demo {
  border: 1px solid hsl(var(--vp-c-border) / 0.2);
  border-radius: 8px;
  overflow: hidden;
  margin: 24px 0;
  background: hsl(var(--vp-c-bg));
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  transition: all 0.2s ease-in-out;
}

.hook-demo:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.demo-tabs {
  display: flex;
  background: hsl(var(--vp-c-bg-soft) / 0.5);
  border-bottom: 1px solid hsl(var(--vp-c-border) / 0.2);
  padding: 4px;
  gap: 2px;
}

.tab-button {
  padding: 8px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-size: 13px;
  font-weight: 500;
  color: hsl(var(--vp-c-text-2));
  border-radius: 6px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
}

.tab-button:hover {
  background: hsl(var(--vp-c-bg-elv) / 0.8);
  color: hsl(var(--vp-c-text-1));
  transform: translateY(-1px);
}

.tab-button.active {
  background: hsl(var(--vp-c-bg));
  color: hsl(var(--vp-c-brand-1));
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  border: 1px solid hsl(var(--vp-c-border) / 0.2);
}

.tab-button.active:hover {
  transform: none;
}

.demo-content {
  padding: 0;
}

.preview-area {
  padding: 24px;
  background: hsl(var(--vp-c-bg));
}

.demo-container {
  padding: 24px;
  border: 1px solid hsl(var(--vp-c-border) / 0.2);
  border-radius: 8px;
  background: hsl(var(--vp-c-bg-soft) / 0.3);
  backdrop-filter: blur(8px);
  transition: all 0.2s ease-in-out;
}

.demo-container:hover {
  border-color: hsl(var(--vp-c-border) / 0.3);
  background: hsl(var(--vp-c-bg-soft) / 0.5);
}

.demo-container h4 {
  margin: 0 0 16px 0;
  color: hsl(var(--vp-c-text-1));
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.025em;
}

.code-area {
  background: hsl(var(--vp-code-block-bg));
  border-radius: 0 0 8px 8px;
}

.description-area {
  padding: 24px;
  background: hsl(var(--vp-c-bg));
  color: hsl(var(--vp-c-text-1));
  line-height: 1.7;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hook-demo {
    margin: 16px 0;
  }
  
  .demo-tabs {
    flex-direction: column;
    gap: 1px;
    padding: 2px;
  }
  
  .tab-button {
    text-align: left;
    justify-content: flex-start;
    padding: 12px 16px;
    border-radius: 4px;
  }
  
  .tab-button.active {
    border: 1px solid hsl(var(--vp-c-border) / 0.2);
  }
  
  .preview-area,
  .description-area {
    padding: 16px;
  }
  
  .demo-container {
    padding: 16px;
  }
}

/* 深色模式适配 */
.dark .hook-demo {
  border-color: hsl(var(--vp-c-border) / 0.3);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3);
}

.dark .hook-demo:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3);
}

.dark .demo-container {
  background: hsl(var(--vp-c-bg-elv) / 0.5);
  border-color: hsl(var(--vp-c-border) / 0.3);
}

.dark .demo-container:hover {
  background: hsl(var(--vp-c-bg-elv) / 0.7);
  border-color: hsl(var(--vp-c-border) / 0.4);
}

.dark .tab-button.active {
  border-color: hsl(var(--vp-c-border) / 0.3);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3);
}
</style>