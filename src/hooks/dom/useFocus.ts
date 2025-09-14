import { useState, useEffect, RefObject } from 'react';

/**
 * useFocus Hook 配置选项
 */
interface UseFocusOptions {
  detectFocusWithin?: boolean; // 是否检测元素内部的焦点，默认为 false
}

/**
 * 焦点状态接口
 */
interface FocusState {
  isFocused: boolean; // 元素是否获得焦点
  isFocusWithin: boolean; // 元素内部是否有焦点（当 detectFocusWithin 为 true 时有效）
}

/**
 * useFocus Hook
 * 监听元素的焦点状态
 * 
 * @param ref - 要监听的元素引用
 * @param options - 配置选项
 * @returns 焦点状态对象
 */
function useFocus<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  options: UseFocusOptions = {}
): FocusState {
  const { detectFocusWithin = false } = options;
  const [focusState, setFocusState] = useState<FocusState>({
    isFocused: false,
    isFocusWithin: false,
  });

  useEffect(() => {
    const element = ref.current;
    
    if (!element) {
      return;
    }

    /**
     * 检查元素内部是否有焦点
     * @param element - 要检查的元素
     * @returns 是否有焦点在元素内部
     */
    const checkFocusWithin = (element: HTMLElement): boolean => {
      if (!detectFocusWithin) return false;
      return element.contains(document.activeElement);
    };

    /**
     * 处理焦点进入事件
     */
    const handleFocus = () => {
      setFocusState({
        isFocused: true,
        isFocusWithin: checkFocusWithin(element),
      });
    };

    /**
     * 处理焦点离开事件
     */
    const handleBlur = () => {
      // 使用 setTimeout 确保在焦点转移完成后再检查
      setTimeout(() => {
        const isFocusWithin = checkFocusWithin(element);
        setFocusState({
          isFocused: false,
          isFocusWithin,
        });
      }, 0);
    };

    /**
     * 处理全局焦点变化（用于 focusWithin 检测）
     */
    const handleGlobalFocusChange = () => {
      if (!detectFocusWithin) return;
      
      const isFocusWithin = checkFocusWithin(element);
      const isFocused = document.activeElement === element;
      
      setFocusState({
        isFocused,
        isFocusWithin,
      });
    };

    // 添加事件监听器
    element.addEventListener('focus', handleFocus);
    element.addEventListener('blur', handleBlur);

    // 如果需要检测 focusWithin，添加全局监听
    if (detectFocusWithin) {
      document.addEventListener('focusin', handleGlobalFocusChange);
      document.addEventListener('focusout', handleGlobalFocusChange);
    }

    // 初始化状态
    const initialIsFocused = document.activeElement === element;
    const initialIsFocusWithin = checkFocusWithin(element);
    setFocusState({
      isFocused: initialIsFocused,
      isFocusWithin: initialIsFocusWithin,
    });

    // 清理函数
    return () => {
      element.removeEventListener('focus', handleFocus);
      element.removeEventListener('blur', handleBlur);
      
      if (detectFocusWithin) {
        document.removeEventListener('focusin', handleGlobalFocusChange);
        document.removeEventListener('focusout', handleGlobalFocusChange);
      }
    };
  }, [ref, detectFocusWithin]);

  return focusState;
}

export { useFocus };
export type { UseFocusOptions, FocusState };