import React, { useState } from 'react';
import { Settings, Plus, X, TrendingUp, TrendingDown } from 'lucide-react';

type FormatType = 'number' | 'percentage' | 'currency';
type CurrencyType = 'GBP' | 'USD' | 'EUR';

interface NumberValue {
    id: string;
    label: string;
    value: number;
    format: FormatType;
    currency: CurrencyType;
    showTrend: boolean;
    trendValue: number;
}

interface NumbersWidgetProps {
    w?: number;
    h?: number;
}

const DEFAULT_VALUES: NumberValue[] = [
    {
        id: '1',
        label: 'Total Revenue',
        value: 124500,
        format: 'currency',
        currency: 'GBP',
        showTrend: true,
        trendValue: 12.5,
    },
];

const formatNumber = (value: number, format: FormatType, currency: CurrencyType): string => {
    switch (format) {
        case 'currency':
            const symbols: Record<CurrencyType, string> = { GBP: '£', USD: '$', EUR: '€' };
            return `${symbols[currency]}${value.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
        case 'percentage':
            return `${value.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}%`;
        default:
            return value.toLocaleString('en-GB');
    }
};

export const NumbersWidget: React.FC<NumbersWidgetProps> = ({ w = 4, h = 4 }) => {
    const [values, setValues] = useState<NumberValue[]>(DEFAULT_VALUES);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const addValue = () => {
        if (values.length >= 5) return;
        const newValue: NumberValue = {
            id: Date.now().toString(),
            label: 'New Value',
            value: 0,
            format: 'number',
            currency: 'GBP',
            showTrend: false,
            trendValue: 0,
        };
        setValues([...values, newValue]);
        setEditingId(newValue.id);
    };

    const removeValue = (id: string) => {
        if (values.length <= 1) return;
        setValues(values.filter(v => v.id !== id));
        if (editingId === id) setEditingId(null);
    };

    const updateValue = (id: string, updates: Partial<NumberValue>) => {
        setValues(values.map(v => v.id === id ? { ...v, ...updates } : v));
    };

    // Responsive layout logic
    const isCompact = w <= 2;
    const isWide = w >= 5;
    const isTall = h >= 4;
    const showMultiColumn = isWide && values.length > 1;

    // Determine grid layout
    const getGridClass = () => {
        if (values.length === 1) return 'grid-cols-1';
        if (showMultiColumn) {
            if (values.length === 2) return 'grid-cols-2';
            if (values.length <= 4) return 'grid-cols-2';
            return 'grid-cols-3';
        }
        return 'grid-cols-1';
    };

    // Value size based on widget size and number of values
    const getValueSize = () => {
        if (isCompact) return 'text-2xl';
        if (values.length === 1) return 'text-4xl';
        if (values.length <= 2 && isTall) return 'text-3xl';
        return 'text-2xl';
    };

    const getLabelSize = () => {
        if (isCompact) return 'text-xs';
        if (values.length === 1) return 'text-sm';
        return 'text-xs';
    };

    return (
        <div className="h-full flex flex-col relative">
            {/* Settings Button */}
            <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="absolute top-0 right-0 p-1.5 text-slate-400 hover:text-ivolve-mid hover:bg-slate-100 rounded-full transition-colors z-10"
                aria-label="Widget settings"
            >
                <Settings size={16} />
            </button>

            {/* Main Content */}
            <div className={`flex-1 grid ${getGridClass()} gap-3 items-center justify-center p-2`}>
                {values.map((item, index) => (
                    <div
                        key={item.id}
                        className={`flex flex-col items-center justify-center text-center px-2 py-1 ${
                            index > 0 && !showMultiColumn ? 'border-t border-slate-200 pt-3' : ''
                        } ${index > 0 && showMultiColumn && index % 2 === 0 ? 'border-t border-slate-200 pt-2' : ''}`}
                    >
                        <span className={`${getLabelSize()} text-slate-500 font-medium truncate max-w-full`}>
                            {item.label}
                        </span>
                        <span className={`${getValueSize()} font-bold text-slate-800 tabular-nums`}>
                            {formatNumber(item.value, item.format, item.currency)}
                        </span>
                        {item.showTrend && (
                            <span className={`text-xs font-medium flex items-center gap-0.5 ${
                                item.trendValue >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {item.trendValue >= 0 ? (
                                    <TrendingUp size={12} />
                                ) : (
                                    <TrendingDown size={12} />
                                )}
                                {item.trendValue >= 0 ? '+' : ''}{item.trendValue}%
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* Add Value Button */}
            {values.length < 5 && !settingsOpen && (
                <button
                    onClick={addValue}
                    className="flex items-center justify-center gap-1 text-xs text-slate-400 hover:text-ivolve-mid py-1 transition-colors"
                >
                    <Plus size={12} />
                    Add another
                </button>
            )}

            {/* Settings Panel */}
            {settingsOpen && (
                <div className="absolute inset-0 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden flex flex-col z-20">
                    <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200">
                        <span className="text-sm font-bold text-slate-700">Settings</span>
                        <button
                            onClick={() => {
                                setSettingsOpen(false);
                                setEditingId(null);
                            }}
                            className="p-1 hover:bg-slate-200 rounded-full transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                        {values.map((item, index) => (
                            <div
                                key={item.id}
                                className={`p-2 rounded-lg border transition-colors ${
                                    editingId === item.id ? 'border-ivolve-mid bg-green-50/30' : 'border-slate-200 hover:border-slate-300'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <button
                                        onClick={() => setEditingId(editingId === item.id ? null : item.id)}
                                        className="text-xs font-medium text-slate-600 hover:text-ivolve-mid"
                                    >
                                        Value {index + 1}
                                    </button>
                                    {values.length > 1 && (
                                        <button
                                            onClick={() => removeValue(item.id)}
                                            className="p-0.5 text-slate-400 hover:text-red-500 transition-colors"
                                            aria-label="Remove value"
                                        >
                                            <X size={12} />
                                        </button>
                                    )}
                                </div>

                                {editingId === item.id && (
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={item.label}
                                            onChange={(e) => updateValue(item.id, { label: e.target.value })}
                                            className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-ivolve-mid"
                                            placeholder="Label"
                                        />
                                        <input
                                            type="number"
                                            value={item.value}
                                            onChange={(e) => updateValue(item.id, { value: parseFloat(e.target.value) || 0 })}
                                            className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-ivolve-mid"
                                            placeholder="Value"
                                        />
                                        <div className="flex gap-2">
                                            <select
                                                value={item.format}
                                                onChange={(e) => updateValue(item.id, { format: e.target.value as FormatType })}
                                                className="flex-1 text-xs px-2 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-ivolve-mid bg-white"
                                            >
                                                <option value="number">Number</option>
                                                <option value="percentage">Percentage</option>
                                                <option value="currency">Currency</option>
                                            </select>
                                            {item.format === 'currency' && (
                                                <select
                                                    value={item.currency}
                                                    onChange={(e) => updateValue(item.id, { currency: e.target.value as CurrencyType })}
                                                    className="w-20 text-xs px-2 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-ivolve-mid bg-white"
                                                >
                                                    <option value="GBP">GBP</option>
                                                    <option value="USD">USD</option>
                                                    <option value="EUR">EUR</option>
                                                </select>
                                            )}
                                        </div>
                                        <label className="flex items-center gap-2 text-xs text-slate-600">
                                            <input
                                                type="checkbox"
                                                checked={item.showTrend}
                                                onChange={(e) => updateValue(item.id, { showTrend: e.target.checked })}
                                                className="rounded border-slate-300 text-ivolve-mid focus:ring-ivolve-mid"
                                            />
                                            Show trend
                                        </label>
                                        {item.showTrend && (
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={item.trendValue}
                                                onChange={(e) => updateValue(item.id, { trendValue: parseFloat(e.target.value) || 0 })}
                                                className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-ivolve-mid"
                                                placeholder="Trend %"
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        {values.length < 5 && (
                            <button
                                onClick={addValue}
                                className="w-full flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-ivolve-mid py-2 border border-dashed border-slate-300 rounded-lg hover:border-ivolve-mid transition-colors"
                            >
                                <Plus size={12} />
                                Add value
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
