import { useState, useEffect, RefObject } from 'react';

/**
 * 元素尺寸接口
 */
interface ElementSize {
  width: number;
  height: number;
}

/**
 * useElementSize Hook
 * 监听元素尺寸变化，使用 ResizeObserver API
 *
 * @param ref - 要监听的元素引用
 * @returns 元素的当前尺寸 { width, height }
 */
function useElementSize<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>
): ElementSize {
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    /**
     * 获取元素尺寸
     * @param element - DOM 元素
     * @returns 元素尺寸对象
     */
    const getElementSize = (element: HTMLElement): ElementSize => {
      const rect = element.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
      };
    };

    // 初始化尺寸
    setSize(getElementSize(element));

    // 检查是否支持 ResizeObserver
    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          setSize({ width, height });
        }
      });

      resizeObserver.observe(element);

      // 清理函数
      return () => {
        resizeObserver.unobserve(element);
        resizeObserver.disconnect();
      };
    } else {
      // ResizeObserver 不支持时的降级方案
      const handleResize = () => {
        setSize(getElementSize(element));
      };

      window.addEventListener('resize', handleResize);

      // 清理函数
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [ref]);

  return size;
}

export { useElementSize };
export type { ElementSize };
