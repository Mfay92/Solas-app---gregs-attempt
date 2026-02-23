import { createContext, useContext, useState, ReactNode } from 'react';

// Pop-out window state
export interface PopOutWindow {
    id: string;
    title: string;
    type: 'person-profile' | 'property-profile' | 'form' | 'document' | 'case';
    content: ReactNode;
    isMinimized: boolean;
    entityId?: string; // ID of person, property, case, etc.
    metadata?: Record<string, any>; // Additional metadata
}

interface PopOutContextType {
    windows: PopOutWindow[];
    openWindow: (window: Omit<PopOutWindow, 'isMinimized'>) => void;
    closeWindow: (id: string) => void;
    minimizeWindow: (id: string) => void;
    restoreWindow: (id: string) => void;
    getWindow: (id: string) => PopOutWindow | undefined;
    isWindowOpen: (id: string) => boolean;
}

const PopOutContext = createContext<PopOutContextType | undefined>(undefined);

export function PopOutProvider({ children }: { children: ReactNode }) {
    const [windows, setWindows] = useState<PopOutWindow[]>([]);

    const openWindow = (window: Omit<PopOutWindow, 'isMinimized'>) => {
        // Check if window already exists
        const existingWindow = windows.find(w => w.id === window.id);
        if (existingWindow) {
            // If it exists and is minimized, restore it
            if (existingWindow.isMinimized) {
                restoreWindow(window.id);
            }
            return;
        }

        // Add new window
        setWindows(prev => [...prev, { ...window, isMinimized: false }]);
    };

    const closeWindow = (id: string) => {
        setWindows(prev => prev.filter(w => w.id !== id));
    };

    const minimizeWindow = (id: string) => {
        setWindows(prev =>
            prev.map(w => (w.id === id ? { ...w, isMinimized: true } : w))
        );
    };

    const restoreWindow = (id: string) => {
        setWindows(prev =>
            prev.map(w => (w.id === id ? { ...w, isMinimized: false } : w))
        );
    };

    const getWindow = (id: string) => {
        return windows.find(w => w.id === id);
    };

    const isWindowOpen = (id: string) => {
        return windows.some(w => w.id === id);
    };

    return (
        <PopOutContext.Provider
            value={{
                windows,
                openWindow,
                closeWindow,
                minimizeWindow,
                restoreWindow,
                getWindow,
                isWindowOpen,
            }}
        >
            {children}
        </PopOutContext.Provider>
    );
}

export function usePopOut() {
    const context = useContext(PopOutContext);
    if (context === undefined) {
        throw new Error('usePopOut must be used within a PopOutProvider');
    }
    return context;
}
