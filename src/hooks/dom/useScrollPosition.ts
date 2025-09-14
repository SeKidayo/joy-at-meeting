import { useState, useEffect, RefObject } from 'react';

/**
 * 滚动位置接口
 */
interface ScrollPosition {
  x: number;
  y: number;
}

/**
 * useScrollPosition Hook 配置选项
 */
interface UseScrollPositionOptions {
  element?: RefObject<HTMLElement>; // 要监听的元素，默认为 window
  useWindow?: boolean; // 是否监听 window 滚动，默认为 true
  wait?: number; // 节流延迟时间（毫秒），默认为 100
}

/**
 * useScrollPosition Hook
 * 监听页面或特定元素的滚动位置
 *
 * @param options - 配置选项
 * @returns 当前滚动位置 { x, y }
 */
function useScrollPosition(
  options: UseScrollPositionOptions = {}
): ScrollPosition {
  const { element, useWindow = true, wait = 100 } = options;

  const [position, setPosition] = useState<ScrollPosition>({ x: 0, y: 0 });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    /**
     * 获取滚动位置
     * @returns 滚动位置对象
     */
    const getScrollPosition = (): ScrollPosition => {
      if (useWindow) {
        return {
          x: window.pageXOffset || document.documentElement.scrollLeft,
          y: window.pageYOffset || document.documentElement.scrollTop,
        };
      }

      if (element?.current) {
        return {
          x: element.current.scrollLeft,
          y: element.current.scrollTop,
        };
      }

      return { x: 0, y: 0 };
    };

    /**
     * 处理滚动事件（带节流）
     */
    const handleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        setPosition(getScrollPosition());
      }, wait);
    };

    // 初始化位置
    setPosition(getScrollPosition());

    // 添加滚动事件监听器
    const target = useWindow ? window : element?.current;
    if (target) {
      target.addEventListener('scroll', handleScroll, { passive: true });
    }

    // 清理函数
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (target) {
        target.removeEventListener('scroll', handleScroll);
      }
    };
  }, [element, useWindow, wait]);

  return position;
}

export { useScrollPosition };
export type { ScrollPosition, UseScrollPositionOptions };
