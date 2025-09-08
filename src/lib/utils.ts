import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { useMemo } from 'react';

/**
 * Date and time related utilities
 */

// Extended date formatting options
export interface FormatDateOptions extends Intl.DateTimeFormatOptions {
  locale?: string;
  includeTime?: boolean;
  timeZone?: string;
  formatStyle?: 'full' | 'long' | 'medium' | 'short';
}

const DEFAULT_DATE_OPTIONS: FormatDateOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour12: true,
  hour: 'numeric',
  minute: '2-digit',
  includeTime: false,
  formatStyle: 'medium',
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

/**
 * Safely parses a date from various input types
 * @param date - Date input (string, number, or Date)
 * @returns Date object or null if invalid
 */
export function safeParseDate(date: Date | number | string | null | undefined): Date | null {
  if (!date) return null;
  
  const parsedDate = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : new Date(date);
    
  return isNaN(parsedDate.getTime()) ? null : parsedDate;
}

/**
 * Formats a date using Intl.DateTimeFormat with enhanced error handling and options
 * @param date - The date to format (can be a Date object, timestamp, or date string)
 * @param options - Custom formatting options
 * @returns Formatted date string or fallback for invalid dates
 */
export function formatDate(
  date: Date | number | string | null | undefined, 
  options: FormatDateOptions = {}
): string {
  const dateObj = safeParseDate(date);
  
  if (!dateObj) {
    console.warn('Invalid date provided to formatDate:', date);
    return 'Invalid date';
  }

  const {
    includeTime,
    formatStyle = 'medium',
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
    ...formatOptions
  } = { ...DEFAULT_DATE_OPTIONS, ...options };

  try {
    const formatter = new Intl.DateTimeFormat(
      options.locale || 'en-US',
      {
        ...formatOptions,
        timeZone,
        ...(includeTime === false ? { 
          hour: undefined, 
          minute: undefined,
          second: undefined 
        } : {})
      }
    );
    
    return formatter.format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date format error';
  }
}

/**
 * React hook version of formatDate that memoizes the result
 * @param date - The date to format
 * @param options - Formatting options
 * @returns Memoized formatted date string
 */
export function useFormattedDate(
  date: Date | number | string | null | undefined, 
  options: FormatDateOptions = {}
): string {
  return useMemo(() => formatDate(date, options), [date, JSON.stringify(options)]);
}

/**
 * Calculates the time difference between now and a given date
 * @param date - The date to compare with now
 * @returns Human-readable time difference (e.g., "2 days ago")
 */
export function timeAgo(date: Date | number | string | null | undefined): string {
  const dateObj = safeParseDate(date);
  if (!dateObj) return 'Invalid date';
  
  const seconds = Math.floor((Date.now() - dateObj.getTime()) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return interval === 1 
        ? `${interval} ${unit} ago` 
        : `${interval} ${unit}s ago`;
    }
  }
  
  return 'Just now';
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
