
import React from 'react';

interface IconProps {
    name: string;
    className?: string;
    style?: React.CSSProperties;
}

export const Icon: React.FC<IconProps> = ({ name, className, style }) => {
    if (name === 'whatsapp') {
        return (
            <svg className={className} style={style} width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.85.504 3.583 1.38 5.08L2 22l5.08-1.38A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.64 0-3.21-.443-4.57-1.28l-.32-.19-3.02.82.81-2.95-.21-.33A7.96 7.96 0 0 1 4 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8zm4.13-5.47c-.22-.11-1.3-.64-1.5-.71-.2-.07-.35-.11-.5.11-.15.22-.57.71-.7.86-.13.15-.26.16-.48.05-.22-.11-.93-.34-1.77-1.08-.66-.59-1.1-1.31-1.23-1.53-.13-.22-.01-.34.1-.45.1-.1.22-.26.33-.39.11-.13.15-.22.22-.37.07-.15.04-.28-.02-.39-.07-.11-.5-1.21-.68-1.66-.18-.44-.36-.38-.5-.39-.13-.01-.28-.01-.43-.01-.15 0-.39.06-.6.28-.21.22-.8.78-.8 1.9s.82 2.21.93 2.37c.11.15 1.62 2.48 3.93 3.38.55.19.98.3 1.31.38.55.14 1.05.12 1.45.07.44-.07 1.3-.53 1.48-1.04.18-.51.18-.95.13-1.04-.05-.09-.2-.14-.42-.25z" />
            </svg>
        );
    }
    if (name === 'instagram') {
        return (
            <svg className={className} style={style} width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.13.62a1.13 1.13 0 1 1-2.25 0 1.13 1.13 0 0 1 2.25 0z" />
            </svg>
        );
    }
    // ...otros íconos con Material Symbols...
    return (
        <span className={`material-symbols-outlined ${className}`} style={style}>
            {name}
        </span>
    );
};
