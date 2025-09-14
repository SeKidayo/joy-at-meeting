import { useMemo, useCallback } from 'react';

/**
 * 验证规则函数类型
 */
export type ValidationRule<T = any> = (
  value: T,
  fieldName?: string
) => string | undefined | Promise<string | undefined>;

/**
 * 内置验证规则
 */
export const validationRules = {
  /**
   * 必填验证
   * @param message - 错误信息
   */
  required: (message = 'This field is required'): ValidationRule => {
    return (value: any) => {
      if (value === null || value === undefined || value === '') {
        return message;
      }
      if (Array.isArray(value) && value.length === 0) {
        return message;
      }
      return undefined;
    };
  },

  /**
   * 最小长度验证
   * @param minLength - 最小长度
   * @param message - 错误信息
   */
  minLength: (
    minLength: number,
    message?: string
  ): ValidationRule<string> => {
    return (value: string) => {
      if (value && value.length < minLength) {
        return message || `Minimum length is ${minLength} characters`;
      }
      return undefined;
    };
  },

  /**
   * 最大长度验证
   * @param maxLength - 最大长度
   * @param message - 错误信息
   */
  maxLength: (
    maxLength: number,
    message?: string
  ): ValidationRule<string> => {
    return (value: string) => {
      if (value && value.length > maxLength) {
        return message || `Maximum length is ${maxLength} characters`;
      }
      return undefined;
    };
  },

  /**
   * 最小值验证
   * @param min - 最小值
   * @param message - 错误信息
   */
  min: (min: number, message?: string): ValidationRule<number> => {
    return (value: number) => {
      if (value !== null && value !== undefined && value < min) {
        return message || `Minimum value is ${min}`;
      }
      return undefined;
    };
  },

  /**
   * 最大值验证
   * @param max - 最大值
   * @param message - 错误信息
   */
  max: (max: number, message?: string): ValidationRule<number> => {
    return (value: number) => {
      if (value !== null && value !== undefined && value > max) {
        return message || `Maximum value is ${max}`;
      }
      return undefined;
    };
  },

  /**
   * 邮箱格式验证
   * @param message - 错误信息
   */
  email: (message = 'Please enter a valid email address'): ValidationRule<string> => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (value: string) => {
      if (value && !emailRegex.test(value)) {
        return message;
      }
      return undefined;
    };
  },

  /**
   * 手机号格式验证（中国大陆）
   * @param message - 错误信息
   */
  phone: (message = 'Please enter a valid phone number'): ValidationRule<string> => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return (value: string) => {
      if (value && !phoneRegex.test(value)) {
        return message;
      }
      return undefined;
    };
  },

  /**
   * URL格式验证
   * @param message - 错误信息
   */
  url: (message = 'Please enter a valid URL'): ValidationRule<string> => {
    return (value: string) => {
      if (value) {
        try {
          new URL(value);
        } catch {
          return message;
        }
      }
      return undefined;
    };
  },

  /**
   * 正则表达式验证
   * @param pattern - 正则表达式
   * @param message - 错误信息
   */
  pattern: (
    pattern: RegExp,
    message = 'Invalid format'
  ): ValidationRule<string> => {
    return (value: string) => {
      if (value && !pattern.test(value)) {
        return message;
      }
      return undefined;
    };
  },

  /**
   * 数字验证
   * @param message - 错误信息
   */
  number: (message = 'Please enter a valid number'): ValidationRule<string> => {
    return (value: string) => {
      if (value && isNaN(Number(value))) {
        return message;
      }
      return undefined;
    };
  },

  /**
   * 整数验证
   * @param message - 错误信息
   */
  integer: (message = 'Please enter a valid integer'): ValidationRule<string> => {
    return (value: string) => {
      if (value && (!Number.isInteger(Number(value)) || value.includes('.'))) {
        return message;
      }
      return undefined;
    };
  },

  /**
   * 密码强度验证
   * @param options - 密码要求选项
   * @param message - 错误信息
   */
  password: (
    options: {
      minLength?: number;
      requireUppercase?: boolean;
      requireLowercase?: boolean;
      requireNumbers?: boolean;
      requireSpecialChars?: boolean;
    } = {},
    message?: string
  ): ValidationRule<string> => {
    const {
      minLength = 8,
      requireUppercase = true,
      requireLowercase = true,
      requireNumbers = true,
      requireSpecialChars = true,
    } = options;

    return (value: string) => {
      if (!value) return undefined;

      const errors: string[] = [];

      if (value.length < minLength) {
        errors.push(`at least ${minLength} characters`);
      }

      if (requireUppercase && !/[A-Z]/.test(value)) {
        errors.push('at least one uppercase letter');
      }

      if (requireLowercase && !/[a-z]/.test(value)) {
        errors.push('at least one lowercase letter');
      }

      if (requireNumbers && !/\d/.test(value)) {
        errors.push('at least one number');
      }

      if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        errors.push('at least one special character');
      }

      if (errors.length > 0) {
        return message || `Password must contain ${errors.join(', ')}`;
      }

      return undefined;
    };
  },

  /**
   * 确认密码验证
   * @param passwordValue - 原密码值
   * @param message - 错误信息
   */
  confirmPassword: (
    passwordValue: string,
    message = 'Passwords do not match'
  ): ValidationRule<string> => {
    return (value: string) => {
      if (value && value !== passwordValue) {
        return message;
      }
      return undefined;
    };
  },
};

/**
 * 验证器配置
 */
export interface ValidatorConfig {
  /** 验证规则数组 */
  rules: ValidationRule[];
  /** 是否在第一个错误时停止验证 */
  stopOnFirstError?: boolean;
}

/**
 * useValidation Hook的返回类型
 */
export interface UseValidationReturn {
  /** 验证单个值 */
  validate: (value: any, fieldName?: string) => Promise<string | undefined>;
  /** 验证多个值 */
  validateAll: (values: Record<string, any>) => Promise<Record<string, string | undefined>>;
  /** 创建验证器 */
  createValidator: (rules: ValidationRule[], stopOnFirstError?: boolean) => ValidationRule;
}

/**
 * useValidation - 表单验证的React Hook
 * @param config - 验证器配置
 * @returns 验证函数和工具
 */
function useValidation(config?: ValidatorConfig): UseValidationReturn {
  const { rules = [], stopOnFirstError = true } = config || {};

  // 创建验证器
  const createValidator = useCallback(
    (validationRules: ValidationRule[], stopOnFirst = true): ValidationRule => {
      return async (value: any, fieldName?: string) => {
        for (const rule of validationRules) {
          try {
            const error = await rule(value, fieldName);
            if (error && stopOnFirst) {
              return error;
            }
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Validation error';
            if (stopOnFirst) {
              return errorMessage;
            }
          }
        }
        return undefined;
      };
    },
    []
  );

  // 主验证函数
  const validator = useMemo(() => {
    return createValidator(rules, stopOnFirstError);
  }, [rules, stopOnFirstError, createValidator]);

  // 验证单个值
  const validate = useCallback(
    async (value: any, fieldName?: string): Promise<string | undefined> => {
      return await validator(value, fieldName);
    },
    [validator]
  );

  // 验证多个值
  const validateAll = useCallback(
    async (values: Record<string, any>): Promise<Record<string, string | undefined>> => {
      const errors: Record<string, string | undefined> = {};
      
      const validationPromises = Object.entries(values).map(async ([fieldName, value]) => {
        const error = await validate(value, fieldName);
        if (error) {
          errors[fieldName] = error;
        }
      });

      await Promise.all(validationPromises);
      return errors;
    },
    [validate]
  );

  return {
    validate,
    validateAll,
    createValidator,
  };
}

export { useValidation };