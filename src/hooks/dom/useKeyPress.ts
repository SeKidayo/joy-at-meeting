import { useState, useEffect, useCallback } from 'react';

/**
 * 按键类型
 */
type KeyType = string | string[];

/**
 * useKeyPress Hook 配置选项
 */
interface UseKeyPressOptions {
  event?: 'keydown' | 'keyup'; // 监听的事件类型，默认为 'keydown'
  target?: EventTarget | null; // 监听的目标元素，默认为 document
  exactMatch?: boolean; // 是否精确匹配（考虑修饰键），默认为 false
}

/**
 * useKeyPress Hook
 * 监听键盘按键事件
 * 
 * @param targetKey - 要监听的按键或按键数组
 * @param options - 配置选项
 * @returns 按键是否被按下
 */
function useKeyPress(
  targetKey: KeyType,
  options: UseKeyPressOptions = {}
): boolean {
  const { event = 'keydown', target = null, exactMatch = false } = options;
  const [isPressed, setIsPressed] = useState(false);

  /**
   * 检查按键是否匹配
   * @param pressedKey - 按下的按键
   * @param targetKeys - 目标按键数组
   * @returns 是否匹配
   */
  const isKeyMatch = useCallback(
    (pressedKey: string, targetKeys: string[]): boolean => {
      return targetKeys.some(key => {
        if (exactMatch) {
          return key === pressedKey;
        }
        return key.toLowerCase() === pressedKey.toLowerCase();
      });
    },
    [exactMatch]
  );

  useEffect(() => {
    const targetKeys = Array.isArray(targetKey) ? targetKey : [targetKey];
    const eventTarget = target || document;

    /**
     * 处理按键按下事件
     * @param event - 键盘事件
     */
    const handleKeyDown = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (isKeyMatch(keyboardEvent.key, targetKeys)) {
        setIsPressed(true);
      }
    };

    /**
     * 处理按键释放事件
     * @param event - 键盘事件
     */
    const handleKeyUp = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (isKeyMatch(keyboardEvent.key, targetKeys)) {
        setIsPressed(false);
      }
    };

    // 根据配置选择监听的事件
    if (event === 'keydown') {
      eventTarget.addEventListener('keydown', handleKeyDown);
      eventTarget.addEventListener('keyup', handleKeyUp);
    } else {
      eventTarget.addEventListener('keyup', handleKeyDown);
    }

    // 清理函数
    return () => {
      if (event === 'keydown') {
        eventTarget.removeEventListener('keydown', handleKeyDown);
        eventTarget.removeEventListener('keyup', handleKeyUp);
      } else {
        eventTarget.removeEventListener('keyup', handleKeyDown);
      }
    };
  }, [targetKey, event, target, isKeyMatch]);

  return isPressed;
}

/**
 * useKeyCombo Hook
 * 监听组合键事件（如 Ctrl+S, Cmd+C 等）
 * 
 * @param keys - 组合键配置
 * @param callback - 按下组合键时的回调函数
 * @param options - 配置选项
 */
function useKeyCombo(
  keys: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean; // Cmd 键 (Mac) 或 Windows 键
    key: string;
  },
  callback: (event: KeyboardEvent) => void,
  options: Pick<UseKeyPressOptions, 'target'> = {}
): void {
  const { target = null } = options;

  useEffect(() => {
    const eventTarget = target || document;

    /**
     * 处理组合键事件
     * @param event - 键盘事件
     */
    const handleKeyDown = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      const {
        ctrl = false,
        shift = false,
        alt = false,
        meta = false,
        key,
      } = keys;

      const isMatch =
        keyboardEvent.ctrlKey === ctrl &&
        keyboardEvent.shiftKey === shift &&
        keyboardEvent.altKey === alt &&
        keyboardEvent.metaKey === meta &&
        keyboardEvent.key.toLowerCase() === key.toLowerCase();

      if (isMatch) {
        keyboardEvent.preventDefault();
        callback(keyboardEvent);
      }
    };

    eventTarget.addEventListener('keydown', handleKeyDown);

    // 清理函数
    return () => {
      eventTarget.removeEventListener('keydown', handleKeyDown);
    };
  }, [keys, callback, target]);
}

export { useKeyPress, useKeyCombo };
export type { KeyType, UseKeyPressOptions };