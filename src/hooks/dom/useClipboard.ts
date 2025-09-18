import { useState, useCallback } from 'react';

/**
 * useClipboard Hook 的配置选项
 */
export interface UseClipboardOptions {
  /** 复制成功后的超时时间（毫秒），默认 2000ms */
  timeout?: number;
  /** 复制失败时的回调函数 */
  onError?: (error: Error) => void;
  /** 复制成功时的回调函数 */
  onSuccess?: (text: string) => void;
}

/**
 * useClipboard Hook 的返回类型
 */
export interface UseClipboardReturn {
  /** 当前剪贴板内容 */
  value: string;
  /** 是否刚刚复制成功 */
  copied: boolean;
  /** 是否正在执行复制操作 */
  copying: boolean;
  /** 复制文本到剪贴板 */
  copy: (text: string) => Promise<boolean>;
  /** 从剪贴板读取文本 */
  read: () => Promise<string>;
  /** 重置复制状态 */
  reset: () => void;
}

/**
 * useClipboard - 剪贴板操作管理的 React Hook
 * 
 * 提供了完整的剪贴板操作功能，包括复制文本、读取剪贴板内容、
 * 状态管理等，支持现代浏览器的 Clipboard API 和传统的 execCommand。
 * 
 * @param options - 配置选项
 * @returns 包含剪贴板操作函数和状态的对象
 * 
 * @example
 * ```tsx
 * const { copy, copied, value, read } = useClipboard({
 *   timeout: 3000,
 *   onSuccess: (text) => console.log('复制成功:', text),
 *   onError: (error) => console.error('复制失败:', error)
 * });
 * 
 * return (
 *   <div>
 *     <input 
 *       value={value} 
 *       onChange={(e) => setValue(e.target.value)} 
 *       placeholder="输入要复制的文本"
 *     />
 *     <button onClick={() => copy(value)}>
 *       {copied ? '已复制!' : '复制'}
 *     </button>
 *     <button onClick={read}>读取剪贴板</button>
 *   </div>
 * );
 * ```
 */
function useClipboard(options: UseClipboardOptions = {}): UseClipboardReturn {
  const { timeout = 2000, onError, onSuccess } = options;
  
  const [value, setValue] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [copying, setCopying] = useState<boolean>(false);

  /**
   * 使用现代 Clipboard API 复制文本
   * @param text - 要复制的文本
   * @returns 是否复制成功
   */
  const copyWithClipboardAPI = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      return false;
    }
  };

  /**
   * 使用传统 execCommand 复制文本（兼容旧浏览器）
   * @param text - 要复制的文本
   * @returns 是否复制成功
   */
  const copyWithExecCommand = (text: string): boolean => {
    try {
      // 创建临时文本区域
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      
      // 选择并复制
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      
      // 清理
      document.body.removeChild(textArea);
      return result;
    } catch (error) {
      return false;
    }
  };

  /**
   * 复制文本到剪贴板
   * @param text - 要复制的文本
   * @returns 是否复制成功
   */
  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (copying) return false;
    
    setCopying(true);
    
    try {
      let success = false;
      
      // 优先使用现代 Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        success = await copyWithClipboardAPI(text);
      } else {
        // 降级到 execCommand
        success = copyWithExecCommand(text);
      }
      
      if (success) {
        setValue(text);
        setCopied(true);
        onSuccess?.(text);
        
        // 设置超时重置状态
        setTimeout(() => {
          setCopied(false);
        }, timeout);
        
        return true;
      } else {
        throw new Error('复制失败');
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('复制失败');
      onError?.(err);
      return false;
    } finally {
      setCopying(false);
    }
  }, [copying, timeout, onSuccess, onError]);

  /**
   * 从剪贴板读取文本
   * @returns 剪贴板中的文本
   */
  const read = useCallback(async (): Promise<string> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        const text = await navigator.clipboard.readText();
        setValue(text);
        return text;
      } else {
        // 传统方法无法读取剪贴板，返回当前值
        console.warn('当前环境不支持读取剪贴板，请使用 HTTPS 或 localhost');
        return value;
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('读取剪贴板失败');
      onError?.(err);
      return '';
    }
  }, [value, onError]);

  /**
   * 重置复制状态
   */
  const reset = useCallback(() => {
    setCopied(false);
    setCopying(false);
  }, []);

  return {
    value,
    copied,
    copying,
    copy,
    read,
    reset,
  };
}

export { useClipboard };