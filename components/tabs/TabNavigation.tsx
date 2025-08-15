import React from 'react';
import type { Tab, TabId } from '../../types';
import { Icon } from '../ui/Icon';

interface TabNavigationProps {
    tabs: Tab[];
    activeTab: TabId;
    setActiveTab: (id: TabId) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <div className="border-b border-slate-700">
            <nav className="-mb-px flex flex-wrap space-x-4" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            whitespace-nowrap flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                            ${
                                activeTab === tab.id
                                    ? 'border-brand-accent-500 text-brand-accent-400'
                                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
                            }
                        `}
                    >
                        <Icon name={tab.icon} className="mr-2" />
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};
