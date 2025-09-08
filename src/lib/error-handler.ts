interface ErrorInfo {
  componentStack: string;
}

type ErrorHandler = (error: Error, errorInfo?: ErrorInfo) => void;

// Default error handler that logs to console and could be extended to report to a service
const defaultErrorHandler: ErrorHandler = (error, errorInfo) => {
  console.error('Application Error:', error);
  
  if (errorInfo) {
    console.error('Error component stack:', errorInfo.componentStack);
  }
  
  // TODO: Integrate with error reporting service (e.g., Sentry, LogRocket)
  // reportErrorToService(error, errorInfo);
};

let customErrorHandler: ErrorHandler | null = null;

export const setErrorHandler = (handler: ErrorHandler) => {
  customErrorHandler = handler;
};

export const handleError: ErrorHandler = (error, errorInfo) => {
  const handler = customErrorHandler || defaultErrorHandler;
  handler(error, errorInfo);};

// Helper function to create error objects with additional context
export const createError = (message: string, code?: string, context?: Record<string, unknown>): Error => {
  const error = new Error(message) as Error & { code?: string; context?: Record<string, unknown> };
  
  if (code) {
    error.code = code;
  }
  
  if (context) {
    error.context = context;
  }
  
  return error;
};
