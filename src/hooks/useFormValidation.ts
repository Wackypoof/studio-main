import { useState, useCallback, useEffect, useMemo } from 'react';
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

export interface UseFormAutosaveOptions<T> {
  storageKey: string;
  data: T;
  enabled?: boolean;
  throttleMs?: number;
}

export interface UseFormAutosaveReturn<T> {
  lastSavedAt: number | null;
  isSaving: boolean;
  hasDraft: boolean;
  restore: () => T | null;
  clear: () => void;
  saveNow: () => void;
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

// Lightweight, local-only autosave with debounce and SSR-safe fallback
export function useFormAutosave<T>({ storageKey, data, enabled = true, throttleMs = 800 }: UseFormAutosaveOptions<T>): UseFormAutosaveReturn<T> {
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const safeLocalStorage = typeof window !== 'undefined' ? window.localStorage : null;

  const hasDraft = (() => {
    if (!safeLocalStorage) return false;
    try { return !!safeLocalStorage.getItem(storageKey); } catch { return false; }
  })();

  const save = useCallback(() => {
    if (!enabled || !safeLocalStorage) return;
    try {
      setIsSaving(true);
      safeLocalStorage.setItem(storageKey, JSON.stringify({ data, _at: Date.now() }));
      setLastSavedAt(Date.now());
    } catch {
      // noop: local fallback only
    } finally {
      setIsSaving(false);
    }
  }, [enabled, safeLocalStorage, storageKey, data]);

  const saveNow = useCallback(() => save(), [save]);

  const restore = useCallback((): T | null => {
    if (!safeLocalStorage) return null;
    try {
      const raw = safeLocalStorage.getItem(storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      setLastSavedAt(typeof parsed?._at === 'number' ? parsed._at : Date.now());
      return parsed?.data ?? null;
    } catch {
      return null;
    }
  }, [safeLocalStorage, storageKey]);

  const clear = useCallback(() => {
    if (!safeLocalStorage) return;
    try { safeLocalStorage.removeItem(storageKey); } catch {}
  }, [safeLocalStorage, storageKey]);

  // Debounced autosave on data changes
  const debounced = useCallback((fn: () => void, wait: number) => {
    let t: any;
    return () => {
      clearTimeout(t);
      t = setTimeout(fn, wait);
    };
  }, []);

  const triggerSave = useMemo(() => debounced(save, throttleMs), [debounced, save, throttleMs]);

  // Save whenever data changes (debounced)
  useEffect(() => {
    if (!enabled) return;
    triggerSave();
  }, [data, enabled, triggerSave]);

  return { lastSavedAt, isSaving, hasDraft, restore, clear, saveNow };
}
