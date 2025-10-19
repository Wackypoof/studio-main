import { useState, useCallback } from 'react';
import { VALIDATION, FORM_FIELDS } from '@/lib/constants';

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface UseFormValidationReturn<T> {
  errors: FormErrors;
  validateForm: (data: T) => boolean;
  clearErrors: () => void;
  clearFieldError: (field: string) => void;
}

export function useFormValidation<T extends Record<string, any>>(): UseFormValidationReturn<T> {
  const [errors, setErrors] = useState<FormErrors>({});

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }, []);

  const validateForm = useCallback((data: T): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (FORM_FIELDS.EMAIL in data) {
      const email = data[FORM_FIELDS.EMAIL];
      if (!email?.trim()) {
        newErrors[FORM_FIELDS.EMAIL] = 'Email is required';
      } else if (!VALIDATION.EMAIL_REGEX.test(email)) {
        newErrors[FORM_FIELDS.EMAIL] = 'Please enter a valid email address';
      }
    }

    // Password validation
    if (FORM_FIELDS.PASSWORD in data) {
      const password = data[FORM_FIELDS.PASSWORD];
      if (!password?.trim()) {
        newErrors[FORM_FIELDS.PASSWORD] = 'Password is required';
      } else if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
        newErrors[FORM_FIELDS.PASSWORD] = `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  return {
    errors,
    validateForm,
    clearErrors,
    clearFieldError,
  };
}
