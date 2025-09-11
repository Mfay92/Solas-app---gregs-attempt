import React from 'react';
import { ReportData, PropertyUnitRow, UnitStatus, MaintenanceJob, Property } from '../types';
import UnitStatusTag from './UnitStatusTag';
import RpTag from './RpTag';

type GroupedData = {
    group: string;
    items: PropertyUnitRow[] | (MaintenanceJob & { property: Property })[];
};

type ReportRendererProps = {
    data: ReportData;
    isWidget?: boolean;
};

const KpiCard: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
    <div className="p-4 bg-gray-50 border rounded-lg text-center">
        <p className="text-4xl font-bold text-ivolve-blue">{value}</p>
        <p className="text-sm font-semibold text-gray-500 mt-1">{title}</p>
    </div>
);

const ReportRenderer: React.FC<ReportRendererProps> = ({ data, isWidget = false }) => {
    const { definition, results } = data;
    const { displayType, entityType } = definition;

    if (displayType === 'KPI') {
        return <KpiCard title={definition.summary} value={results} />;
    }

    if (displayType === 'LIST') {
        if (entityType === 'UNITS' && results.length > 0) {
            const units = results as PropertyUnitRow[];
            return (
                <div className="overflow-x-auto max-h-96">
                    {!isWidget && <p className="text-sm text-gray-600 mb-4">{definition.summary}</p>}
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 text-left">Unit ID</th>
                                <th className="p-2 text-left">Address</th>
                                <th className="p-2 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {units.map((unit: PropertyUnitRow) => (
                                <tr key={unit.unitId}>
                                    <td className="p-2 font-medium">{unit.unitId}</td>
                                    <td className="p-2 text-gray-600">{unit.fullAddress}</td>
                                    <td className="p-2"><UnitStatusTag status={unit.status} styleType="default" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }
        // Add renderer for MAINTENANCE_JOBS LIST here if needed
    }

    if (displayType === 'GROUPED_LIST') {
         if (results.length > 0) {
            const groupedData = results as GroupedData[];
            return (
                 <div className="space-y-4 max-h-96 overflow-y-auto">
                    {!isWidget && <p className="text-sm text-gray-600 mb-4">{definition.summary}</p>}
                    {groupedData.map(group => (
                        <div key={group.group}>
                            <h4 className="font-bold bg-gray-100 p-2 rounded-t-md border-b">
                                {group.group} ({group.items.length})
                            </h4>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <tbody className="divide-y divide-gray-200">
                                       {(group.items as PropertyUnitRow[]).map(item => (
                                            <tr key={item.unitId}>
                                                <td className="p-2 font-medium">{item.unitId}</td>
                                                <td className="p-2 text-gray-600">{item.fullAddress}</td>
                                                <td className="p-2"><RpTag name={item.rp} styleType="outline" /></td>
                                            </tr>
                                       ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            )
         }
    }

    return (
        <div className="text-center p-8 bg-gray-50 rounded-md">
            <p className="font-semibold">{definition.title}</p>
            <p className="text-sm text-gray-600 mt-2">{definition.summary}</p>
            <p className="text-lg font-bold text-ivolve-blue mt-4">No results found for this report.</p>
        </div>
    );
};

export default ReportRenderer;
