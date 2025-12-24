import React from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: clsx(
        'bg-ivolve-mid text-white',
        'hover:bg-ivolve-dark hover:shadow-md',
        'active:bg-ivolve-dark active:scale-[0.98]',
        'focus-visible:ring-2 focus-visible:ring-ivolve-mid focus-visible:ring-offset-2'
    ),
    secondary: clsx(
        'bg-white text-ivolve-dark border border-slate-200',
        'hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm',
        'active:bg-slate-100 active:scale-[0.98]',
        'focus-visible:ring-2 focus-visible:ring-ivolve-mid focus-visible:ring-offset-2'
    ),
    ghost: clsx(
        'bg-transparent text-slate-600',
        'hover:bg-slate-100 hover:text-slate-900',
        'active:bg-slate-200 active:scale-[0.98]',
        'focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2'
    ),
    danger: clsx(
        'bg-ivolve-rouge text-white',
        'hover:bg-red-600 hover:shadow-md',
        'active:bg-red-700 active:scale-[0.98]',
        'focus-visible:ring-2 focus-visible:ring-ivolve-rouge focus-visible:ring-offset-2'
    ),
    success: clsx(
        'bg-ivolve-bright text-ivolve-dark',
        'hover:bg-green-400 hover:shadow-md',
        'active:bg-green-500 active:scale-[0.98]',
        'focus-visible:ring-2 focus-visible:ring-ivolve-bright focus-visible:ring-offset-2'
    ),
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            rightIcon,
            fullWidth = false,
            className,
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={clsx(
                    // Base styles
                    'inline-flex items-center justify-center font-medium rounded-lg',
                    'transition-all duration-200 ease-out',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
                    // Variant and size
                    variantStyles[variant],
                    sizeStyles[size],
                    // Full width
                    fullWidth && 'w-full',
                    className
                )}
                {...props}
            >
                {isLoading ? (
                    <svg
                        className="animate-spin h-4 w-4"
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
                ) : (
                    <>
                        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
                        {children}
                        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
                    </>
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
