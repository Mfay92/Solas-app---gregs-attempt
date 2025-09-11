

import React, { useState, useCallback, useMemo } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { LegalIcon, UploadIcon, ClipboardIcon, SparklesIcon, ChevronDownIcon, ChevronRightIcon, FileTextIcon, BuildReportIcon, FolderUploadIcon, LawCheckerIcon, BuildReportAltIcon, SearchIcon } from '../Icons';
import { LegalAnalysisResult, Clause, Property, ServiceType, UnitStatus } from '../../types';
import { useData } from '../../contexts/DataContext';
import ToggleSwitch from '../ToggleSwitch';
import StatusChip from '../StatusChip';
import RpTag from '../RpTag';
import { useUI } from '../../contexts/UIContext';

// --- GEMINI AI CONFIGURATION ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING, description: 'A one-paragraph summary of the legal document.' },
        documentType: { type: Type.STRING, description: 'The type of document, e.g., "SLA", "Lease", "Tenancy Agreement", "Unknown".' },
        keyTerms: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    term: { type: Type.STRING, description: 'The name of the key term, e.g., "Landlord/Provider", "Start Date", "Rent Amount", "Void Liability".' },
                    value: { type: Type.STRING, description: 'The extracted value for the term. Dates should be YYYY-MM-DD.' },
                },
                propertyOrdering: ["term", "value"],
            },
        },
        clauses: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "A unique kebab-case ID for the clause, e.g., 'repairs-obligation'." },
                    topic: { type: Type.STRING, description: 'The topic of the clause, e.g., "Repairs Obligation", "Termination".' },
                    originalText: { type: Type.STRING, description: 'The full, original text of the clause.' },
                    plainText: { type: Type.STRING, description: 'A simplified version of the clause in plain English.' },
                    extraPlainText: { type: Type.STRING, description: 'An extremely simplified, one-sentence version of the clause.' },
                },
                propertyOrdering: ["id", "topic", "originalText", "plainText", "extraPlainText"],
            },
        },
    },
     propertyOrdering: ["summary", "documentType", "keyTerms", "clauses"],
};

// --- ANALYZER TOOL COMPONENTS ---
const ClauseItem: React.FC<{ clause: Clause }> = ({ clause }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'plain' | 'extra' | 'original'>('plain');
    
    const text = {
        plain: clause.plainText,
        extra: clause.extraPlainText,
        original: clause.originalText,
    };

    return (
        <div className="border-b">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-3 text-left hover:bg-gray-50">
                <span className="font-semibold text-solas-dark">{clause.topic}</span>
                {isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
            </button>
            {isOpen && (
                <div className="p-4 bg-gray-50">
                    <div className="mb-3 flex items-center space-x-2">
                        <button onClick={() => setViewMode('plain')} className={`px-2 py-1 text-xs rounded-md ${viewMode === 'plain' ? 'bg-ivolve-blue text-white' : 'bg-white'}`}>Plain English</button>
                        <button onClick={() => setViewMode('extra')} className={`px-2 py-1 text-xs rounded-md ${viewMode === 'extra' ? 'bg-ivolve-blue text-white' : 'bg-white'}`}>Simplified</button>
                        <button onClick={() => setViewMode('original')} className={`px-2 py-1 text-xs rounded-md ${viewMode === 'original' ? 'bg-ivolve-blue text-white' : 'bg-white'}`}>Original</button>
                    </div>
                    <p className="text-sm text-solas-gray whitespace-pre-wrap">{text[viewMode]}</p>
                </div>
            )}
        </div>
    );
};

const AnalyzerTool: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [documentText, setDocumentText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [analysisResult, setAnalysisResult] = useState<LegalAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeResultTab, setActiveResultTab] = useState<'Summary' | 'Key Terms' | 'Clause Explorer'>('Summary');

    const handleFileRead = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            setDocumentText(text);
        };
        reader.onerror = () => {
            setError("Failed to read the file.");
        };
        reader.readAsText(file);
    };

    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const file = event.dataTransfer.files[0];
        if (file && file.type === 'text/plain') {
            handleFileRead(file);
        } else {
            setError('Please drop a valid .txt file.');
        }
    }, []);

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFileRead(file);
        }
    };
    
    const analyzeDocument = async () => {
        if (!documentText.trim()) {
            setError("Please provide a document to analyze.");
            return;
        }
        setIsLoading(true);
        setError(null);

        const loadingMessages = ["Initializing AI paralegal...","Analyzing document structure...","Identifying key clauses...","Simplifying legal language...","Finalizing your digital summary..."];
        let messageIndex = 0;
        setLoadingMessage(loadingMessages[messageIndex]);
        const interval = setInterval(() => {
            messageIndex = (messageIndex + 1) % loadingMessages.length;
            setLoadingMessage(loadingMessages[messageIndex]);
        }, 2500);

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ parts: [{ text: `Please analyze the following legal document:\n\n${documentText}` }] }],
                config: {
                    systemInstruction: "You are an expert paralegal specializing in UK social housing agreements like Leases and Service Level Agreements (SLAs). Your task is to analyze legal documents, extract key information, identify individual clauses, and simplify their meaning. You must return your analysis in the provided JSON format.",
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                }
            });

            const resultText = response.text;
            const parsedResult: LegalAnalysisResult = JSON.parse(resultText);
            setAnalysisResult(parsedResult);
        } catch (e) {
            console.error(e);
            setError("An error occurred during analysis. The document may be too complex or the AI service is unavailable.");
        } finally {
            setIsLoading(false);
            clearInterval(interval);
        }
    };

    const resetAnalyzer = () => {
        setDocumentText('');
        setAnalysisResult(null);
        setError(null);
        setIsLoading(false);
    };

    const renderInputView = () => (
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-solas-dark">Analyze a Legal Document</h2>
            <p className="mt-2 text-solas-gray">Upload, drop, or paste the content of a legal document (e.g., Lease, SLA) to get a simplified, structured breakdown.</p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                <div 
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-ivolve-blue transition-colors"
                >
                    <UploadIcon />
                    <p className="mt-2 font-semibold text-solas-dark">Drag & Drop a .txt file here</p>
                    <p className="text-xs text-solas-gray">or</p>
                    <label className="mt-2 bg-white border border-gray-300 px-4 py-2 rounded-md text-sm font-semibold cursor-pointer hover:bg-gray-50">
                        Select a file
                        <input type="file" className="hidden" onChange={handleFileChange} accept=".txt" />
                    </label>
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center space-x-2 text-solas-dark">
                        <ClipboardIcon />
                        <label htmlFor="doc_text" className="font-semibold">Paste Document Content</label>
                    </div>
                    <textarea 
                        id="doc_text"
                        value={documentText}
                        onChange={(e) => setDocumentText(e.target.value)}
                        className="mt-2 flex-grow w-full p-3 border border-gray-300 rounded-md focus:ring-ivolve-blue focus:border-ivolve-blue"
                        placeholder="Paste the full text of the legal agreement here..."
                    ></textarea>
                </div>
            </div>
            <div className="mt-6">
                <button
                    onClick={analyzeDocument}
                    disabled={!documentText.trim()}
                    className="inline-flex items-center space-x-2 bg-ivolve-blue text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    <SparklesIcon />
                    <span>Analyze Document</span>
                </button>
            </div>
        </div>
    );

    const renderLoadingView = () => (
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ivolve-blue mx-auto"></div>
            <p className="mt-4 font-semibold text-solas-dark text-lg">{loadingMessage}</p>
        </div>
    );

    const renderResultsView = () => {
        if (!analysisResult) return null;
        return (
            <div className="h-full flex flex-col">
                <header className="flex-shrink-0 flex justify-between items-center pb-4 border-b">
                    <div>
                        <h2 className="text-xl font-bold text-solas-dark">Analysis Complete: <span className="text-ivolve-blue">{analysisResult.documentType}</span></h2>
                    </div>
                    <div className="space-x-2">
                        <button onClick={() => alert("Save functionality coming soon!")} className="bg-ivolve-mid-green text-white font-semibold py-2 px-4 rounded-md">Save Digital Copy</button>
                        <button onClick={resetAnalyzer} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md">Analyze Another</button>
                    </div>
                </header>
                <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 overflow-hidden">
                    <div className="flex flex-col overflow-hidden">
                        <h3 className="text-lg font-bold text-solas-dark mb-2 flex items-center"><FileTextIcon /><span className="ml-2">Original Document</span></h3>
                        <div className="flex-grow bg-white border rounded-md p-3 overflow-y-auto text-xs whitespace-pre-wrap">{documentText}</div>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <div className="flex-shrink-0 border-b">
                            <nav className="-mb-px flex space-x-4">
                                {['Summary', 'Key Terms', 'Clause Explorer'].map(tab => (
                                    <button 
                                        key={tab}
                                        onClick={() => setActiveResultTab(tab as any)}
                                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeResultTab === tab ? 'border-ivolve-blue text-ivolve-dark-green' : 'border-transparent text-solas-gray'}`}
                                    >{tab}</button>
                                ))}
                            </nav>
                        </div>
                        <div className="flex-grow bg-white border rounded-md mt-2 overflow-y-auto">
                           {activeResultTab === 'Summary' && <p className="p-4 text-sm leading-relaxed">{analysisResult.summary}</p>}
                           {activeResultTab === 'Key Terms' && ( <dl>{analysisResult.keyTerms.map(term => (<div key={term.term} className="px-4 py-3 border-b flex justify-between"><dt className="font-semibold text-sm text-solas-dark">{term.term}</dt><dd className="text-sm text-solas-gray text-right">{term.value}</dd></div>))}</dl>)}
                           {activeResultTab === 'Clause Explorer' && (<div>{analysisResult.clauses.map(clause => <ClauseItem key={clause.id} clause={clause} />)}</div>)}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <button onClick={onBack} className="text-ivolve-blue font-semibold mb-4 self-start">&larr; Back to Legal Hub</button>
            <div className="flex-grow flex items-center justify-center">
                {error && <div className="text-center text-red-600 bg-red-100 p-4 rounded-md"><p className="font-bold">Error</p><p>{error}</p><button onClick={resetAnalyzer} className="mt-2 text-sm underline">Try again</button></div>}
                {!error && isLoading && renderLoadingView()}
                {!error && !isLoading && !analysisResult && renderInputView()}
                {!error && !isLoading && analysisResult && renderResultsView()}
            </div>
        </div>
    );
};

// --- DATABASE TOOL COMPONENTS ---
type LegalStatus = { type: 'Lease' | 'SLA'; status: '✅ Present' | '❌ Missing' } | null;
type DatabaseRow = { propertyId: string; address: string; rp: string; serviceType: ServiceType; region: string; legalStatus: LegalStatus; defaultUnitId: string | null };

const getLegalStatus = (property: Property): LegalStatus => {
    const hasLease = property.legalAgreements.some(a => a.type === 'Lease');
    const hasSLA = property.legalAgreements.some(a => a.type === 'SLA');
    if ([ServiceType.Residential, ServiceType.NursingCare].includes(property.serviceType)) {
        return { type: 'Lease', status: hasLease ? '✅ Present' : '❌ Missing' };
    }
    if (property.serviceType === ServiceType.SupportedLiving) {
        return { type: 'SLA', status: hasSLA ? '✅ Present' : '❌ Missing' };
    }
    return null;
};

const LegalStatusTag: React.FC<{ statusInfo: LegalStatus }> = ({ statusInfo }) => {
    if (!statusInfo) return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">N/A</span>;
    const isPresent = statusInfo.status === '✅ Present';
    const text = `${isPresent ? '✅' : '❌'} ${statusInfo.type}`;
    const colorClasses = isPresent ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200';
    return <span className={`px-2 py-1 text-xs font-bold rounded-full ${colorClasses}`}>{text}</span>;
}

const initialFilters = {
    hasLease: false,
    missingLease: false,
    hasSla: false,
    missingSla: false,
    supportedLiving: false,
    residential: false,
    nursingCare: false,
    north: false,
    midlands: false,
    south: false,
    wales: false,
};

const DatabaseTool: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { properties } = useData();
    const { selectProperty } = useUI();
    const [filters, setFilters] = useState(initialFilters);
    const [searchQuery, setSearchQuery] = useState('');

    const databaseRows: DatabaseRow[] = useMemo(() => properties.map(p => {
        const masterUnit = p.units.find(u => u.status === UnitStatus.Master);
        return {
            propertyId: p.id,
            address: `${p.address.line1}, ${p.address.city}, ${p.address.postcode}`,
            rp: p.tags.rp,
            serviceType: p.serviceType,
            region: p.region,
            legalStatus: getLegalStatus(p),
            defaultUnitId: masterUnit?.id ?? p.units[0]?.id ?? null,
        }
    }), [properties]);

    const filteredRows = useMemo(() => {
        const isAnyFilterActive = Object.values(filters).some(v => v);
        const lowerQuery = searchQuery.toLowerCase();

        if (!isAnyFilterActive && !searchQuery) return [];

        return databaseRows.filter(row => {
            const matchesSearch = !searchQuery || row.address.toLowerCase().includes(lowerQuery) || row.propertyId.toLowerCase().includes(lowerQuery) || row.rp.toLowerCase().includes(lowerQuery);
            if (!matchesSearch) return false;
            
            if (!isAnyFilterActive) return true;

            const serviceTypeOk = 
                (!filters.supportedLiving && !filters.residential && !filters.nursingCare) ||
                (filters.supportedLiving && row.serviceType === ServiceType.SupportedLiving) ||
                (filters.residential && row.serviceType === ServiceType.Residential) ||
                (filters.nursingCare && row.serviceType === ServiceType.NursingCare);

            const legalStatusOk = 
                (!filters.hasLease && !filters.missingLease && !filters.hasSla && !filters.missingSla) ||
                (filters.hasLease && row.legalStatus?.type === 'Lease' && row.legalStatus.status === '✅ Present') ||
                (filters.missingLease && row.legalStatus?.type === 'Lease' && row.legalStatus.status === '❌ Missing') ||
                (filters.hasSla && row.legalStatus?.type === 'SLA' && row.legalStatus.status === '✅ Present') ||
                (filters.missingSla && row.legalStatus?.type === 'SLA' && row.legalStatus.status === '❌ Missing');

            const regionOk =
                (!filters.north && !filters.midlands && !filters.south && !filters.wales) ||
                (filters.north && row.region === 'North') ||
                (filters.midlands && row.region === 'Midlands') ||
                (filters.south && (row.region === 'South' || row.region === 'South West')) ||
                (filters.wales && row.region === 'Wales');
                
            return serviceTypeOk && legalStatusOk && regionOk;
        });
    }, [databaseRows, filters, searchQuery]);

    const stats = useMemo(() => {
        const slProps = properties.filter(p => p.serviceType === ServiceType.SupportedLiving);
        const resiProps = properties.filter(p => [ServiceType.Residential, ServiceType.NursingCare].includes(p.serviceType));
        const slaUploaded = slProps.filter(p => getLegalStatus(p)?.status === '✅ Present').length;
        const leaseUploaded = resiProps.filter(p => getLegalStatus(p)?.status === '✅ Present').length;
        return {
            slaTotal: slProps.length,
            slaUploaded,
            leaseTotal: resiProps.length,
            leaseUploaded
        };
    }, [properties]);
    
    return (
        <div className="p-6 h-full flex flex-col">
            <button onClick={onBack} className="text-ivolve-blue font-semibold mb-4 self-start">&larr; Back to Legal Hub</button>
            <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="p-3 bg-white border rounded-lg text-center"><p className="text-2xl font-bold">{stats.slaUploaded} / {stats.slaTotal}</p><p className="text-xs font-semibold text-gray-500">SLAs Uploaded</p></div>
                <div className="p-3 bg-white border rounded-lg text-center"><p className="text-2xl font-bold">{stats.leaseUploaded} / {stats.leaseTotal}</p><p className="text-xs font-semibold text-gray-500">Leases Uploaded</p></div>
                <div className="p-3 bg-white border rounded-lg text-center"><p className="text-2xl font-bold text-gray-400">-</p><p className="text-xs font-semibold text-gray-500">Up for Renewal (Year)</p></div>
                <div className="p-3 bg-white border rounded-lg text-center"><p className="text-2xl font-bold text-gray-400">-</p><p className="text-xs font-semibold text-gray-500">Ending (Year)</p></div>
            </div>
            <div className="bg-white p-4 rounded-lg border mb-4">
                <div className="grid grid-cols-5 gap-4">
                    <div><h4 className="font-bold text-sm mb-2">Legal Status</h4><ToggleSwitch label="Has SLA" enabled={filters.hasSla} onChange={() => setFilters(f=>({...f, hasSla: !f.hasSla}))} /><ToggleSwitch label="Missing SLA" enabled={filters.missingSla} onChange={() => setFilters(f=>({...f, missingSla: !f.missingSla}))} /><ToggleSwitch label="Has Lease" enabled={filters.hasLease} onChange={() => setFilters(f=>({...f, hasLease: !f.hasLease}))} /><ToggleSwitch label="Missing Lease" enabled={filters.missingLease} onChange={() => setFilters(f=>({...f, missingLease: !f.missingLease}))} /></div>
                    <div className="border-l pl-4"><h4 className="font-bold text-sm mb-2">Service Type</h4><ToggleSwitch label="Supported Living" enabled={filters.supportedLiving} onChange={() => setFilters(f=>({...f, supportedLiving: !f.supportedLiving}))} /><ToggleSwitch label="Residential" enabled={filters.residential} onChange={() => setFilters(f=>({...f, residential: !f.residential}))} /><ToggleSwitch label="Nursing Care" enabled={filters.nursingCare} onChange={() => setFilters(f=>({...f, nursingCare: !f.nursingCare}))} /></div>
                    <div className="border-l pl-4"><h4 className="font-bold text-sm mb-2">Region</h4><ToggleSwitch label="North" enabled={filters.north} onChange={() => setFilters(f=>({...f, north: !f.north}))} /><ToggleSwitch label="Midlands" enabled={filters.midlands} onChange={() => setFilters(f=>({...f, midlands: !f.midlands}))} /><ToggleSwitch label="South" enabled={filters.south} onChange={() => setFilters(f=>({...f, south: !f.south}))} /><ToggleSwitch label="Wales" enabled={filters.wales} onChange={() => setFilters(f=>({...f, wales: !f.wales}))} /></div>
                    <div className="col-span-2 border-l pl-4"><h4 className="font-bold text-sm mb-2">Search</h4><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><SearchIcon /></span><input type="search" placeholder="Search by ID, Address, or RP..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-md border-gray-300 text-sm focus:ring-ivolve-blue focus:border-ivolve-blue" /></div></div>
                </div>
            </div>
            <div className="flex-grow bg-white border rounded-lg overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0"><tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <th className="px-4 py-3">Property ID</th><th className="px-4 py-3">Address</th><th className="px-4 py-3">RP</th><th className="px-4 py-3">Service Type</th><th className="px-4 py-3">Region</th><th className="px-4 py-3">Legal Status</th></tr></thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredRows.map(row => (
                        <tr key={row.propertyId} onClick={() => row.defaultUnitId && selectProperty(row.propertyId, row.defaultUnitId)} className="hover:bg-gray-50 cursor-pointer text-sm text-gray-700">
                            <td className="px-4 py-3 font-medium text-ivolve-blue">{row.propertyId.replace('_PROP','')}</td>
                            <td className="px-4 py-3">{row.address}</td>
                            <td className="px-4 py-3"><RpTag name={row.rp} styleType="outline" /></td>
                            <td className="px-4 py-3"><StatusChip status={row.serviceType} styleType="default" /></td>
                            <td className="px-4 py-3">{row.region}</td>
                            <td className="px-4 py-3"><LegalStatusTag statusInfo={row.legalStatus} /></td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                {filteredRows.length === 0 && <p className="text-center p-8 text-gray-500">No properties match the selected filters. Please select a filter to begin.</p>}
            </div>
        </div>
    );
};

// --- MAIN HUB COMPONENT ---
type LegalTool = 'dashboard' | 'analyzer' | 'database' | 'buildReport' | 'buildReportAlt';

const ToolCard: React.FC<{ icon: React.ReactNode; title: string; onClick: () => void; disabled?: boolean }> = ({ icon, title, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled} className="bg-white rounded-lg p-4 text-center flex flex-col items-center justify-center transition-all duration-200 shadow-sm hover:shadow-lg hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
        <div className="w-16 h-16 flex items-center justify-center text-white bg-ivolve-blue rounded-lg">{icon}</div>
        <span className="mt-3 font-semibold text-solas-dark">{title}</span>
    </button>
);

const Dashboard: React.FC<{ setActiveTool: (tool: LegalTool) => void }> = ({ setActiveTool }) => {
    return (
        <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-ivolve-dark-green text-white p-6 rounded-lg">
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

const LegalHubView: React.FC = () => {
    const [activeTool, setActiveTool] = useState<LegalTool>('dashboard');

    const renderActiveTool = () => {
        switch (activeTool) {
            case 'analyzer': return <AnalyzerTool onBack={() => setActiveTool('dashboard')} />;
            case 'database': return <DatabaseTool onBack={() => setActiveTool('dashboard')} />;
            case 'dashboard':
            default: return <Dashboard setActiveTool={setActiveTool} />;
        }
    }

    return (
        <div className="h-full flex flex-col">
            <header className="bg-app-header text-app-header-text p-4 shadow-md z-10">
                <div className="flex items-center space-x-4">
                    <LegalIcon />
                    <h1 className="text-3xl font-bold tracking-wider">LEGAL HUB</h1>
                </div>
            </header>
            <main className="flex-grow bg-gray-50 overflow-y-auto">
                {renderActiveTool()}
            </main>
        </div>
    );
};

export default LegalHubView;
