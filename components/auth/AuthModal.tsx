import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { User } from '../../types';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

interface AuthModalProps {
    onLogin: (user: User) => void;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onLogin, onClose }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            let userCredential;
            if (isLoginView) {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
            } else {
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
            }
            onLogin({ email: userCredential.user.email });
        } catch (err: any) {
            setError(err.message || 'Error de autenticación');
        }
        setIsLoading(false);
    };
    
    const tabClasses = (isActive: boolean) => 
        `w-full text-center p-2.5 font-medium text-sm rounded-t-lg transition-colors ${
            isActive 
            ? 'bg-slate-800 text-brand-accent-400' 
            : 'bg-transparent text-slate-400 hover:bg-slate-700/50'
        }`;


    return (
        <Modal isOpen={true} onClose={onClose} title="Bienvenido" size="sm">
            <div className="flex border-b border-slate-700 mb-4">
                 <button onClick={() => setIsLoginView(true)} className={tabClasses(isLoginView)}>Iniciar Sesión</button>
                 <button onClick={() => setIsLoginView(false)} className={tabClasses(!isLoginView)}>Registrarse</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-xl font-bold text-center text-white">
                    {isLoginView ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </h2>
                <Input
                    label="Email"
                    id={isLoginView ? 'loginEmail' : 'registerEmail'}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon="mail"
                    placeholder="correo@ejemplo.com"
                    required
                />
                <Input
                    label="Contraseña"
                    id={isLoginView ? 'loginPassword' : 'registerPassword'}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon="lock"
                    placeholder="••••••••"
                    required
                />
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                <div className="pt-2">
                    <Button type="submit" isLoading={isLoading} icon={isLoginView ? 'login' : 'person_add'}>
                        {isLoginView ? 'Ingresar' : 'Registrarse'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default AuthModal;
