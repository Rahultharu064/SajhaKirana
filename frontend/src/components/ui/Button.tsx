import React from 'react';
import clsx from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The variant of the button determines its primary styling
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline' | 'ghost';

  /**
   * The size of the button
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Whether the button is in a loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Icon to display before the button text
   */
  startIcon?: React.ReactNode;

  /**
   * Icon to display after the button text
   */
  endIcon?: React.ReactNode;

  /**
   * The children content of the button
   */
  children?: React.ReactNode;

  /**
   * Custom CSS classes
   */
  className?: string;

  /**
   * HTML button type
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * Full width button
   * @default false
   */
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      startIcon,
      endIcon,
      children,
      className,
      type = 'button',
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-lg',
    };

    const variantClasses = {
      primary: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 text-white',
      secondary: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 text-white',
      success: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 text-white',
      danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white',
      warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 text-white',
      outline: 'bg-transparent border border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
      ghost: 'bg-transparent hover:bg-gray-100 focus:ring-gray-500 text-gray-700',
    };

    const baseClasses =
      'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50';

    const loadingClasses = loading ? 'cursor-wait opacity-75' : '';

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={clsx(
          baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          fullWidth && 'w-full',
          loadingClasses,
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {startIcon && !loading && (
          <span className="mr-2 flex-shrink-0">{startIcon}</span>
        )}
        <span className={clsx(
          'flex-shrink-0',
          loading && startIcon && 'ml-2'
        )}>
          {children}
        </span>
        {endIcon && (
          <span className="ml-2 flex-shrink-0">{endIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
