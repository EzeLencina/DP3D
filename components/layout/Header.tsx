import React, { useState, useRef, useEffect } from 'react';
import type { User } from '../../types';
import { auth } from '../../firebase';
import { Icon } from '../ui/Icon';

interface HeaderProps {
    user: User | null;
    onLogout: () => void;
    onLoginClick: () => void;
    onHistorialClick?: () => void;
    onTabChange?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onLoginClick, onHistorialClick, onTabChange }) => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Deshabilitar scroll de body cuando el menú hamburguesa está abierto
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);
    const menuRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

        // Cerrar menú móvil al hacer click fuera
        useEffect(() => {
            if (!isMobileMenuOpen) return;
            const handleClickOutside = (event: MouseEvent) => {
                const mobileMenu = document.getElementById('mobile-menu-dp3d');
                const mobileTrigger = document.getElementById('mobile-menu-trigger-dp3d');
                if (
                    mobileMenu &&
                    !mobileMenu.contains(event.target as Node) &&
                    mobileTrigger &&
                    !mobileTrigger.contains(event.target as Node)
                ) {
                    setMobileMenuOpen(false);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [isMobileMenuOpen]);

    useEffect(() => {
        if (!isMenuOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node)
            ) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);
    // Extraer la prop correctamente desde los props
    // Recibe onHistorialClick como prop
    // ...existing code...

    return (
        <header className="flex items-center pb-4 border-b border-slate-700/50 w-full justify-between">
            {/* Bloque izquierdo: logo y título */}
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
            {/* Bloque derecho: solo hamburguesa en móvil, alineado a la derecha */}
            <div className="flex items-center sm:hidden w-auto" style={{minWidth: '80px'}}>
                <div className="flex-grow" />
                <button
                    id="mobile-menu-trigger-dp3d"
                    className="flex items-center justify-center p-2 rounded-lg hover:bg-slate-800 transition-colors"
                    onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Abrir menú"
                >
                    <Icon name="menu" className="text-2xl text-white" />
                </button>
            </div>
            {/* Menú móvil */}
            {isMobileMenuOpen && (
                <div
                    id="mobile-menu-dp3d"
                    className="fixed inset-0 z-40 bg-black bg-opacity-60 flex justify-end sm:hidden"
                    onClick={e => {
                        // Solo cerrar si se hace clic en el overlay, no en el menú
                        if (e.target === e.currentTarget) setMobileMenuOpen(false);
                    }}
                >
                    <div className="w-64 bg-slate-900 h-full shadow-lg flex flex-col pt-8 gap-2 overflow-y-auto" style={{maxHeight: '100vh'}}>
                        <button className="self-end px-6 py-2 text-slate-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                            <Icon name="close" className="text-2xl" />
                        </button>
                        <nav className="flex flex-col gap-2 px-6">
                            {user && (
                                <div className="flex flex-col items-center mb-4">
                                    {auth.currentUser?.photoURL ? (
                                        <img src={auth.currentUser.photoURL} alt="Foto de perfil" className="w-16 h-16 rounded-full object-cover mb-2" />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-brand-accent-800 flex items-center justify-center text-white font-bold text-xl mb-2">
                                            {user.email.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            )}
                            <button className="text-lg text-white font-medium text-left py-2 hover:text-brand-accent-400" onClick={() => { onTabChange ? onTabChange('keychain') : window.dispatchEvent(new CustomEvent('irHomeDP3D')); setMobileMenuOpen(false); }}>Llaveros</button>
                            <button className="text-lg text-white font-medium text-left py-2 hover:text-brand-accent-400" onClick={() => { onTabChange ? onTabChange('general') : window.dispatchEvent(new CustomEvent('irGeneralDP3D')); setMobileMenuOpen(false); }}>General</button>
                            <button className="text-lg text-white font-medium text-left py-2 hover:text-brand-accent-400" onClick={() => { onTabChange ? onTabChange('costs') : window.dispatchEvent(new CustomEvent('irCostosDP3D')); setMobileMenuOpen(false); }}>Costos</button>
                            <button className="text-lg text-white font-medium text-left py-2 hover:text-brand-accent-400" onClick={() => { onTabChange ? onTabChange('orders') : window.dispatchEvent(new CustomEvent('irPedidosDP3D')); setMobileMenuOpen(false); }}>Pedidos</button>
                            <button className="text-lg text-white font-medium text-left py-2 hover:text-brand-accent-400" onClick={() => { onTabChange ? onTabChange('encola') : window.dispatchEvent(new CustomEvent('irEnColaDP3D')); setMobileMenuOpen(false); }}>En Cola</button>
                            <button className="text-lg text-white font-medium text-left py-2 hover:text-brand-accent-400" onClick={() => { onTabChange ? onTabChange('imprimiendo') : window.dispatchEvent(new CustomEvent('irImprimiendoDP3D')); setMobileMenuOpen(false); }}>Imprimiendo</button>
                            <button className="text-lg text-white font-medium text-left py-2 hover:text-brand-accent-400" onClick={() => { if (typeof onHistorialClick === 'function') onHistorialClick(); setMobileMenuOpen(false); }}>Historial</button>
                            <button className="text-lg text-white font-medium text-left py-2 hover:text-brand-accent-400" onClick={() => { onTabChange ? onTabChange('novedades') : window.dispatchEvent(new CustomEvent('irNovedadesDP3D')); setMobileMenuOpen(false); }}>Novedades</button>
                        </nav>
                        <div className="mt-auto px-6 pb-6">
                            {user ? (
                                <button className="w-full text-left flex items-center gap-2 py-2 text-brand-accent-400 hover:text-white" onClick={() => { window.dispatchEvent(new CustomEvent('irCuentaDP3D')); setMobileMenuOpen(false); }}>
                                    <Icon name="person" className="text-lg" /> Mi cuenta
                                </button>
                            ) : (
                                <button onClick={() => { onLoginClick(); setMobileMenuOpen(false); }} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">Login</button>
                            )}
                            {user && (
                                <button className="w-full text-left flex items-center gap-2 py-2 text-red-400 hover:text-white" onClick={() => { onLogout(); setMobileMenuOpen(false); }}>
                                    <Icon name="logout" className="text-lg" /> Cerrar Sesión
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* ...resto del header... */}
            {/* ...el bloque de usuario y botón historial solo debe aparecer una vez aquí, no duplicado... */}
                {user ? (
                    <div className="hidden sm:flex items-center gap-3">
                        {/* Botón Historial solo en escritorio, antes del mail */}
                        <button
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
                            onClick={typeof onHistorialClick === 'function' ? onHistorialClick : undefined}
                        >
                            <Icon name="history" className="text-lg" />
                            Historial
                        </button>
                        <button 
                            onClick={() => setMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 transition-colors"
                            ref={triggerRef}
                        >
                            <span className="font-medium text-sm text-slate-300">{user.email}</span>
                            {auth.currentUser?.photoURL ? (
                                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-slate-800">
                                    <img src={auth.currentUser.photoURL} alt="Foto de perfil" className="w-full h-full object-cover" style={{objectFit: 'cover', width: '100%', height: '100%'}} />
                                </div>
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-brand-accent-800 flex items-center justify-center text-white font-bold text-sm">
                                    {user.email.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </button>
                        {isMenuOpen && (
                            <div ref={menuRef} className="absolute right-0 top-full mt-2 w-48 bg-slate-800 rounded-md shadow-lg py-1 z-20 border border-slate-700">
                                <button
                                    onClick={() => {
                                        const event = new CustomEvent('irCuentaDP3D');
                                        window.dispatchEvent(event);
                                        setMenuOpen(false);
                                    }}
                                    className="w-full text-left flex items-center px-4 py-2 text-sm text-brand-accent-400 hover:bg-slate-700/50"
                                >
                                    <Icon name="person" className="mr-2 text-sm"/>
                                    Mi cuenta
                                </button>
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
                    <button onClick={onLoginClick} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm hidden sm:block">
                        Login
                    </button>
                )}
        </header>
    );
};
