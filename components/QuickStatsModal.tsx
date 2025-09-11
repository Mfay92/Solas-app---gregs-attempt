import React, { useState, useMemo } from 'react';
import { Property, Person, UnitStatus } from '../types';
import Modal from './Modal';
import ToggleSwitch from './ToggleSwitch';

type Timeframe = 'W' | 'M' | 'Q' | 'Y';

type QuickStatsModalProps = {
    properties: Property[];
    people: Person[];
    onClose: () => void;
};

const getStartDate = (timeframe: Timeframe): Date => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    switch (timeframe) {
        case 'W':
            const firstDay = new Date(now);
            firstDay.setDate(now.getDate() - now.getDay());
            return firstDay;
        case 'M':
            return new Date(now.getFullYear(), now.getMonth(), 1);
        case 'Q':
            const quarter = Math.floor(now.getMonth() / 3);
            return new Date(now.getFullYear(), quarter * 3, 1);
        case 'Y':
            return new Date(now.getFullYear(), 0, 1);
    }
};

const calculateStatsForTimeframe = (properties: Property[], people: Person[], timeframe: Timeframe) => {
    const startDate = getStartDate(timeframe);
    
    // General
    const newHandovers = properties.filter(p => new Date(p.handoverDate) >= startDate).length;
    const newHandbacks = properties.filter(p => p.handbackDate && new Date(p.handbackDate) >= startDate).length;
    const totalUnitsInMgmt = properties.flatMap(p => p.units.filter(u => u.status !== UnitStatus.OutOfManagement)).length;
    const totalPeopleSupported = people.filter(p => p.status === 'Current').length;

    // Voids
    const currentVoids = properties.flatMap(p => p.units).filter(u => u.status === UnitStatus.Void).length;
    const newVoids = people.filter(p => p.moveOutDate && new Date(p.moveOutDate) >= startDate).length;
    const voidsFilled = people.filter(p => new Date(p.moveInDate) >= startDate).length;

    // RPs
    const rps = [...new Set(properties.map(p => p.tags.rp))];
    const rpStats = rps.map(rpName => {
        const rpProps = properties.filter(p => p.tags.rp === rpName);
        const totalUnits = rpProps.flatMap(p => p.units).length;
        const voidUnits = rpProps.flatMap(p => p.units).filter(u => u.status === UnitStatus.Void).length;
        const occupancy = totalUnits > 0 ? ((totalUnits - voidUnits) / totalUnits * 100) : 100;
        return {
            name: rpName,
            properties: rpProps.length,
            units: totalUnits,
            voids: voidUnits,
            occupancy: occupancy.toFixed(1) + '%',
        };
    }).sort((a,b) => b.properties - a.properties);

    // Occupancy
    const totalOccupiableUnits = properties.flatMap(p => p.units).filter(u => [UnitStatus.Occupied, UnitStatus.Void].includes(u.status)).length;
    const occupiedUnits = properties.flatMap(p => p.units).filter(u => u.status === UnitStatus.Occupied).length;
    const occupancyRate = totalOccupiableUnits > 0 ? (occupiedUnits / totalOccupiableUnits * 100).toFixed(1) + '%' : '100%';

    return {
        newHandovers, newHandbacks, totalUnitsInMgmt, totalPeopleSupported,
        currentVoids, newVoids, voidsFilled,
        rpStats,
        newMoveIns: voidsFilled, // Same logic as voids filled
        moveOuts: newVoids, // Same logic as new voids
        occupancyRate,
    };
};

const QuickStatsModal: React.FC<QuickStatsModalProps> = ({ properties, people, onClose }) => {
    const TABS = ['General', 'Voids', 'Registered Providers', 'Occupancy'];
    const TIMEFRAMES: { key: Timeframe, label: string }[] = [
        { key: 'W', label: 'This Week' },
        { key: 'M', label: 'This Month' },
        { key: 'Q', label: 'This Quarter' },
        { key: 'Y', label: 'This Year' },
    ];

    const [activeTab, setActiveTab] = useState(TABS[0]);
    const [timeframe, setTimeframe] = useState<Timeframe>('M');
    const [isExpanded, setIsExpanded] = useState(false);

    const statsByTimeframe = useMemo(() => {
        const results: { [key in Timeframe]?: ReturnType<typeof calculateStatsForTimeframe> } = {};
        for (const tf of TIMEFRAMES) {
            results[tf.key] = calculateStatsForTimeframe(properties, people, tf.key);
        }
        return results;
    }, [properties, people]);

    const currentStats = statsByTimeframe[timeframe];

    const StatCard: React.FC<{ title: string, value: string | number }> = ({ title, value }) => (
        <div className="p-4 bg-gray-50 border rounded-lg text-center">
            <p className="text-3xl font-bold text-ivolve-blue">{value}</p>
            <p className="text-sm font-semibold text-gray-500 mt-1">{title}</p>
        </div>
    );
    
    const renderContent = () => {
        if (!currentStats) return null;
        if (isExpanded) {
            const renderTable = (headers: string[], dataRows: (string | number)[][]) => (
                 <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                        <tr>
                            <th className="p-2">Metric</th>
                            {TIMEFRAMES.map(tf => <th key={tf.key} className="p-2 text-center">{tf.label}</th>)}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {dataRows.map((row, index) => (
                            <tr key={index}>
                                <td className="p-2 font-semibold text-gray-800">{headers[index]}</td>
                                {row.map((val, i) => <td key={i} className="p-2 text-center">{val}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
            switch(activeTab) {
                case 'General': return renderTable(
                    ['New Handovers', 'New Handbacks', 'Total Units in Mgmt', 'Total People Supported'],
                    [
                        TIMEFRAMES.map(tf => statsByTimeframe[tf.key]!.newHandovers),
                        TIMEFRAMES.map(tf => statsByTimeframe[tf.key]!.newHandbacks),
                        TIMEFRAMES.map(tf => statsByTimeframe[tf.key]!.totalUnitsInMgmt),
                        TIMEFRAMES.map(tf => statsByTimeframe[tf.key]!.totalPeopleSupported),
                    ]
                );
                case 'Voids': return renderTable(
                    ['Current Voids', 'New Voids in Period', 'Voids Filled in Period'],
                    [
                        TIMEFRAMES.map(tf => statsByTimeframe[tf.key]!.currentVoids),
                        TIMEFRAMES.map(tf => statsByTimeframe[tf.key]!.newVoids),
                        TIMEFRAMES.map(tf => statsByTimeframe[tf.key]!.voidsFilled),
                    ]
                );
                case 'Occupancy': return renderTable(
                     ['New Move-ins', 'Move-outs', 'Occupancy Rate'],
                    [
                        TIMEFRAMES.map(tf => statsByTimeframe[tf.key]!.newMoveIns),
                        TIMEFRAMES.map(tf => statsByTimeframe[tf.key]!.moveOuts),
                        TIMEFRAMES.map(tf => statsByTimeframe[tf.key]!.occupancyRate),
                    ]
                );
                case 'Registered Providers': return <p className="text-sm text-gray-500 p-4">Expanded view for Registered Providers is not available.</p>;
            }
        }

        switch (activeTab) {
            case 'General': return (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard title="New Handovers" value={currentStats.newHandovers} />
                    <StatCard title="New Handbacks" value={currentStats.newHandbacks} />
                    <StatCard title="Total Units in Mgmt" value={currentStats.totalUnitsInMgmt} />
                    <StatCard title="Total People Supported" value={currentStats.totalPeopleSupported} />
                </div>
            );
             case 'Voids': return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard title="Current Voids" value={currentStats.currentVoids} />
                    <StatCard title="New Voids in Period" value={currentStats.newVoids} />
                    <StatCard title="Voids Filled in Period" value={currentStats.voidsFilled} />
                </div>
            );
            case 'Registered Providers': return (
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                        <tr>
                            <th className="p-2">RP Name</th>
                            <th className="p-2 text-center">Properties</th>
                            <th className="p-2 text-center">Units</th>
                            <th className="p-2 text-center">Voids</th>
                            <th className="p-2 text-center">Occupancy</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {currentStats.rpStats.map(rp => (
                            <tr key={rp.name}>
                                <td className="p-2 font-semibold text-gray-800">{rp.name}</td>
                                <td className="p-2 text-center">{rp.properties}</td>
                                <td className="p-2 text-center">{rp.units}</td>
                                <td className="p-2 text-center">{rp.voids}</td>
                                <td className="p-2 text-center font-bold">{rp.occupancy}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
             case 'Occupancy': return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard title="New Move-ins" value={currentStats.newMoveIns} />
                    <StatCard title="Move-outs" value={currentStats.moveOuts} />
                    <StatCard title="Occupancy Rate" value={currentStats.occupancyRate} />
                </div>
            );
        }
        return null;
    };
    
    return (
        <Modal title="Quick Statistics" onClose={onClose} className="max-w-6xl">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`${activeTab === tab ? 'border-ivolve-blue text-ivolve-blue' : 'border-transparent text-gray-500 hover:text-gray-700'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="my-4 p-3 bg-gray-50 rounded-md flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-700">Timeframe:</span>
                    {TIMEFRAMES.map(tf => (
                         <button
                            key={tf.key}
                            onClick={() => setTimeframe(tf.key)}
                            className={`px-3 py-1 text-xs font-bold rounded-full ${timeframe === tf.key ? 'bg-ivolve-blue text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
                         >
                            {tf.label}
                         </button>
                    ))}
                </div>
                 {activeTab !== 'Registered Providers' && (
                     <ToggleSwitch
                        label="Expand table"
                        enabled={isExpanded}
                        onChange={setIsExpanded}
                        labelClassName="text-gray-700"
                    />
                 )}
            </div>
            <div className="mt-4 min-h-[200px]">
                {renderContent()}
            </div>
        </Modal>
    );
};

export default QuickStatsModal;