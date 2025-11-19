import React from 'react';
import { BuildReportIcon, FolderUploadIcon, LawCheckerIcon, BuildReportAltIcon } from './Icons';

type LegalTool = 'dashboard' | 'analyzer' | 'database' | 'buildReport' | 'buildReportAlt';

const ToolCard: React.FC<{ icon: React.ReactNode; title: string; onClick: () => void; disabled?: boolean }> = ({ icon, title, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled} className="bg-white rounded-lg p-4 text-center flex flex-col items-center justify-center transition-all duration-200 shadow-sm hover:shadow-lg hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
        <div className="w-16 h-16 flex items-center justify-center text-white bg-brand-blue rounded-lg">{icon}</div>
        <span className="mt-3 font-semibold text-solas-dark">{title}</span>
    </button>
);

const LegalDashboard: React.FC<{ setActiveTool: (tool: LegalTool) => void }> = ({ setActiveTool }) => {
    return (
        <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-brand-dark-green text-white p-6 rounded-lg">
                    <h2 className="text-2xl font-bold">About</h2>
                    <p className="mt-2 text-sm opacity-90">Welcome to the Legal Hub. This is a central place to analyze legal documents, check the status of agreements across the portfolio, and build reports. Use the tools to turn complex legal jargon into actionable data.</p>
                </div>
                <div className="lg:col-span-2 bg-white p-6 rounded-lg border">
                    <h2 className="text-2xl font-bold text-solas-dark text-center">Hub Tools</h2>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <ToolCard icon={<BuildReportIcon />} title="Build Report" onClick={() => setActiveTool('buildReport')} disabled />
                        <ToolCard icon={<FolderUploadIcon />} title="Upload Document" onClick={() => setActiveTool('analyzer')} />
                        <ToolCard icon={<LawCheckerIcon />} title="Law Checker" onClick={() => setActiveTool('database')} />
                        <ToolCard icon={<BuildReportAltIcon />} title="Build Report" onClick={() => setActiveTool('buildReportAlt')} disabled />
                    </div>
                </div>
            </div>
            <div className="mt-6">
                <h2 className="text-2xl font-bold text-solas-dark">Reports & Stats</h2>
                <div className="mt-2 p-8 text-center bg-white border rounded-lg text-gray-400">
                    <p>Widgets for reports, stats, and key actions will appear here soon.</p>
                </div>
            </div>
        </div>
    );
};

export default LegalDashboard;