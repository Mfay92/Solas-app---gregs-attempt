import { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Default to collapsed (icons only)

    return (
        <AppContext.Provider value={{
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
