import { useState, useEffect } from 'react';

/**
 * 窗口尺寸类型
 */
export interface WindowSize {
  /** 窗口宽度 */
  width: number;
  /** 窗口高度 */
  height: number;
}

/**
 * useWindowSize Hook的配置选项
 */
export interface UseWindowSizeOptions {
  /** 防抖延迟时间（毫秒），默认为100 */
  debounceMs?: number;
  /** 初始尺寸，用于SSR */
  initialSize?: WindowSize;
}

/**
 * 获取当前窗口尺寸
 * @returns 窗口尺寸对象
 */
function getWindowSize(): WindowSize {
  // 检查是否在浏览器环境中
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

/**
 * 创建防抖函数
 * @param func - 要防抖的函数
 * @param delay - 延迟时间
 * @returns 防抖后的函数
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * useWindowSize - 监听窗口尺寸变化的React Hook
 * @param options - 配置选项
 * @returns 当前窗口尺寸
 */
function useWindowSize(options: UseWindowSizeOptions = {}): WindowSize {
  const {
    debounceMs = 100,
    initialSize = { width: 0, height: 0 },
  } = options;

  // 初始化状态
  const [windowSize, setWindowSize] = useState<WindowSize>(() => {
    // 如果在浏览器环境中，获取实际窗口尺寸
    if (typeof window !== 'undefined') {
      return getWindowSize();
    }
    // 否则使用初始尺寸（用于SSR）
    return initialSize;
  });

  useEffect(() => {
    // 检查是否在浏览器环境中
    if (typeof window === 'undefined') {
      return;
    }

    // 更新窗口尺寸的函数
    const updateSize = () => {
      const newSize = getWindowSize();
      setWindowSize(prevSize => {
        // 只有当尺寸真正改变时才更新状态
        if (prevSize.width !== newSize.width || prevSize.height !== newSize.height) {
          return newSize;
        }
        return prevSize;
      });
    };

    // 创建防抖的更新函数
    const debouncedUpdateSize = debounce(updateSize, debounceMs);

    // 立即更新一次尺寸（处理初始化时的差异）
    updateSize();

    // 添加事件监听器
    window.addEventListener('resize', debouncedUpdateSize);
    
    // 也监听orientationchange事件（移动设备旋转）
    window.addEventListener('orientationchange', debouncedUpdateSize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', debouncedUpdateSize);
      window.removeEventListener('orientationchange', debouncedUpdateSize);
    };
  }, [debounceMs]);

  return windowSize;
}

export { useWindowSize };