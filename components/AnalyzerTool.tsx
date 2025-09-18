import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { LegalAnalysisResult, Clause } from '../types';
import { UploadIcon, ClipboardIcon, SparklesIcon, ChevronDownIcon, ChevronRightIcon, FileTextIcon } from './Icons';

// --- GEMINI AI CONFIGURATION ---
const responseSchema = {
    type: 'OBJECT',
    properties: {
        summary: { type: 'STRING', description: 'A one-paragraph summary of the legal document.' },
        documentType: { type: 'STRING', description: 'The type of document, e.g., "SLA", "Lease", "Tenancy Agreement", "Unknown".' },
        keyTerms: {
            type: 'ARRAY',
            items: {
                type: 'OBJECT',
                properties: {
                    term: { type: 'STRING', description: 'The name of the key term, e.g., "Landlord/Provider", "Start Date", "Rent Amount", "Void Liability".' },
                    value: { type: 'STRING', description: 'The extracted value for the term. Dates should be YYYY-MM-DD.' },
                },
                propertyOrdering: ["term", "value"],
            },
        },
        clauses: {
            type: 'ARRAY',
            items: {
                type: 'OBJECT',
                properties: {
                    id: { type: 'STRING', description: "A unique kebab-case ID for the clause, e.g., 'repairs-obligation'." },
                    topic: { type: 'STRING', description: 'The topic of the clause, e.g., "Repairs Obligation", "Termination".' },
                    originalText: { type: 'STRING', description: 'The full, original text of the clause.' },
                    plainText: { type: 'STRING', description: 'A simplified version of the clause in plain English.' },
                    extraPlainText: { type: 'STRING', description: 'An extremely simplified, one-sentence version of the clause.' },
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
                        <button onClick={() => setViewMode('plain')} className={`px-2 py-1 text-xs rounded-md ${viewMode === 'plain' ? 'bg-brand-blue text-white' : 'bg-white'}`}>Plain English</button>
                        <button onClick={() => setViewMode('extra')} className={`px-2 py-1 text-xs rounded-md ${viewMode === 'extra' ? 'bg-brand-blue text-white' : 'bg-white'}`}>Simplified</button>
                        <button onClick={() => setViewMode('original')} className={`px-2 py-1 text-xs rounded-md ${viewMode === 'original' ? 'bg-brand-blue text-white' : 'bg-white'}`}>Original</button>
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
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
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
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-brand-blue transition-colors"
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
                        className="mt-2 flex-grow w-full p-3 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                        placeholder="Paste the full text of the legal agreement here..."
                    ></textarea>
                </div>
            </div>
            <div className="mt-6">
                <button
                    onClick={analyzeDocument}
                    disabled={!documentText.trim()}
                    className="inline-flex items-center space-x-2 bg-brand-blue text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    <SparklesIcon />
                    <span>Analyze Document</span>
                </button>
            </div>
        </div>
    );

    const renderLoadingView = () => (
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto"></div>
            <p className="mt-4 font-semibold text-solas-dark text-lg">{loadingMessage}</p>
        </div>
    );

    const renderResultsView = () => {
        if (!analysisResult) return null;
        return (
            <div className="h-full flex flex-col">
                <header className="flex-shrink-0 flex justify-between items-center pb-4 border-b">
                    <div>
                        <h2 className="text-xl font-bold text-solas-dark">Analysis Complete: <span className="text-brand-blue">{analysisResult.documentType}</span></h2>
                    </div>
                    <div className="space-x-2">
                        <button onClick={() => alert("Save functionality coming soon!")} className="bg-brand-mid-green text-white font-semibold py-2 px-4 rounded-md">Save Digital Copy</button>
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
                                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeResultTab === tab ? 'border-brand-blue text-solas-dark' : 'border-transparent text-solas-gray'}`}
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
            <button onClick={onBack} className="text-brand-blue font-semibold mb-4 self-start">&larr; Back to Legal Hub</button>
            <div className="flex-grow flex items-center justify-center">
                {error && <div className="text-center text-red-600 bg-red-100 p-4 rounded-md"><p className="font-bold">Error</p><p>{error}</p><button onClick={resetAnalyzer} className="mt-2 text-sm underline">Try again</button></div>}
                {!error && isLoading && renderLoadingView()}
                {!error && !isLoading && !analysisResult && renderInputView()}
                {!error && !isLoading && analysisResult && renderResultsView()}
            </div>
        </div>
    );
};

export default AnalyzerTool;