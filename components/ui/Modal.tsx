
import React, { useEffect } from 'react';
import { Card } from './Card';
import { Icon } from './Icon';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);
    
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className={`w-full ${sizeClasses[size]}`} onClick={e => e.stopPropagation()}>
                <Card className="relative border-brand-accent-700/50">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white">{title}</h2>
                        <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
                            <Icon name="close" />
                        </button>
                    </div>
                    {children}
                </Card>
            </div>
        </div>
    );
};
