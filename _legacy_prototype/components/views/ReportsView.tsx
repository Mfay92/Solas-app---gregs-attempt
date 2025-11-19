import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ReportsCenterIcon, SparklesIcon } from '../Icons';
import { AiReportDefinition, ReportData, PropertyUnitRow, UnitStatus, MaintenanceStatus, MaintenanceJob, Property, CustomWidget } from '../../types';
import ReportRenderer from '../ReportRenderer';
import { useData } from '../../contexts/DataContext';
import * as storage from '../../services/storage';
import Modal from '../Modal';

// FIX: Export reportResponseSchema so it can be used in other components like ReportWidget.
export const reportResponseSchema = {
    type: 'OBJECT',
    properties: {
        title: { type: 'STRING', description: "A concise, professional title for the report based on the user's query." },
        summary: { type: 'STRING', description: "A one-sentence summary explaining what the report shows." },
        displayType: { type: 'STRING', enum: ['LIST', 'GROUPED_LIST', 'KPI'], description: "The best way to visualize the data. Use 'KPI' for single-number answers (like a count), 'GROUPED_LIST' if the user asks to group or break down data, and 'LIST' for all other requests for lists of items." },
        entityType: { type: 'STRING', enum: ['UNITS', 'MAINTENANCE_JOBS'], description: "The primary type of data being reported on. 'UNITS' for properties/units, 'MAINTENANCE_JOBS' for repairs." },
        filters: {
            type: 'OBJECT',
            properties: {
                searchText: { type: 'STRING' },
                serviceTypes: { type: 'ARRAY', items: { type: 'STRING', enum: ['Supported Living', 'Residential', 'Nursing Care'] } },
                unitStatuses: { type: 'ARRAY', items: { type: 'STRING', enum: ['Occupied', 'Void', 'Master', 'Unavailable', 'Out of Management', 'Staff Space'] } },
                regions: { type: 'ARRAY', items: { type: 'STRING', enum: ['North', 'Midlands', 'South', 'South West', 'Wales'] } },
                rp: { type: 'ARRAY', items: { type: 'STRING' } },
                isOverdue: { type: 'BOOLEAN', description: "Set to true if the query mentions 'overdue' or 'late' jobs." },
                priorities: { type: 'ARRAY', items: { type: 'STRING', enum: ['High', 'Medium', 'Low'] } }
            },
        },
        groupBy: { type: 'STRING', enum: ['region', 'serviceType', 'tags.rp', 'status', 'legalEntity', 'priority'], description: "The field to group the results by. Only use if displayType is 'GROUPED_LIST'." },
        kpiMetric: { type: 'STRING', enum: ['COUNT'], description: "The metric for the KPI. Only use if displayType is 'KPI'." },
    },
    propertyOrdering: ["title", "summary", "displayType", "entityType", "filters", "groupBy", "kpiMetric"],
};

const analyzeReportQuery = async (query: string): Promise<AiReportDefinition | null> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ parts: [{ text: `Generate a report definition for the query: "${query}"` }] }],
            config: {
                systemInstruction: "You are a data analyst for a social housing database. Your task is to interpret a user's natural language query and convert it into a structured JSON object that defines a report. This JSON must conform to the provided schema. The report title and summary should be professional and accurately reflect the query.",
                responseMimeType: "application/json",
                responseSchema: reportResponseSchema,
            }
        });
        const resultText = response.text;
        return JSON.parse(resultText) as AiReportDefinition;
    } catch (e) {
        console.error("AI Report Analysis Error:", e);
        return null;
    }
};

export const processReportData = (definition: AiReportDefinition, allUnits: (PropertyUnitRow & { property: Property })[], allMaintenanceJobs: (MaintenanceJob & { property: Property })[]): any => {
    const { entityType, filters, displayType, kpiMetric, groupBy } = definition;

    let data: any[] = entityType === 'UNITS' ? allUnits : allMaintenanceJobs;

    // Apply filters
    if (filters) {
        if (filters.unitStatuses?.length) {
            data = data.filter(item => 'status' in item && filters.unitStatuses!.includes(item.status));
        }
        if (filters.regions?.length) {
            data = data.filter(item => filters.regions!.includes(item.property.region));
        }
        if (filters.serviceTypes?.length) {
            data = data.filter(item => filters.serviceTypes!.includes(item.property.serviceType));
        }
        if (filters.rp?.length) {
            data = data.filter(item => filters.rp!.includes(item.property.tags.rp));
        }
        if (filters.isOverdue) {
            data = data.filter(item => 'slaDueDate' in item && new Date(item.slaDueDate) < new Date() && item.status !== MaintenanceStatus.Completed && item.status !== MaintenanceStatus.Closed);
        }
        if(filters.priorities?.length) {
            data = data.filter(item => 'priority' in item && filters.priorities!.includes(item.priority));
        }
    }

    if (displayType === 'KPI' && kpiMetric === 'COUNT') {
        return data.length;
    }

    if (displayType === 'GROUPED_LIST' && groupBy) {
        return Object.entries(
            data.reduce((acc, item) => {
                let key: string;
                 if (groupBy === 'tags.rp') {
                    key = item.property.tags.rp;
                } else if (groupBy in item) {
                    key = item[groupBy as keyof typeof item] as string;
                } else {
                    key = item.property[groupBy as keyof Property] as string;
                }
                if (!acc[key]) acc[key] = [];
                acc[key].push(item);
                return acc;
            }, {} as Record<string, any[]>)
        ).map(([group, items]) => ({ group, items }));
    }

    return data;
};


const ReportsView: React.FC = () => {
    const { properties } = useData();
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [widgetTitle, setWidgetTitle] = useState('');
    
    const allMaintenanceJobs = useMemo(() => properties.flatMap(p => p.maintenanceJobs.map(j => ({ ...j, property: p }))), [properties]);
    const allUnits = useMemo(() => properties.flatMap(prop => prop.units.map(unit => ({
        propertyId: prop.id,
        unitId: unit.id,
        unitName: unit.name,
        fullAddress: `${prop.address.line1}, ${prop.address.city}, ${prop.address.postcode}`,
        rp: prop.tags.rp,
        legalEntity: prop.legalEntity,
        serviceType: prop.serviceType,
        status: unit.status,
        region: prop.region,
        handoverDate: new Date(prop.handoverDate).toLocaleDateString('en-GB'),
        handbackDate: prop.handbackDate,
        attention: unit.attention,
        property: prop,
    }))), [properties]);


    const handleGenerateReport = async () => {
        if (!query.trim()) return;
        setIsLoading(true);
        setError(null);
        setReportData(null);

        const definition = await analyzeReportQuery(query);
        if (definition) {
            const results = processReportData(definition, allUnits, allMaintenanceJobs);
            setReportData({ definition, results });
            setWidgetTitle(definition.title);
        } else {
            setError("Sorry, I couldn't understand that request. Please try rephrasing it.");
        }
        setIsLoading(false);
    };
    
    const handleSaveWidget = () => {
        if (!widgetTitle.trim() || !reportData) return;
        const customWidgets = storage.loadCustomWidgets();
        const newWidget: CustomWidget = {
            id: `custom-${Date.now()}`,
            title: widgetTitle.trim(),
            query: query,
        };
        storage.saveCustomWidgets([...customWidgets, newWidget]);
        setIsSaveModalOpen(false);
        setReportData(null);
        setQuery('');
    };

    return (
        <div className="h-full flex flex-col">
             {isSaveModalOpen && (
                <Modal title="Save Report as Widget" onClose={() => setIsSaveModalOpen(false)}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="widget-title" className="block text-sm font-medium text-gray-700">Widget Title</label>
                            <input
                                type="text"
                                id="widget-title"
                                value={widgetTitle}
                                onChange={(e) => setWidgetTitle(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ivolve-blue focus:border-ivolve-blue"
                            />
                        </div>
                        <p className="text-xs text-gray-500">This widget will appear in the "Add Widget" panel on your dashboard.</p>
                        <div className="pt-2 flex justify-end space-x-3">
                            <button onClick={() => setIsSaveModalOpen(false)} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md">Cancel</button>
                            <button onClick={handleSaveWidget} disabled={!widgetTitle.trim()} className="bg-ivolve-blue text-white font-semibold py-2 px-4 rounded-md disabled:bg-gray-400">Save Widget</button>
                        </div>
                    </div>
                </Modal>
            )}
            <header className="bg-app-header text-app-header-text p-4 shadow-md z-10">
                <div className="flex items-center space-x-4">
                    <ReportsCenterIcon />
                    <h1 className="text-3xl font-bold tracking-wider">REPORTS CENTER</h1>
                </div>
            </header>
            <main className="flex-grow overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto">
                    {reportData ? (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                               <h2 className="text-2xl font-bold text-solas-dark">{reportData.definition.title}</h2>
                                <div className="space-x-2">
                                    <button onClick={() => setIsSaveModalOpen(true)} className="bg-ivolve-mid-green text-white font-semibold py-2 px-4 rounded-md">Save as Widget</button>
                                    <button onClick={() => setReportData(null)} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md">New Report</button>
                                </div>
                            </div>
                            <div className="p-4 bg-white border rounded-lg shadow-sm">
                                <ReportRenderer data={reportData} />
                            </div>
                        </div>
                    ) : (
                         <div className="text-center">
                            <SparklesIcon className="mx-auto h-12 w-12 text-ivolve-blue" />
                            <h2 className="mt-2 text-2xl font-bold text-solas-dark">AI-Powered Reporting Assistant</h2>
                            <p className="mt-2 max-w-2xl mx-auto text-solas-gray">
                                Ask for the data you need in plain English. The AI will generate a report for you.
                            </p>
                            <form onSubmit={(e) => { e.preventDefault(); handleGenerateReport(); }} className="mt-6 max-w-2xl mx-auto flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="e.g., Show me all high priority overdue jobs"
                                    className="flex-grow w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-ivolve-blue focus:border-ivolve-blue"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !query.trim()}
                                    className="bg-ivolve-blue text-white font-bold py-3 px-6 rounded-md hover:bg-opacity-90 disabled:bg-gray-400"
                                >
                                    {isLoading ? 'Generating...' : 'Generate'}
                                </button>
                            </form>
                            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                             <div className="mt-8 text-left text-sm text-gray-500 bg-gray-50 p-4 rounded-lg border">
                                <h4 className="font-semibold text-gray-700 mb-2">Some ideas to get you started:</h4>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Show me all void units in the North, grouped by RP</li>
                                    <li>How many high priority maintenance jobs are there?</li>
                                    <li>List all properties for Inclusion Housing</li>
                                    <li>Count of overdue maintenance jobs</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ReportsView;