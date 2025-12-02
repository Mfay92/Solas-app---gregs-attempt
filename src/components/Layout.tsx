import React from 'react';
import Sidebar from './Sidebar';
import { Sidekick } from './Sidekick';
import { useApp } from '../context/AppContext';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { sidebarCollapsed, setSidebarCollapsed } = useApp();

    return (
        <div className="flex h-screen bg-ivolve-paper relative">
            {/* Sidebar - fixed position, overlays content when expanded */}
            <Sidebar />

            {/* Main content - always full width minus collapsed sidebar */}
            <main className="flex-1 overflow-auto ml-20">
                <div className="p-6">
                    {children}
                </div>
            </main>

            {/* Sidekick floating assistant */}
            <Sidekick />

            {/* Backdrop overlay when sidebar expanded - click to close */}
            {!sidebarCollapsed && (
                <div
                    onClick={() => setSidebarCollapsed(true)}
                    className="fixed inset-0 bg-black/20 z-10 transition-opacity duration-300 cursor-pointer"
                    aria-hidden="true"
                />
            )}
        </div>
    );
};

export default Layout;
