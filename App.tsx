import React, { useState, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { TabNavigation } from './components/tabs/TabNavigation';
import { KeychainCalculator } from './components/tabs/KeychainCalculator';
import { GeneralCalculator } from './components/tabs/GeneralCalculator';
import { CostsEditor } from './components/tabs/CostsEditor';
import { Orders } from './components/tabs/Orders';
import { ResultsDisplay } from './components/results/ResultsDisplay';
import { CalculatorProvider } from './context/CalculatorContext';
import { TABS } from './constants';
import type { TabId, User } from './types';
import AuthModal from './components/auth/AuthModal';
import { Historial } from './components/tabs/Historial';
import { EnCola } from './components/tabs/EnCola';
import { Imprimiendo } from './components/tabs/Imprimiendo';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabId>('keychain');
    const [user, setUser] = useState<User | null>(null);
    const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(true);

    const handleLogin = (loggedInUser: User) => {
        setUser(loggedInUser);
        setAuthModalOpen(false);
    };

    const handleLogout = useCallback(() => {
        setUser(null);
        setAuthModalOpen(true);
    }, []);
    
    const renderActiveTab = () => {
        switch (activeTab) {
            case 'keychain':
                return <KeychainCalculator />;
            case 'general':
                return <GeneralCalculator />;
            case 'costs':
                return <CostsEditor />;
            case 'orders':
                return user ? <Orders user={user} /> : null;
            case 'encola':
                return user ? <EnCola user={user} /> : null;
            case 'imprimiendo':
                return user ? <Imprimiendo user={user} /> : null;
            case 'historial':
                return user ? <Historial user={user} /> : null;
            default:
                return <KeychainCalculator />;
        }
    };

    // Nueva función para navegación desde el header
    const handleHistorialClick = () => {
        setActiveTab('historial');
    };

    return (
        <CalculatorProvider>
            <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <Header
                        user={user}
                        onLogout={handleLogout}
                        onLoginClick={() => setAuthModalOpen(true)}
                        onHistorialClick={handleHistorialClick}
                    />
                    {user ? (
                        <main className="mt-8 flex flex-col gap-8 items-start">
                            <div className="w-full">
                                <TabNavigation tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
                                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="w-full flex flex-col items-start">
                                        {renderActiveTab()}
                                    </div>
                                    <div className="w-full flex flex-col">
                                        <ResultsDisplay user={user} />
                                    </div>
                                </div>
                            </div>
                        </main>
                    ) : (
                        <div className="text-center mt-20">
                            <h2 className="text-3xl font-bold text-white">Welcome to Dimensional Print</h2>
                            <p className="mt-4 text-slate-400">Please log in to use the calculator.</p>
                            <button onClick={() => setAuthModalOpen(true)} className="mt-6 bg-brand-accent-600 hover:bg-brand-accent-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                Login / Register
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {isAuthModalOpen && <AuthModal onLogin={handleLogin} onClose={() => setAuthModalOpen(false)} />}
        </CalculatorProvider>
    );
};

export default App;
