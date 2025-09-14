// Types for error handling
type ErrorCode = 
  | 'VALIDATION_ERROR'
  | 'AUTH_ERROR'
  | 'NOT_FOUND'
  | 'FORBIDDEN'
  | 'INTERNAL_SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'TIMEOUT_ERROR'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INVALID_INPUT'
  | 'UNAUTHORIZED';

interface ErrorInfo {
  componentStack?: string;
  context?: Record<string, unknown>;
  url?: string;
  timestamp?: string;
  userAgent?: string;
  statusCode?: number;
  code?: ErrorCode;
  retryable?: boolean;
}

type ErrorHandler = (error: Error, errorInfo?: ErrorInfo) => void;

interface ErrorReport {
  message: string;
  stack?: string;
  name: string;
  code?: ErrorCode;
  statusCode?: number;
  context?: Record<string, unknown>;
  timestamp: string;
  url: string;
  userAgent: string;
  componentStack?: string;
  retryable?: boolean;
  originalError?: unknown;
}

// Default error handler that logs to console and reports to error tracking services
const defaultErrorHandler: ErrorHandler = (error, errorInfo = {}) => {
  const timestamp = new Date().toISOString();
  const url = typeof window !== 'undefined' ? window.location.href : 'server';
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'server';
  
  const report: ErrorReport = {
    message: error.message,
    stack: error.stack,
    name: error.name,
    timestamp,
    url: errorInfo.url || url,
    userAgent: errorInfo.userAgent || userAgent,
    code: errorInfo.code || 'INTERNAL_SERVER_ERROR',
    statusCode: errorInfo.statusCode || 500,
    retryable: errorInfo.retryable ?? false,
    ...(errorInfo.componentStack && { componentStack: errorInfo.componentStack }),
    ...(errorInfo.context && { context: errorInfo.context }),
    originalError: error,
  };

  // Log to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.group('Error Details');
    console.error('Error:', error);
    if (errorInfo.componentStack) {
      console.error('Component Stack:', errorInfo.componentStack);
    }
    console.groupEnd();
  }
  
  // In production, report to error tracking service
  if (process.env.NODE_ENV === 'production') {
    reportToErrorService(report);
  }
};

// Report to error tracking service (e.g., Sentry, LogRocket, custom API)
const reportToErrorService = (report: ErrorReport) => {
  // Format the error for better readability in logs
  const errorDetails = {
    timestamp: report.timestamp,
    message: report.message,
    name: report.name,
    code: report.code,
    statusCode: report.statusCode,
    url: report.url,
    userAgent: report.userAgent,
    context: report.context,
  };
  
  console.error('Error reported to service:', errorDetails);
  
  // You can also send to your backend API
  if (process.env.NEXT_PUBLIC_ERROR_REPORTING_ENABLED === 'true') {
    fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
      keepalive: true, // Ensures the request is sent even if the page is being unloaded
    }).catch(console.error);
  }
};

let customErrorHandler: ErrorHandler | null = null;

export const setErrorHandler = (handler: ErrorHandler) => {
  customErrorHandler = handler;
};

export const handleError: ErrorHandler = (error, errorInfo) => {
  const handler = customErrorHandler || defaultErrorHandler;
  handler(error, errorInfo);
};

// Helper function to create error objects with additional context
const createError = (
  message: string, 
  options: {
    code?: ErrorCode;
    cause?: unknown;
    context?: Record<string, unknown>;
    statusCode?: number;
    retryable?: boolean;
  } = {}
): Error & { 
  code?: ErrorCode; 
  context?: Record<string, unknown>; 
  statusCode?: number;
  retryable?: boolean;
} => {
  const error = new Error(message) as any;
  
  if (options.code) {
    error.code = options.code;
  }
  
  if (options.cause) {
    error.cause = options.cause;
  }
  
  if (options.context) {
    error.context = options.context;
  }
  
  if (options.statusCode) {
    error.statusCode = options.statusCode;
  }
  
  if (options.retryable !== undefined) {
    error.retryable = options.retryable;
  }
  
  // Capture stack trace
  Error.captureStackTrace?.(error, createError);
  
  return error;
};

// Global error handlers
const setupGlobalErrorHandlers = () => {
  if (typeof window === 'undefined') return;

  // Handle uncaught errors
  const handleUncaughtError = (event: ErrorEvent) => {
    event.preventDefault();
    const error = event.error || new Error(event.message || 'Unknown error occurred');
    handleError(error, {
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });  
  };

  // Handle unhandled promise rejections
  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    event.preventDefault();
    const reason = event.reason || new Error('Unhandled promise rejection');
    handleError(reason instanceof Error ? reason : new Error(String(reason)), {
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });
  };

  // Add event listeners
  window.addEventListener('error', handleUncaughtError);
  window.addEventListener('unhandledrejection', handleUnhandledRejection as EventListener);

  // Cleanup function
  return () => {
    window.removeEventListener('error', handleUncaughtError);
    window.removeEventListener('unhandledrejection', handleUnhandledRejection as EventListener);
  };
};

// Initialize global error handlers when this module is imported
if (typeof window !== 'undefined') {
  setupGlobalErrorHandlers();
}

// Export a function to manually report errors
export const reportError = (
  error: unknown, 
  context: Record<string, unknown> = {},
  options: {
    code?: ErrorCode;
    statusCode?: number;
    retryable?: boolean;
  } = {}
) => {
  if (error instanceof Error) {
    handleError(error, { 
      context,
      code: options.code,
      statusCode: options.statusCode,
      retryable: options.retryable,
    });
  } else if (typeof error === 'string') {
    const errorObj = new Error(error);
    (errorObj as any).code = options.code;
    (errorObj as any).statusCode = options.statusCode;
    (errorObj as any).retryable = options.retryable;
    handleError(errorObj, { context });
  } else {
    const errorObj = new Error('An unknown error occurred');
    (errorObj as any).code = options.code || 'UNKNOWN_ERROR';
    (errorObj as any).statusCode = options.statusCode || 500;
    (errorObj as any).retryable = options.retryable ?? false;
    handleError(errorObj, { 
      context: { 
        ...context, 
        originalError: error 
      },
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
    });
  }
};
