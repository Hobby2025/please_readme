import React from 'react';
import { cn } from '@/utils/cn';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg';
  isLoading?: boolean;
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'default',
      size = 'default',
      isLoading = false,
      className = '',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default:
        'bg-primary text-white border-none cyber-button hover:filter hover:brightness-125',
      secondary:
        'bg-secondary text-black border-none cyber-button hover:filter hover:brightness-125',
      outline:
        'bg-transparent border border-primary text-primary hover:bg-primary/10 cyber-button',
      ghost: 'bg-transparent hover:bg-white/10 text-primary',
      link: 'bg-transparent text-primary hover:underline underline-offset-4',
    };

    const sizeStyles = {
      default: 'py-3 px-6 text-sm tracking-widest uppercase font-black',
      sm: 'py-2 px-4 text-xs tracking-widest uppercase font-black',
      lg: 'py-4 px-10 text-base tracking-widest uppercase font-black',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center transition-all focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button'; 