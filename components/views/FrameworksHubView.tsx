import React from 'react';
import { FileTextIcon } from '../Icons';

const FrameworksHubView: React.FC = () => {
    return (
        <div className="h-full flex flex-col">
            <header className="bg-app-header text-app-header-text p-4 shadow-md z-10">
                <div className="flex items-center space-x-4">
                    <FileTextIcon />
                    <h1 className="text-3xl font-bold tracking-wider">Frameworks, Bids and Tenders</h1>
                </div>
            </header>
            <main className="flex-grow p-8">
                <h2 className="text-2xl font-bold text-solas-dark">Coming Soon</h2>
                <p className="mt-2 text-solas-gray">This hub will provide a central place to manage framework agreements, track bids, and oversee tenders.</p>
            </main>
        </div>
    );
};

export default FrameworksHubView;
