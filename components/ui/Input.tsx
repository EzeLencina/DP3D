
import React from 'react';
import { Icon } from './Icon';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: string;
    icon?: string;
    containerClassName?: string;
    unit?: string;
    value?: string | number;
}

export const Input: React.FC<InputProps> = ({ label, id, icon, containerClassName = '', unit, ...props }) => {
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
                <input
                    id={id}
                    className={`bg-slate-700/50 border border-slate-600 text-white text-sm rounded-lg focus:ring-brand-accent-500 focus:border-brand-accent-500 block w-full p-2.5 transition-colors ${icon ? 'pl-10' : ''} ${unit ? 'pr-10' : ''} ${props.type === 'number' ? 'appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none' : ''}`}
                    value={props.value as string | number | undefined}
                    {...props}
                />
                 {unit && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                       <span className="text-slate-400 text-sm">{unit}</span>
                    </div>
                )}
            </div>
        </div>
    );
};
