import { createContext, useContext, useState, ReactNode } from 'react';

type ViewType = 'Dashboard' | 'Properties' | 'Finance' | 'Settings';

interface AppContextType {
    activeView: ViewType;
    setActiveView: (view: ViewType) => void;
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [activeView, setActiveView] = useState<ViewType>('Dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <AppContext.Provider value={{
            activeView,
            setActiveView,
            sidebarCollapsed,
            setSidebarCollapsed
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
