// State management hooks
export { useLocalStorage } from './hooks/state/useLocalStorage';
export { useToggle } from './hooks/state/useToggle';

// Async hooks
export { useAsync } from './hooks/async/useAsync';
export { useFetch } from './hooks/async/useFetch';
export type { AsyncStatus, UseAsyncReturn } from './hooks/async/useAsync';
export type {
  HttpMethod,
  FetchOptions,
  UseFetchReturn,
} from './hooks/async/useFetch';

// DOM 操作类 Hooks
export { useIntersectionObserver } from './hooks/dom/useIntersectionObserver';
export { useWindowSize } from './hooks/dom/useWindowSize';
export { useClickOutside } from './hooks/dom/useClickOutside';
export { useScrollPosition } from './hooks/dom/useScrollPosition';
export { useElementSize } from './hooks/dom/useElementSize';
export { useHover } from './hooks/dom/useHover';
export { useFocus } from './hooks/dom/useFocus';
export { useKeyPress, useKeyCombo } from './hooks/dom/useKeyPress';
export type {
  UseIntersectionObserverOptions,
  UseIntersectionObserverReturn,
} from './hooks/dom/useIntersectionObserver';
export type {
  WindowSize,
  UseWindowSizeOptions,
} from './hooks/dom/useWindowSize';
export type {
  ScrollPosition,
  UseScrollPositionOptions,
} from './hooks/dom/useScrollPosition';
export type { ElementSize } from './hooks/dom/useElementSize';
export type { UseHoverOptions } from './hooks/dom/useHover';
export type { UseFocusOptions, FocusState } from './hooks/dom/useFocus';
export type { KeyType, UseKeyPressOptions } from './hooks/dom/useKeyPress';

// Performance hooks
export { useDebounce } from './hooks/performance/useDebounce';
export { useMemoizedCallback } from './hooks/performance/useMemoizedCallback';
export {
  useThrottle,
  useThrottledCallback,
} from './hooks/performance/useThrottle';
export type { UseThrottleOptions } from './hooks/performance/useThrottle';

// Form hooks
export { useForm } from './hooks/form/useForm';
export { useValidation, validationRules } from './hooks/form/useValidation';
export type {
  FormValues,
  FormErrors,
  FieldConfig,
  FormConfig,
  FieldState,
  FormState,
  UseFormReturn,
} from './hooks/form/useForm';
export type {
  ValidationRule,
  ValidatorConfig,
  UseValidationReturn,
} from './hooks/form/useValidation';

// Utility hooks
export { usePrevious } from './hooks/utils/usePrevious';

// 导出类型定义
export type { UseLocalStorageReturn } from './hooks/state/useLocalStorage';
export type { UseToggleReturn } from './hooks/state/useToggle';
