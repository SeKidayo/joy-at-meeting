import { useState, useCallback } from 'react';

/**
 * useCounter Hook的返回类型
 */
export interface UseCounterReturn {
  /** 当前计数值 */
  count: number;
  /** 增加计数的函数 */
  increment: () => void;
  /** 减少计数的函数 */
  decrement: () => void;
  /** 重置计数的函数 */
  reset: () => void;
  /** 设置特定值的函数 */
  setCount: (value: number | ((prev: number) => number)) => void;
}

/**
 * useCounter - 管理计数器状态的React Hook
 * @param initialValue - 初始计数值，默认为0
 * @returns 包含计数值和操作函数的对象
 */
function useCounter(initialValue = 0): UseCounterReturn {
  const [count, setCount] = useState<number>(initialValue);

  // 增加计数
  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  // 减少计数
  const decrement = useCallback(() => {
    setCount(prev => prev - 1);
  }, []);

  // 重置计数
  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  return {
    count,
    increment,
    decrement,
    reset,
    setCount,
  };
}

export { useCounter };