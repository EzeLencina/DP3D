
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
    <div className={`bg-slate-800/50 rounded-xl shadow-lg p-3 sm:p-4 backdrop-blur-sm w-full max-w-3xl mx-auto ${className}`}>
            {children}
        </div>
    );
};
