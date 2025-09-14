import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * 异步操作的状态类型
 */
export type AsyncStatus = 'idle' | 'pending' | 'success' | 'error';

/**
 * useAsync Hook的返回类型
 */
export interface UseAsyncReturn<T> {
  /** 异步操作的数据 */
  data: T | null;
  /** 错误信息 */
  error: Error | null;
  /** 当前状态 */
  status: AsyncStatus;
  /** 是否正在加载 */
  isLoading: boolean;
  /** 是否成功 */
  isSuccess: boolean;
  /** 是否出错 */
  isError: boolean;
  /** 执行异步操作 */
  execute: (...args: any[]) => Promise<T>;
  /** 重置状态 */
  reset: () => void;
}

/**
 * useAsync - 管理异步操作状态的React Hook
 * @param asyncFunction - 异步函数
 * @param immediate - 是否立即执行，默认为false
 * @returns 包含异步操作状态和控制函数的对象
 */
function useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  immediate = false
): UseAsyncReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const mountedRef = useRef(true);

  // 执行异步操作
  const execute = useCallback(
    async (...args: any[]): Promise<T> => {
      setStatus('pending');
      setError(null);

      try {
        const result = await asyncFunction(...args);
        
        // 检查组件是否仍然挂载
        if (mountedRef.current) {
          setData(result);
          setStatus('success');
        }
        
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        
        // 检查组件是否仍然挂载
        if (mountedRef.current) {
          setError(error);
          setStatus('error');
        }
        
        throw error;
      }
    },
    [asyncFunction]
  );

  // 重置状态
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setStatus('idle');
  }, []);

  // 组件卸载时标记为未挂载
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // 立即执行
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    data,
    error,
    status,
    isLoading: status === 'pending',
    isSuccess: status === 'success',
    isError: status === 'error',
    execute,
    reset,
  };
}

export { useAsync };