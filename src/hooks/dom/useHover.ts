import { useState, useEffect, RefObject } from 'react';

/**
 * useHover Hook 配置选项
 */
interface UseHoverOptions {
  mouseEnterDelayMS?: number; // 鼠标进入延迟时间（毫秒），默认为 0
  mouseLeaveDelayMS?: number; // 鼠标离开延迟时间（毫秒），默认为 0
}

/**
 * useHover Hook
 * 监听元素的鼠标悬停状态
 * 
 * @param ref - 要监听的元素引用
 * @param options - 配置选项
 * @returns 是否处于悬停状态
 */
function useHover<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  options: UseHoverOptions = {}
): boolean {
  const { mouseEnterDelayMS = 0, mouseLeaveDelayMS = 0 } = options;
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const element = ref.current;
    
    if (!element) {
      return;
    }

    let mouseEnterTimer: NodeJS.Timeout | null = null;
    let mouseLeaveTimer: NodeJS.Timeout | null = null;

    /**
     * 处理鼠标进入事件
     */
    const handleMouseEnter = () => {
      // 清除可能存在的离开定时器
      if (mouseLeaveTimer) {
        clearTimeout(mouseLeaveTimer);
        mouseLeaveTimer = null;
      }

      if (mouseEnterDelayMS > 0) {
        mouseEnterTimer = setTimeout(() => {
          setIsHovered(true);
        }, mouseEnterDelayMS);
      } else {
        setIsHovered(true);
      }
    };

    /**
     * 处理鼠标离开事件
     */
    const handleMouseLeave = () => {
      // 清除可能存在的进入定时器
      if (mouseEnterTimer) {
        clearTimeout(mouseEnterTimer);
        mouseEnterTimer = null;
      }

      if (mouseLeaveDelayMS > 0) {
        mouseLeaveTimer = setTimeout(() => {
          setIsHovered(false);
        }, mouseLeaveDelayMS);
      } else {
        setIsHovered(false);
      }
    };

    // 添加事件监听器
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    // 清理函数
    return () => {
      // 清除定时器
      if (mouseEnterTimer) {
        clearTimeout(mouseEnterTimer);
      }
      if (mouseLeaveTimer) {
        clearTimeout(mouseLeaveTimer);
      }

      // 移除事件监听器
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref, mouseEnterDelayMS, mouseLeaveDelayMS]);

  return isHovered;
}

export { useHover };
export type { UseHoverOptions };