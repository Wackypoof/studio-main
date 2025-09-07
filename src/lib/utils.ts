import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { useMemo } from 'react';

interface FormatDateOptions {
  year?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'narrow' | 'short' | 'long';
  day?: 'numeric' | '2-digit';
  locale?: string;
}

const DEFAULT_DATE_OPTIONS: FormatDateOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

/**
 * Formats a date using Intl.DateTimeFormat with memoization for better performance.
 * @param date - The date to format (can be a Date object, timestamp, or date string)
 * @param options - Custom formatting options
 * @returns Formatted date string
 */
export function formatDate(date: Date | number | string, options: FormatDateOptions = {}): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    console.warn('Invalid date provided to formatDate');
    return 'Invalid date';
  }

  const mergedOptions = { ...DEFAULT_DATE_OPTIONS, ...options };
  const formatter = new Intl.DateTimeFormat(
    options.locale || 'en-US',
    mergedOptions
  );
  
  return formatter.format(dateObj);
}

/**
 * React hook version of formatDate that memoizes the result
 */
export function useFormattedDate(date: Date | number | string, options: FormatDateOptions = {}): string {
  return useMemo(() => formatDate(date, options), [date, JSON.stringify(options)]);
}

interface FormatCurrencyOptions extends Intl.NumberFormatOptions {
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  style?: 'currency' | 'decimal' | 'percent';
}

const DEFAULT_CURRENCY_OPTIONS: FormatCurrencyOptions = {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
};

/**
 * Formats a number as currency with proper localization and memoization
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, options: FormatCurrencyOptions = {}): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    console.warn('Invalid amount provided to formatCurrency');
    return '—';
  }

  const mergedOptions = { 
    ...DEFAULT_CURRENCY_OPTIONS, 
    ...options,
    style: 'currency' as const,
  };

  const formatter = new Intl.NumberFormat(
    options.locale || 'en-US',
    mergedOptions
  );
  
  return formatter.format(amount);
}

/**
 * React hook version of formatCurrency that memoizes the result
 */
export function useFormattedCurrency(amount: number, options: FormatCurrencyOptions = {}): string {
  return useMemo(
    () => formatCurrency(amount, options),
    [amount, JSON.stringify(options)]
  );
}

/**
 * Utility to safely handle potentially undefined or null values
 */
export function safeFormatCurrency(amount: number | null | undefined, options: FormatCurrencyOptions = {}): string {
  if (amount === null || amount === undefined) return '—';
  return formatCurrency(amount, options);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
