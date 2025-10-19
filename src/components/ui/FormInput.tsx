import { forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  srOnly?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, srOnly = false, className = '', ...props }, ref) => {
    const baseClasses = 'appearance-none rounded-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm';

    const errorClasses = error ? 'border-red-300' : 'border-gray-300';
    const roundedClasses = props.name === 'email' ? 'rounded-t-md' : props.name === 'password' ? 'rounded-b-md' : '';

    const inputClasses = `${baseClasses} ${errorClasses} ${roundedClasses} ${className}`.trim();

    return (
      <div>
        <label htmlFor={props.id} className={srOnly ? 'sr-only' : 'block text-sm font-medium text-gray-700'}>
          {label}
        </label>
        <input
          ref={ref}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${props.id}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
