import React from 'react';
import clsx from 'clsx';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * The variant of the badge determines its styling
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline' | 'ghost';

  /**
   * The size of the badge
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';

  /**
   * Icon to display in the badge
   */
  icon?: React.ReactNode;

  /**
   * The children content of the badge
   */
  children?: React.ReactNode;

  /**
   * Custom CSS classes
   */
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className,
  ...props
}) => {
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-sm',
  };

  const variantClasses = {
    primary: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    secondary: 'bg-gray-100 text-gray-800 border-gray-200',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    outline: 'bg-transparent border border-indigo-600 text-indigo-600',
    ghost: 'bg-transparent text-gray-700 border-transparent',
  };

  const baseClasses = 'inline-flex items-center rounded-full font-medium border';

  return (
    <span
      className={clsx(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {icon && <span className="mr-1 flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
