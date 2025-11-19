
import React, { useState, lazy, Suspense } from 'react';
import { LegalIcon } from '../Icons';
import SplitText from '../SplitText';
import LegalDashboard from '../LegalDashboard';

const AnalyzerTool = lazy(() => import('../AnalyzerTool'));
const LegalDatabaseTool = lazy(() => import('../LegalDatabaseTool'));


type LegalTool = 'dashboard' | 'analyzer' | 'database' | 'buildReport' | 'buildReportAlt';

const LoadingSpinner: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
    </div>
);

const LegalHubView: React.FC = () => {
    const [activeTool, setActiveTool] = useState<LegalTool>('dashboard');

    const renderActiveTool = () => {
        switch (activeTool) {
            case 'analyzer': return (
                <Suspense fallback={<LoadingSpinner />}>
                    <AnalyzerTool onBack={() => setActiveTool('dashboard')} />
                </Suspense>
            );
            case 'database': return (
                 <Suspense fallback={<LoadingSpinner />}>
                    <LegalDatabaseTool onBack={() => setActiveTool('dashboard')} />
                </Suspense>
            );
            case 'dashboard':
            default: return <LegalDashboard setActiveTool={setActiveTool} />;
        }
    }

    return (
        <div className="h-full flex flex-col">
            <header className="bg-app-header text-app-header-text p-4 shadow-md z-10">
                <div className="flex items-center space-x-4">
                    <LegalIcon />
                    <h1 className="text-3xl font-bold tracking-wider animated-heading" aria-label="LEGAL HUB"><SplitText>LEGAL HUB</SplitText></h1>
                </div>
            </header>
            <main className="flex-grow bg-gray-50 overflow-y-auto">
                {renderActiveTool()}
            </main>
        </div>
    );
};

export default LegalHubView;