import { useRef, useEffect } from 'react';

/**
 * usePrevious - 获取上一次渲染值的React Hook
 * @param value - 当前值
 * @returns 上一次的值
 */
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

export { usePrevious };
