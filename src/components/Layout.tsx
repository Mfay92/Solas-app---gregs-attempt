import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
    onNavigate: (view: string) => void;
    activeView: string;
}

const Layout: React.FC<LayoutProps> = ({ children, onNavigate, activeView }) => {
    return (
        <div className="flex h-screen bg-ivolve-paper">
            <Sidebar onNavigate={onNavigate} activeView={activeView} />
            <main className="flex-1 overflow-auto">
                <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10 shadow-sm">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-ivolve-dark">Dashboard</h2>
                            <p className="text-sm text-gray-500">Welcome back, Matt</p>
                        </div>
                        <div className="flex space-x-4">
                            <button className="px-4 py-2 bg-ivolve-blue text-white rounded-lg text-sm font-bold hover:bg-teal-600 transition-colors shadow-sm">
                                + New Property
                            </button>
                        </div>
                    </div>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
