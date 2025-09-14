import { useCallback, useRef } from 'react';

/**
 * useMemoizedCallback - 创建一个稳定的回调函数引用的React Hook
 *
 * 与useCallback不同，这个Hook返回的函数引用永远不会改变，
 * 但内部会始终调用最新的回调函数。这对于避免子组件不必要的重渲染非常有用。
 *
 * @param callback - 要缓存的回调函数
 * @returns 稳定的回调函数引用
 */
function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T
): T {
  // 使用ref存储最新的回调函数
  const callbackRef = useRef<T>(callback);

  // 每次渲染时更新ref中的回调函数
  callbackRef.current = callback;

  // 使用useCallback创建一个稳定的函数引用
  // 这个函数的引用永远不会改变，但会调用最新的回调
  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args);
  }, []) as unknown as T;
}

export { useMemoizedCallback };
