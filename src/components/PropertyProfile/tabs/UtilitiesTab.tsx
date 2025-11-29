import React, { useState } from 'react';
import {
    Zap, Flame, Droplets, Wifi, Building2, Shield,
    Thermometer, Car, Trees, Home, Star,
    Accessibility, ChevronDown, ChevronUp, Hash
} from 'lucide-react';
import { PropertyAsset, UtilityAccount, UtilityType } from '../../../types';
import { formatDate } from '../../../utils';

interface TabProps {
    asset: PropertyAsset;
    units?: PropertyAsset[];
}

// Utility type icons and colors
const utilityConfig: Record<UtilityType, { icon: React.ReactNode; color: string; bgColor: string }> = {
    'Electric': { icon: <Zap size={20} />, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    'Gas': { icon: <Flame size={20} />, color: 'text-orange-600', bgColor: 'bg-orange-50' },
    'Water': { icon: <Droplets size={20} />, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    'Internet': { icon: <Wifi size={20} />, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    'Council Tax': { icon: <Building2 size={20} />, color: 'text-gray-600', bgColor: 'bg-gray-50' },
    'Insurance': { icon: <Shield size={20} />, color: 'text-green-600', bgColor: 'bg-green-50' }
};

// Payment method badge colors
const paymentColors: Record<string, string> = {
    'Direct Debit': 'bg-green-100 text-green-700',
    'Invoice': 'bg-blue-100 text-blue-700',
    'Prepayment': 'bg-amber-100 text-amber-700',
    'Included in Rent': 'bg-purple-100 text-purple-700'
};

// Utility card component
const UtilityCard: React.FC<{
    utility: UtilityAccount;
}> = ({ utility }) => {
    const [expanded, setExpanded] = useState(false);
    const config = utilityConfig[utility.type];

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div
                onClick={() => setExpanded(!expanded)}
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${config.bgColor} ${config.color} flex items-center justify-center`}>
                            {config.icon}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">{utility.type}</h3>
                            <p className="text-sm text-gray-500">{utility.provider}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {utility.monthlyEstimate !== undefined && (
                            <div className="text-right">
                                <span className="text-lg font-bold text-gray-800">
                                    £{utility.monthlyEstimate.toLocaleString()}
                                </span>
                                <span className="text-xs text-gray-500">/month</span>
                            </div>
                        )}
                        {expanded ? (
                            <ChevronUp size={18} className="text-gray-400" />
                        ) : (
                            <ChevronDown size={18} className="text-gray-400" />
                        )}
                    </div>
                </div>
            </div>

            {expanded && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-50 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        {utility.accountNumber && (
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                <Hash size={14} className="text-gray-400" />
                                <div>
                                    <span className="text-xs text-gray-500 block">Account No.</span>
                                    <span className="text-sm font-medium text-gray-800">{utility.accountNumber}</span>
                                </div>
                            </div>
                        )}
                        {utility.meterNumber && (
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                <Hash size={14} className="text-gray-400" />
                                <div>
                                    <span className="text-xs text-gray-500 block">Meter No.</span>
                                    <span className="text-sm font-medium text-gray-800">{utility.meterNumber}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {utility.meterLocation && (
                        <div className="text-sm">
                            <span className="text-gray-500">Meter Location:</span>
                            <span className="ml-2 text-gray-800">{utility.meterLocation}</span>
                        </div>
                    )}

                    {utility.paymentMethod && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Payment:</span>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${paymentColors[utility.paymentMethod] || 'bg-gray-100 text-gray-600'}`}>
                                {utility.paymentMethod}
                            </span>
                        </div>
                    )}

                    {utility.lastReading && (
                        <div className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg">
                            <span className="text-gray-500">Last Reading</span>
                            <div className="text-right">
                                <span className="font-medium text-gray-800">{utility.lastReading}</span>
                                {utility.lastReadingDate && (
                                    <span className="text-xs text-gray-400 ml-2">
                                        ({formatDate(utility.lastReadingDate)})
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {utility.notes && (
                        <p className="text-sm text-gray-600 italic">{utility.notes}</p>
                    )}
                </div>
            )}
        </div>
    );
};

// EPC Rating display
const EPCRating: React.FC<{ rating: string }> = ({ rating }) => {
    const colors: Record<string, string> = {
        'A': 'bg-green-600',
        'B': 'bg-green-500',
        'C': 'bg-lime-500',
        'D': 'bg-yellow-500',
        'E': 'bg-orange-500',
        'F': 'bg-red-500',
        'G': 'bg-red-700'
    };

    return (
        <div className="flex items-center gap-2">
            <div className={`w-8 h-8 ${colors[rating] || 'bg-gray-400'} text-white font-bold rounded flex items-center justify-center`}>
                {rating}
            </div>
            <span className="text-sm text-gray-600">EPC Rating</span>
        </div>
    );
};

// Feature section component
const FeatureSection: React.FC<{
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}> = ({ title, icon, children }) => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            {icon}
            {title}
        </h3>
        {children}
    </div>
);

// Feature item component
const FeatureItem: React.FC<{
    label: string;
    value: string | number | undefined;
    icon?: React.ReactNode;
}> = ({ label, value, icon }) => {
    if (value === undefined) return null;
    return (
        <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <span className="text-gray-600 flex items-center gap-2">
                {icon}
                {label}
            </span>
            <span className="font-medium text-gray-800">{value}</span>
        </div>
    );
};

const UtilitiesTab: React.FC<TabProps> = ({ asset }) => {
    const utilities = asset.utilities || [];
    const features = asset.features || {};

    // Calculate total monthly utility cost
    const totalMonthlyCost = utilities.reduce((sum, u) => sum + (u.monthlyEstimate || 0), 0);

    return (
        <div className="space-y-6">
            {/* Utilities Section */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Zap size={20} className="text-ivolve-mid" />
                        Utility Accounts
                        <span className="text-sm font-normal text-gray-500">({utilities.length})</span>
                    </h2>
                    {totalMonthlyCost > 0 && (
                        <div className="text-right">
                            <span className="text-sm text-gray-500">Est. Monthly Total</span>
                            <p className="text-xl font-bold text-gray-800">£{totalMonthlyCost.toLocaleString()}</p>
                        </div>
                    )}
                </div>

                {utilities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {utilities.map(utility => (
                            <UtilityCard key={utility.id} utility={utility} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Zap size={40} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-gray-500">No utility accounts recorded</p>
                    </div>
                )}
            </div>

            {/* Property Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Basic Features */}
                <FeatureSection title="Property Details" icon={<Home size={16} className="text-ivolve-mid" />}>
                    <div className="space-y-1">
                        <FeatureItem label="Bedrooms" value={features.bedrooms} />
                        <FeatureItem label="Bathrooms" value={features.bathrooms} />
                        <FeatureItem label="Floors" value={features.floors} />
                        <FeatureItem label="Year Built" value={features.yearBuilt} />
                        {features.squareFeet && (
                            <FeatureItem label="Size" value={`${features.squareFeet.toLocaleString()} sq ft`} />
                        )}
                    </div>
                </FeatureSection>

                {/* Energy & Heating */}
                <FeatureSection title="Energy & Heating" icon={<Thermometer size={16} className="text-ivolve-mid" />}>
                    <div className="space-y-3">
                        {features.epcRating && <EPCRating rating={features.epcRating} />}
                        <div className="space-y-1">
                            <FeatureItem label="Heating" value={features.heating} />
                            <FeatureItem label="Glazing" value={features.glazing} />
                        </div>
                    </div>
                </FeatureSection>

                {/* Outdoor & Parking */}
                <FeatureSection title="Outdoor & Parking" icon={<Car size={16} className="text-ivolve-mid" />}>
                    <div className="space-y-1">
                        <FeatureItem label="Parking" value={features.parking} icon={<Car size={14} className="text-gray-400" />} />
                        <FeatureItem label="Garden" value={features.garden} icon={<Trees size={14} className="text-gray-400" />} />
                    </div>
                </FeatureSection>
            </div>

            {/* Adaptations */}
            {features.adaptations && features.adaptations.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Accessibility size={16} className="text-ivolve-mid" />
                        Accessibility Adaptations
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {features.adaptations.map((adaptation) => (
                            <span
                                key={adaptation}
                                className="px-3 py-1.5 bg-ivolve-mid/10 text-ivolve-mid text-sm font-medium rounded-full"
                            >
                                {adaptation}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Amenities */}
            {features.amenities && features.amenities.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Star size={16} className="text-ivolve-mid" />
                        Amenities
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {features.amenities.map((amenity) => (
                            <span
                                key={amenity}
                                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full"
                            >
                                {amenity}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty state if no features */}
            {!features.bedrooms && !features.bathrooms && !features.heating && !features.epcRating &&
             !features.adaptations?.length && !features.amenities?.length && utilities.length === 0 && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
                    <Home size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-lg font-medium text-gray-500">No property features recorded</p>
                    <p className="text-sm text-gray-400 mt-1">Property features and utility information will appear here once added</p>
                </div>
            )}
        </div>
    );
};

export default UtilitiesTab;
