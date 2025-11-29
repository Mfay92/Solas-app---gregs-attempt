import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    // const { activeView } = useApp(); // Removed unused variable

    return (
        <div className="flex h-screen bg-ivolve-paper">
            <Sidebar />
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
