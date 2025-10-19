// Button style variants for consistent UI
export const buttonStyles = {
  primary: 'w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
  secondary: 'w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
  loading: 'opacity-50 cursor-not-allowed',
} as const;

// Common CSS classes
export const commonStyles = {
  container: 'min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8',
  card: 'max-w-md w-full space-y-8',
  form: 'mt-8 space-y-6',
  fieldset: 'rounded-md shadow-sm -space-y-px',
  errorText: 'text-sm text-red-600',
  link: 'font-medium text-blue-600 hover:text-blue-500',
  divider: 'relative flex justify-center text-sm',
  dividerLine: 'absolute inset-0 flex items-center',
  dividerText: 'px-2 bg-gray-50 text-gray-500',
} as const;
