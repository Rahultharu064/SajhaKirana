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
    primary: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    secondary: 'bg-slate-100 text-slate-800 border-slate-200',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    danger: 'bg-rose-100 text-rose-800 border-rose-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    outline: 'bg-transparent border border-emerald-600 text-emerald-600',
    ghost: 'bg-transparent text-slate-700 border-transparent',
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
