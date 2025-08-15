
import React from 'react';
import { Icon } from './Icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
    isLoading?: boolean;
    icon?: string;
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    isLoading = false,
    icon,
    className = '',
    ...props
}) => {
    const baseClasses = 'w-full flex justify-center items-center font-bold py-2.5 px-4 rounded-lg transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-brand-accent-600 hover:bg-brand-accent-700 text-white focus:ring-brand-accent-500',
        secondary: 'bg-slate-600 hover:bg-slate-700 text-slate-100 focus:ring-slate-500',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
                <>
                    {icon && <Icon name={icon} className="mr-2" />}
                    {children}
                </>
            )}
        </button>
    );
};
