import React, { useState } from 'react';
import Modal from '../Modal';
import { WarningIcon, StarIconSolid, BinocularsIcon, NoSymbolIcon, SparklesIcon } from '../Icons';
import { GoogleGenAI } from '@google/genai';

const TABS = ['Page Key', 'User Guide'];

const KeyContent = () => (
    <div className="space-y-6">
        <section>
            <h4 className="font-semibold text-solas-dark mb-2 border-b pb-1">Status Icons</h4>
            <ul className="space-y-3">
                <li className="flex items-center"><span className="text-status-orange mr-3"><WarningIcon /></span> <span className="text-sm"><b>Attention Required:</b> This unit has a flag or issue needing review.</span></li>
                <li className="flex items-center"><span className="text-tag-master mr-3"><StarIconSolid /></span> <span className="text-sm"><b>Master Unit:</b> A non-lettable unit representing the whole property.</span></li>
                <li className="flex items-center"><span className="text-tag-void mr-3"><BinocularsIcon /></span> <span className="text-sm"><b>Void Unit:</b> A lettable unit that is currently unoccupied.</span></li>
                <li className="flex items-center"><span className="text-tag-oom mr-3"><NoSymbolIcon /></span> <span className="text-sm"><b>Out of Management:</b> The property has been handed back or is no longer managed.</span></li>
            </ul>
        </section>
         <section>
            <h4 className="font-semibold text-solas-dark mb-2 border-b pb-1">Tags & Highlights</h4>
            <p className="text-sm text-gray-600">Tags provide crucial at-a-glance information. You can filter by most tags and change their visual style in "View Settings". Row highlights can also be toggled there to draw attention to specific statuses.</p>
        </section>
    </div>
);

const GuideContent = () => {
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summary, setSummary] = useState<string | null>(null);
    const [summaryError, setSummaryError] = useState<string | null>(null);

    const guideText = `
        The Property Database is the heart of the system. This guide will help you understand its key features and how to find the information you need quickly.
        The Header contains all your main controls. The Smart Search bar lets you search using natural language. The buttons on the right let you change view settings, get quick info, access help, and use admin tools.
        Clicking on any row in the database will open a detailed profile panel. From here, you can access everything about that specific property or unit. The "Detail Panel Position" option in "View Settings" changes whether this panel slides in from the right or up from the bottom.
    `;

    const handleSummarize = async () => {
        setIsSummarizing(true);
        setSummary(null);
        setSummaryError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Summarize this guide into a few clear, concise bullet points for a busy housing professional:\n\n${guideText}`,
            });
            setSummary(response.text);
        } catch (e) {
            setSummaryError('Sorry, the AI summary could not be generated at this time.');
        } finally {
            setIsSummarizing(false);
        }
    };

    return (
        <div className="space-y-6">
             <div className="flex justify-end">
                <button onClick={handleSummarize} disabled={isSummarizing} className="flex items-center space-x-2 bg-ivolve-blue text-white text-sm font-bold px-3 py-1.5 rounded-md hover:bg-opacity-90 disabled:bg-gray-400">
                    <SparklesIcon />
                    <span>{isSummarizing ? 'Summarizing...' : 'Summarize with AI'}</span>
                </button>
            </div>
            {summary && (
                 <div className="p-3 bg-blue-50 border-l-4 border-ivolve-blue text-sm text-solas-gray space-y-1">
                    <h4 className="font-bold text-solas-dark">AI Summary:</h4>
                    {summary.split('\n').map((line, index) => {
                        const trimmed = line.trim().replace(/(\* |- )/, '');
                        return trimmed && <p key={index} className="flex"><span className="mr-2">&bull;</span><span>{trimmed}</span></p>;
                    })}
                </div>
            )}
             {summaryError && <p className="text-sm text-red-600">{summaryError}</p>}
            
            <div className="prose prose-sm max-w-none text-solas-gray">
                <h3>Introduction</h3>
                <p>The Property Database is the heart of the system. This guide will help you understand its key features and how to find the information you need quickly.</p>
                <h3>Header Controls</h3>
                <p>The header at the top of the page contains all your main controls. The Smart Search bar lets you search using natural language (e.g., "voids in the north"). The buttons on the right let you change view settings, get quick info, access help, and use admin tools.</p>
                <h3>Viewing Details</h3>
                <p>Clicking on any row in the database will open a detailed profile panel. From here, you can access everything about that specific property or unit. You can change where this panel appears (from the side or the bottom) in the "View Settings" menu.</p>
            </div>
        </div>
    );
};

const HelpModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState(TABS[0]);

    return (
        <Modal title="Help & Guidance" onClose={onClose}>
            <div className="border-b border-gray-200 mb-4">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`${activeTab === tab ? 'border-ivolve-blue text-ivolve-blue' : 'border-transparent text-gray-500 hover:text-gray-700'} whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>
            <div>
                {activeTab === 'Page Key' && <KeyContent />}
                {activeTab === 'User Guide' && <GuideContent />}
            </div>
        </Modal>
    );
};

export default HelpModal;
