import { useState, useCallback } from 'react';

/**
 * useToggle Hook的返回类型
 */
export interface UseToggleReturn {
  /** 当前布尔值 */
  value: boolean;
  /** 切换值的函数 */
  toggle: () => void;
  /** 设置为true的函数 */
  setTrue: () => void;
  /** 设置为false的函数 */
  setFalse: () => void;
  /** 设置特定值的函数 */
  setValue: (value: boolean) => void;
}

/**
 * useToggle - 管理布尔状态的React Hook
 * @param initialValue - 初始布尔值，默认为false
 * @returns 包含当前值和操作函数的对象
 */
function useToggle(initialValue = false): UseToggleReturn {
  const [value, setValue] = useState<boolean>(initialValue);

  // 切换值
  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  // 设置为true
  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  // 设置为false
  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  // 设置特定值
  const setSpecificValue = useCallback((newValue: boolean) => {
    setValue(newValue);
  }, []);

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    setValue: setSpecificValue,
  };
}

export { useToggle };