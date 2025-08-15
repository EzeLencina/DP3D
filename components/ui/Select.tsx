
import React from 'react';
import { Icon } from './Icon';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    id: string;
    icon?: string;
    containerClassName?: string;
    children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ label, id, icon, containerClassName = '', children, ...props }) => {
    return (
        <div className={`w-full ${containerClassName}`}>
            <label htmlFor={id} className="block mb-2 text-sm font-medium text-slate-300">
                {label}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                       <Icon name={icon} className="text-slate-400" />
                    </div>
                )}
                <select
                    id={id}
                    className={`bg-slate-700/50 border border-slate-600 text-white text-sm rounded-lg focus:ring-brand-accent-500 focus:border-brand-accent-500 block w-full p-2.5 transition-colors ${icon ? 'pl-10' : ''}`}
                    {...props}
                >
                    {children}
                </select>
            </div>
        </div>
    );
};
