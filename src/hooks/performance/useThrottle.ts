import { useState, useEffect, useRef } from 'react';

/**
 * useThrottle Hook的配置选项
 */
export interface UseThrottleOptions {
  /** 是否在第一次调用时立即执行，默认为true */
  leading?: boolean;
  /** 是否在最后一次调用后延迟执行，默认为true */
  trailing?: boolean;
}

/**
 * useThrottle - 节流值变化的React Hook
 * @param value - 要节流的值
 * @param delay - 节流延迟时间（毫秒）
 * @param options - 配置选项
 * @returns 节流后的值
 */
function useThrottle<T>(
  value: T,
  delay: number,
  options: UseThrottleOptions = {}
): T {
  const { leading = true, trailing = true } = options;
  
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecutedRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastValueRef = useRef<T>(value);
  const mountedRef = useRef<boolean>(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    lastValueRef.current = value;
    
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecutedRef.current;

    const updateValue = () => {
      if (mountedRef.current) {
        setThrottledValue(lastValueRef.current);
        lastExecutedRef.current = Date.now();
      }
    };

    // 如果是第一次执行且允许leading
    if (lastExecutedRef.current === 0 && leading) {
      updateValue();
      return;
    }

    // 如果距离上次执行的时间大于等于延迟时间
    if (timeSinceLastExecution >= delay) {
      if (leading) {
        updateValue();
      } else if (trailing) {
        // 如果不允许leading但允许trailing，设置延迟执行
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(updateValue, delay);
      }
    } else if (trailing) {
      // 如果还没到执行时间但允许trailing，设置剩余时间后执行
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      const remainingTime = delay - timeSinceLastExecution;
      timeoutRef.current = setTimeout(updateValue, remainingTime);
    }

    // 清理函数
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [value, delay, leading, trailing]);

  return throttledValue;
}

/**
 * useThrottledCallback - 节流回调函数的React Hook
 * @param callback - 要节流的回调函数
 * @param delay - 节流延迟时间（毫秒）
 * @param options - 配置选项
 * @returns 节流后的回调函数
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options: UseThrottleOptions = {}
): T {
  const { leading = true, trailing = true } = options;
  
  const lastExecutedRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const argsRef = useRef<Parameters<T>>();
  const callbackRef = useRef<T>(callback);

  // 更新回调函数引用
  callbackRef.current = callback;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const throttledCallback = useRef<T>(
    ((...args: Parameters<T>) => {
      argsRef.current = args;
      const now = Date.now();
      const timeSinceLastExecution = now - lastExecutedRef.current;

      const executeCallback = () => {
        lastExecutedRef.current = Date.now();
        return callbackRef.current(...(argsRef.current as Parameters<T>));
      };

      // 如果是第一次执行且允许leading
      if (lastExecutedRef.current === 0 && leading) {
        return executeCallback();
      }

      // 如果距离上次执行的时间大于等于延迟时间
      if (timeSinceLastExecution >= delay) {
        if (leading) {
          return executeCallback();
        } else if (trailing) {
          // 如果不允许leading但允许trailing，设置延迟执行
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(executeCallback, delay);
        }
      } else if (trailing) {
        // 如果还没到执行时间但允许trailing，设置剩余时间后执行
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        const remainingTime = delay - timeSinceLastExecution;
        timeoutRef.current = setTimeout(executeCallback, remainingTime);
      }
    }) as T
  ).current;

  return throttledCallback;
}

export { useThrottle };