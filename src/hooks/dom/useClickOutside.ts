import { useEffect, RefObject } from 'react';

/**
 * useClickOutside Hook
 * 检测元素外部的点击事件
 *
 * @param ref - 要监听的元素引用
 * @param handler - 点击外部时的回调函数
 * @param mouseEvent - 要监听的鼠标事件类型，默认为 'mousedown'
 * @param touchEvent - 要监听的触摸事件类型，默认为 'touchstart'
 */
function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: Event) => void,
  mouseEvent: keyof DocumentEventMap = 'mousedown',
  touchEvent: keyof DocumentEventMap = 'touchstart'
): void {
  useEffect(() => {
    /**
     * 处理点击事件
     * @param event - 事件对象
     */
    const handleClickOutside = (event: Event) => {
      const el = ref?.current;

      // 如果元素不存在或者点击的是元素内部，则不触发回调
      if (!el || el.contains(event.target as Node)) {
        return;
      }

      handler(event);
    };

    // 添加事件监听器
    document.addEventListener(mouseEvent, handleClickOutside);
    document.addEventListener(touchEvent, handleClickOutside);

    // 清理函数
    return () => {
      document.removeEventListener(mouseEvent, handleClickOutside);
      document.removeEventListener(touchEvent, handleClickOutside);
    };
  }, [ref, handler, mouseEvent, touchEvent]);
}

export { useClickOutside };
