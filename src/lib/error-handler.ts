interface ErrorInfo {
  componentStack?: string;
  context?: Record<string, unknown>;
  url?: string;
  timestamp?: string;
  userAgent?: string;
}

type ErrorHandler = (error: Error, errorInfo?: ErrorInfo) => void;

type ErrorReport = {
  message: string;
  stack?: string;
  name: string;
  code?: string;
  context?: Record<string, unknown>;
  timestamp: string;
  url: string;
  userAgent: string;
  componentStack?: string;
};

// Default error handler that logs to console and reports to error tracking services
const defaultErrorHandler: ErrorHandler = (error, errorInfo = {}) => {
  const report: ErrorReport = {
    message: error.message,
    stack: error.stack,
    name: error.name,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : 'server',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
    ...(errorInfo.componentStack && { componentStack: errorInfo.componentStack }),
    ...(errorInfo.context && { context: errorInfo.context }),
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
  // Example: Send to your error tracking service
  // fetch('/api/report-error', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(report),
  // }).catch(console.error);
  
  // For now, just log the report
  console.error('Error report:', report);
};

let customErrorHandler: ErrorHandler | null = null;

export const setErrorHandler = (handler: ErrorHandler) => {
  customErrorHandler = handler;
};

export const handleError: ErrorHandler = (error, errorInfo) => {
  const handler = customErrorHandler || defaultErrorHandler;
  handler(error, errorInfo);};

// Helper function to create error objects with additional context
export const createError = (
  message: string, 
  options: {
    code?: string;
    cause?: unknown;
    context?: Record<string, unknown>;
    statusCode?: number;
  } = {}
): Error & { code?: string; context?: Record<string, unknown>; statusCode?: number } => {
  const error = new Error(message, options.cause ? { cause: options.cause } : undefined) as Error & {
    code?: string;
    context?: Record<string, unknown>;
    statusCode?: number;
  };
  
  if (options.code) {
    error.code = options.code;
  }
  
  if (options.context) {
    error.context = options.context;
  }
  
  if (options.statusCode) {
    error.statusCode = options.statusCode;
  }
  
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
export const reportError = (error: unknown, context: Record<string, unknown> = {}) => {
  if (error instanceof Error) {
    handleError(error, {
      context,
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
    });
  } else {
    handleError(new Error(String(error)), {
      context: { originalError: error, ...context },
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
    });
  }
};
