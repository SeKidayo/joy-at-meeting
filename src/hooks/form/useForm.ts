import { useState, useCallback, useMemo } from 'react';

/**
 * 表单字段值类型
 */
export type FormValues = Record<string, any>;

/**
 * 表单错误类型
 */
export type FormErrors = Record<string, string | undefined>;

/**
 * 表单字段配置
 */
export interface FieldConfig {
  /** 初始值 */
  initialValue?: any;
  /** 验证规则 */
  validate?: (value: any, values: FormValues) => string | undefined;
  /** 是否必填 */
  required?: boolean;
  /** 必填错误信息 */
  requiredMessage?: string;
}

/**
 * 表单配置
 */
export interface FormConfig {
  /** 字段配置 */
  fields?: Record<string, FieldConfig>;
  /** 表单级验证 */
  validate?: (values: FormValues) => FormErrors;
  /** 提交处理函数 */
  onSubmit?: (values: FormValues) => void | Promise<void>;
  /** 是否在值改变时验证 */
  validateOnChange?: boolean;
  /** 是否在失焦时验证 */
  validateOnBlur?: boolean;
}

/**
 * 字段状态
 */
export interface FieldState {
  /** 字段值 */
  value: any;
  /** 错误信息 */
  error?: string;
  /** 是否已被触碰 */
  touched: boolean;
  /** 是否正在验证 */
  validating: boolean;
}

/**
 * 表单状态
 */
export interface FormState {
  /** 所有字段值 */
  values: FormValues;
  /** 所有错误信息 */
  errors: FormErrors;
  /** 已触碰的字段 */
  touched: Record<string, boolean>;
  /** 是否正在提交 */
  isSubmitting: boolean;
  /** 是否有效 */
  isValid: boolean;
  /** 是否为初始状态 */
  isPristine: boolean;
}

/**
 * useForm Hook的返回类型
 */
export interface UseFormReturn {
  /** 表单状态 */
  formState: FormState;
  /** 获取字段状态 */
  getFieldState: (name: string) => FieldState;
  /** 获取字段属性 */
  getFieldProps: (name: string) => {
    value: any;
    onChange: (value: any) => void;
    onBlur: () => void;
    error?: string;
    touched: boolean;
  };
  /** 设置字段值 */
  setFieldValue: (name: string, value: any) => void;
  /** 设置字段错误 */
  setFieldError: (name: string, error: string | undefined) => void;
  /** 设置字段触碰状态 */
  setFieldTouched: (name: string, touched?: boolean) => void;
  /** 设置多个字段值 */
  setValues: (values: Partial<FormValues>) => void;
  /** 设置多个字段错误 */
  setErrors: (errors: Partial<FormErrors>) => void;
  /** 验证字段 */
  validateField: (name: string) => Promise<string | undefined>;
  /** 验证表单 */
  validateForm: () => Promise<FormErrors>;
  /** 提交表单 */
  handleSubmit: (event?: React.FormEvent) => Promise<void>;
  /** 重置表单 */
  resetForm: (values?: Partial<FormValues>) => void;
  /** 重置字段 */
  resetField: (name: string) => void;
}

/**
 * useForm - 表单状态管理的React Hook
 * @param config - 表单配置
 * @returns 表单状态和操作函数
 */
function useForm(config: FormConfig = {}): UseFormReturn {
  const {
    fields = {},
    validate: formValidate,
    onSubmit,
    validateOnChange = false,
    validateOnBlur = true,
  } = config;

  // 初始化表单值
  const initialValues = useMemo(() => {
    const values: FormValues = {};
    Object.entries(fields).forEach(([name, fieldConfig]) => {
      values[name] = fieldConfig.initialValue ?? '';
    });
    return values;
  }, [fields]);

  // 表单状态
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 计算派生状态
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  const isPristine = useMemo(() => {
    return JSON.stringify(values) === JSON.stringify(initialValues);
  }, [values, initialValues]);

  // 验证单个字段
  const validateField = useCallback(
    async (name: string): Promise<string | undefined> => {
      const fieldConfig = fields[name];
      const value = values[name];

      // 必填验证
      if (fieldConfig?.required && (!value || value === '')) {
        const error = fieldConfig.requiredMessage || `${name} is required`;
        return error;
      }

      // 自定义验证
      if (fieldConfig?.validate) {
        try {
          const error = await fieldConfig.validate(value, values);
          return error;
        } catch (err) {
          return err instanceof Error ? err.message : 'Validation error';
        }
      }

      return undefined;
    },
    [fields, values]
  );

  // 验证整个表单
  const validateForm = useCallback(async (): Promise<FormErrors> => {
    const newErrors: FormErrors = {};

    // 验证所有字段
    const fieldValidationPromises = Object.keys(fields).map(async name => {
      const error = await validateField(name);
      if (error) {
        newErrors[name] = error;
      }
    });

    await Promise.all(fieldValidationPromises);

    // 表单级验证
    if (formValidate) {
      try {
        const formErrors = await formValidate(values);
        Object.assign(newErrors, formErrors);
      } catch (err) {
        console.error('Form validation error:', err);
      }
    }

    return newErrors;
  }, [fields, values, formValidate, validateField]);

  // 设置字段值
  const setFieldValue = useCallback(
    async (name: string, value: any) => {
      setValues(prev => ({ ...prev, [name]: value }));

      // 如果启用了onChange验证
      if (validateOnChange) {
        const error = await validateField(name);
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    },
    [validateOnChange, validateField]
  );

  // 设置字段错误
  const setFieldError = useCallback(
    (name: string, error: string | undefined) => {
      setErrors(prev => ({ ...prev, [name]: error }));
    },
    []
  );

  // 设置字段触碰状态
  const setFieldTouched = useCallback(
    async (name: string, isTouched = true) => {
      setTouched(prev => ({ ...prev, [name]: isTouched }));

      // 如果启用了onBlur验证且字段被触碰
      if (validateOnBlur && isTouched) {
        const error = await validateField(name);
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    },
    [validateOnBlur, validateField]
  );

  // 获取字段状态
  const getFieldState = useCallback(
    (name: string): FieldState => {
      return {
        value: values[name] ?? '',
        error: errors[name],
        touched: touched[name] ?? false,
        validating: false, // 可以根据需要扩展
      };
    },
    [values, errors, touched]
  );

  // 获取字段属性
  const getFieldProps = useCallback(
    (name: string) => {
      const fieldState = getFieldState(name);
      return {
        value: fieldState.value,
        onChange: (value: any) => setFieldValue(name, value),
        onBlur: () => setFieldTouched(name, true),
        error: fieldState.error,
        touched: fieldState.touched,
      };
    },
    [getFieldState, setFieldValue, setFieldTouched]
  );

  // 处理表单提交
  const handleSubmit = useCallback(
    async (event?: React.FormEvent) => {
      if (event) {
        event.preventDefault();
      }

      setIsSubmitting(true);

      try {
        // 验证表单
        const formErrors = await validateForm();
        setErrors(formErrors);

        // 如果有错误，不提交
        if (Object.keys(formErrors).length > 0) {
          return;
        }

        // 执行提交
        if (onSubmit) {
          await onSubmit(values);
        }
      } catch (err) {
        console.error('Form submission error:', err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateForm, onSubmit]
  );

  // 重置表单
  const resetForm = useCallback(
    (newValues?: Partial<FormValues>) => {
      const resetValues = { ...initialValues, ...newValues };
      setValues(resetValues);
      setErrors({});
      setTouched({});
      setIsSubmitting(false);
    },
    [initialValues]
  );

  // 重置字段
  const resetField = useCallback(
    (name: string) => {
      const initialValue = fields[name]?.initialValue ?? '';
      setValues(prev => ({ ...prev, [name]: initialValue }));
      setErrors(prev => ({ ...prev, [name]: undefined }));
      setTouched(prev => ({ ...prev, [name]: false }));
    },
    [fields]
  );

  // 批量设置值
  const setValuesCallback = useCallback((newValues: Partial<FormValues>) => {
    setValues(prev => ({ ...prev, ...newValues }));
  }, []);

  // 批量设置错误
  const setErrorsCallback = useCallback((newErrors: Partial<FormErrors>) => {
    setErrors(prev => ({ ...prev, ...newErrors }));
  }, []);

  const formState: FormState = {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isPristine,
  };

  return {
    formState,
    getFieldState,
    getFieldProps,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setValues: setValuesCallback,
    setErrors: setErrorsCallback,
    validateField,
    validateForm,
    handleSubmit,
    resetForm,
    resetField,
  };
}

export { useForm };
