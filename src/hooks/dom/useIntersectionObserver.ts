import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Intersection Observer 配置选项
 */
export interface UseIntersectionObserverOptions {
  /** 根元素，默认为视口 */
  root?: Element | null;
  /** 根边距 */
  rootMargin?: string;
  /** 触发阈值 */
  threshold?: number | number[];
  /** 是否只触发一次 */
  triggerOnce?: boolean;
  /** 是否跳过初始检查 */
  skip?: boolean;
}

/**
 * useIntersectionObserver Hook的返回类型
 */
export interface UseIntersectionObserverReturn {
  /** 元素引用 */
  ref: (node: Element | null) => void;
  /** 交叉条目信息 */
  entry: IntersectionObserverEntry | null;
  /** 是否正在交叉 */
  isIntersecting: boolean;
  /** 交叉比例 */
  intersectionRatio: number;
}

/**
 * useIntersectionObserver - 监听元素与视口交叉状态的React Hook
 * @param options - Intersection Observer配置选项
 * @returns 包含元素引用和交叉状态的对象
 */
function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const {
    root = null,
    rootMargin = '0px',
    threshold = 0,
    triggerOnce = false,
    skip = false,
  } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [intersectionRatio, setIntersectionRatio] = useState(0);
  const elementRef = useRef<Element | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasTriggeredRef = useRef(false);

  // 设置元素引用的回调函数
  const setRef = useCallback(
    (node: Element | null) => {
      // 清理之前的观察器
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      elementRef.current = node;

      // 如果跳过或没有元素，直接返回
      if (skip || !node) {
        return;
      }

      // 如果只触发一次且已经触发过，直接返回
      if (triggerOnce && hasTriggeredRef.current) {
        return;
      }

      // 检查浏览器是否支持 IntersectionObserver
      if (!window.IntersectionObserver) {
        console.warn('IntersectionObserver is not supported in this browser');
        return;
      }

      // 创建新的观察器
      observerRef.current = new IntersectionObserver(
        entries => {
          const [observerEntry] = entries;

          setEntry(observerEntry);
          setIsIntersecting(observerEntry.isIntersecting);
          setIntersectionRatio(observerEntry.intersectionRatio);

          // 如果只触发一次且当前正在交叉，标记为已触发
          if (triggerOnce && observerEntry.isIntersecting) {
            hasTriggeredRef.current = true;
            // 停止观察
            if (observerRef.current) {
              observerRef.current.disconnect();
              observerRef.current = null;
            }
          }
        },
        {
          root,
          rootMargin,
          threshold,
        }
      );

      // 开始观察元素
      observerRef.current.observe(node);
    },
    [root, rootMargin, threshold, triggerOnce, skip]
  );

  // 组件卸载时清理观察器
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // 当skip状态改变时重新设置观察器
  useEffect(() => {
    if (elementRef.current) {
      setRef(elementRef.current);
    }
  }, [setRef]);

  return {
    ref: setRef,
    entry,
    isIntersecting,
    intersectionRatio,
  };
}

export { useIntersectionObserver };
