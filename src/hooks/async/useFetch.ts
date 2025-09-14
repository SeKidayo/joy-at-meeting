import { useMemo } from 'react';
import { useAsync, UseAsyncReturn } from './useAsync';

/**
 * HTTP请求方法类型
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * 请求配置选项
 */
export interface FetchOptions extends Omit<RequestInit, 'method' | 'body'> {
  /** HTTP方法 */
  method?: HttpMethod;
  /** 请求体数据 */
  data?: any;
  /** 查询参数 */
  params?: Record<string, string | number | boolean>;
  /** 基础URL */
  baseURL?: string;
  /** 请求超时时间（毫秒） */
  timeout?: number;
}

/**
 * useFetch Hook的返回类型
 */
export interface UseFetchReturn<T> extends Omit<UseAsyncReturn<T>, 'execute'> {
  /** 执行请求 */
  execute: (url?: string, options?: FetchOptions) => Promise<T>;
  /** 重新请求 */
  refetch: () => Promise<T>;
}

/**
 * 构建查询字符串
 * @param params - 查询参数对象
 * @returns 查询字符串
 */
function buildQueryString(params: Record<string, string | number | boolean>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, String(value));
  });
  return searchParams.toString();
}

/**
 * 创建带超时的fetch请求
 * @param url - 请求URL
 * @param options - 请求选项
 * @param timeout - 超时时间
 * @returns Promise
 */
function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      reject(new Error(`Request timeout after ${timeout}ms`));
    }, timeout);

    fetch(url, { ...options, signal: controller.signal })
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(timeoutId));
  });
}

/**
 * useFetch - HTTP请求的React Hook
 * @param initialUrl - 初始请求URL
 * @param initialOptions - 初始请求选项
 * @param immediate - 是否立即执行请求，默认为false
 * @returns 包含请求状态和控制函数的对象
 */
function useFetch<T = any>(
  initialUrl?: string,
  initialOptions?: FetchOptions,
  immediate = false
): UseFetchReturn<T> {
  // 创建请求函数
  const fetchFunction = useMemo(() => {
    return async (url?: string, options?: FetchOptions): Promise<T> => {
      const finalUrl = url || initialUrl;
      const finalOptions = { ...initialOptions, ...options };

      if (!finalUrl) {
        throw new Error('URL is required for fetch request');
      }

      const {
        method = 'GET',
        data,
        params,
        baseURL = '',
        timeout = 10000,
        headers = {},
        ...restOptions
      } = finalOptions;

      // 构建完整URL
      let fullUrl = baseURL + finalUrl;
      if (params) {
        const queryString = buildQueryString(params);
        fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryString;
      }

      // 构建请求选项
      const requestOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        ...restOptions,
      };

      // 添加请求体
      if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
        requestOptions.body = JSON.stringify(data);
      }

      // 发送请求
      const response = await fetchWithTimeout(fullUrl, requestOptions, timeout);

      // 检查响应状态
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      // 解析响应
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return (await response.text()) as unknown as T;
    };
  }, [initialUrl, initialOptions]);

  // 使用useAsync管理异步状态
  const asyncResult = useAsync(fetchFunction, immediate);

  // 重新请求函数
  const refetch = useMemo(() => {
    return () => asyncResult.execute(initialUrl, initialOptions);
  }, [asyncResult, initialUrl, initialOptions]);

  return {
    ...asyncResult,
    refetch,
  };
}

export { useFetch };