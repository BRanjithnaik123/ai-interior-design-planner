import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading,
      fullWidth,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = `btn-${variant}`;
    const sizeClasses = size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'lg' ? 'px-8 py-4 text-lg' : 'px-6 py-2';
    const widthClass = fullWidth ? 'w-full' : '';
    const loadingClass = isLoading ? 'opacity-70 cursor-not-allowed' : '';
    const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${sizeClasses} ${widthClass} ${loadingClass} ${disabledClass} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <div className={styles.spinner}></div>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
