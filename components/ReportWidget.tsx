import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import Card from './Card';
import ReportRenderer from './ReportRenderer';
import { useData } from '../../contexts/DataContext';
import { processReportData } from './views/ReportsView';
import { AiReportDefinition, ReportData, CustomWidget, Property, MaintenanceJob, Person, PropertyUnitRow } from '../../types';
import { SparklesIcon } from './Icons';
import { reportResponseSchema } from './views/ReportsView';

type ReportWidgetProps = {
    widget: CustomWidget;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    onRemove: () => void;
};

// Memoized analysis function to avoid re-running the same AI query unnecessarily
const memoizedAnalyze = (() => {
    const cache = new Map<string, Promise<AiReportDefinition | null>>();
    
    return (query: string): Promise<AiReportDefinition | null> => {
        if (cache.has(query)) {
            return cache.get(query)!;
        }

        const promise = (async () => {
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
                return JSON.parse(response.text) as AiReportDefinition;
            } catch (e) {
                console.error("Failed to parse AI response for widget:", e);
                cache.delete(query);
                throw new Error("AI response was not valid JSON.");
            }
        })();
        
        promise.catch(err => {
            console.error("AI analysis failed for widget:", err);
            cache.delete(query);
        });

        cache.set(query, promise);
        return promise;
    };
})();

const ReportWidget: React.FC<ReportWidgetProps> = ({ widget, isCollapsed, onToggleCollapse, onRemove }) => {
    const { properties, people } = useData();
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const allMaintenanceJobs = React.useMemo(() => 
        properties.flatMap(p => 
            p.maintenanceJobs.map(job => ({ ...job, property: p }))
        )
    , [properties]);

    const allUnits = React.useMemo(() =>
        properties.flatMap(prop =>
            prop.units.map(unit => ({
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
            }))
        )
    , [properties]);

    useEffect(() => {
        let isMounted = true;
        
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const definition = await memoizedAnalyze(widget.query);
                if (isMounted && definition) {
                    const results = processReportData(definition, allUnits, allMaintenanceJobs);
                    setReportData({ definition, results });
                } else if (isMounted) {
                    setError("Could not generate report definition.");
                }
            } catch (err) {
                if (isMounted) {
                    setError("Failed to generate report.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        return () => { isMounted = false; };
    }, [widget.query, allUnits, allMaintenanceJobs]);
    
    const cardTitle = (
        <div className="flex items-center space-x-2">
            <span className="text-ivolve-blue"><SparklesIcon /></span>
            <h3 className="text-xl font-semibold">{widget.title}</h3>
        </div>
    );

    return (
        <Card
            title={cardTitle}
            isCollapsible
            isCollapsed={isCollapsed}
            onToggleCollapse={onToggleCollapse}
            onRemove={onRemove}
            className="border-2 border-brand-dark-green"
            titleClassName="bg-brand-dark-green text-white"
        >
            {isLoading && <p className="text-sm text-gray-500">Loading report...</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}
            {reportData && (
                <ReportRenderer data={reportData} isWidget={true} />
            )}
        </Card>
    );
};

export default ReportWidget;