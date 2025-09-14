import { useState, useEffect, useCallback } from 'react';

/**
 * useLocalStorage Hook的返回类型
 */
export interface UseLocalStorageReturn<T> {
  /** 当前存储的值 */
  value: T;
  /** 设置新值的函数 */
  setValue: (value: T | ((prevValue: T) => T)) => void;
  /** 移除存储值的函数 */
  removeValue: () => void;
}

/**
 * useLocalStorage - 管理localStorage的React Hook
 * @param key - localStorage的键名
 * @param initialValue - 初始值
 * @returns 包含当前值、设置值和移除值函数的对象
 */
function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  // 从localStorage读取初始值
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 设置值到localStorage和state
  const setStoredValue = useCallback(
    (newValue: T | ((prevValue: T) => T)) => {
      try {
        const valueToStore =
          newValue instanceof Function ? newValue(value) : newValue;
        setValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, value]
  );

  // 移除localStorage中的值
  const removeStoredValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // 监听localStorage变化（其他标签页的变化）
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(
            `Error parsing localStorage value for key "${key}":`,
            error
          );
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return {
    value,
    setValue: setStoredValue,
    removeValue: removeStoredValue,
  };
}

export { useLocalStorage };
