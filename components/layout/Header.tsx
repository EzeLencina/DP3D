import React, { useState } from 'react';
import type { User } from '../../types';
import { Icon } from '../ui/Icon';

interface HeaderProps {
    user: User | null;
    onLogout: () => void;
    onLoginClick: () => void;
    onHistorialClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onLoginClick, onHistorialClick }) => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    // Extraer la prop correctamente desde los props
    // Recibe onHistorialClick como prop
    // ...existing code...

    return (
        <header className="flex justify-between items-center pb-4 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
                <Icon name="3d_rotation" className="text-4xl text-brand-accent-500" />
                <button
                    className="text-2xl font-bold text-white tracking-tight focus:outline-none hover:text-brand-accent-400 transition-colors"
                    onClick={() => {
                        const event = new CustomEvent('irHomeDP3D');
                        window.dispatchEvent(event);
                    }}
                    title="Ir al Home (Calculadora de Llaveros)"
                >
                    DP3D
                </button>
            </div>
            <div className="relative flex items-center gap-4">
                {/* Botón Historial */}
                <button
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
                    onClick={typeof onHistorialClick === 'function' ? onHistorialClick : undefined}
                >
                    <Icon name="history" className="text-lg" />
                    Historial
                </button>
                {user ? (
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 transition-colors"
                        >
                            <span className="font-medium text-sm text-slate-300 hidden sm:inline">{user.email}</span>
                            <div className="w-8 h-8 rounded-full bg-brand-accent-800 flex items-center justify-center text-white font-bold text-sm">
                                {user.email.charAt(0).toUpperCase()}
                            </div>
                        </button>
                        {isMenuOpen && (
                             <div className="absolute right-0 mt-12 w-48 bg-slate-800 rounded-md shadow-lg py-1 z-20 border border-slate-700">
                                <button
                                    onClick={() => {
                                        onLogout();
                                        setMenuOpen(false);
                                    }}
                                    className="w-full text-left flex items-center px-4 py-2 text-sm text-red-400 hover:bg-slate-700/50"
                                >
                                   <Icon name="logout" className="mr-2 text-sm"/>
                                   Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button onClick={onLoginClick} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">
                        Login
                    </button>
                )}
            </div>
        </header>
    );
};
