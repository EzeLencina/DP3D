
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
    <div className={`bg-slate-800/50 rounded-xl shadow-lg p-6 sm:p-8 backdrop-blur-sm ${className}`}>
            {children}
        </div>
    );
};
