import React, { useState } from 'react';
import {
    Building, Home, Car, TreePine, Thermometer, Zap, Shield,
    Camera, Lock, Warehouse, ArrowUpFromLine, PaintBucket, Refrigerator,
    Wrench, Leaf, Sparkles, Calendar, AlertCircle, FileText, ExternalLink,
    Info, CookingPot, Waves, CircleDot
} from 'lucide-react';
import { PropertyAsset, WhiteGood } from '../../../types';
import { CollapsibleCard } from '../shared/CollapsibleCard';
import { formatDate } from '../../../utils';

interface PropertyDetailsTabProps {
    asset: PropertyAsset;
    units: PropertyAsset[];
}

// Compact feature item component - smaller for grid display
const FeatureItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string | number | boolean | undefined;
    colorClass?: string;
}> = ({ icon, label, value, colorClass = 'bg-gray-50' }) => {
    if (value === undefined || value === null || value === false) return null;

    const displayValue = typeof value === 'boolean' ? 'Yes' : value;

    return (
        <div className={`flex items-center gap-2 p-2 ${colorClass} rounded-lg border border-transparent hover:border-gray-200 hover:shadow-sm transition-all`}>
            <div className="w-8 h-8 rounded-md bg-white/80 flex items-center justify-center shadow-sm flex-shrink-0">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-semibold text-gray-800 truncate">{displayValue}</p>
            </div>
        </div>
    );
};

// Responsibility badge
const ResponsibilityBadge: React.FC<{ value?: string }> = ({ value }) => {
    if (!value) return <span className="text-gray-400 text-sm">Not set</span>;

    const colors: Record<string, string> = {
        'ivolve': 'bg-ivolve-mid/10 text-ivolve-mid',
        'RP': 'bg-blue-100 text-blue-700',
        'Landlord': 'bg-purple-100 text-purple-700',
        'Tenant': 'bg-amber-100 text-amber-700',
        'Contractor': 'bg-gray-100 text-gray-700'
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[value] || 'bg-gray-100 text-gray-600'}`}>
            {value}
        </span>
    );
};

// Get icon for white good type
const getWhiteGoodIcon = (type: string) => {
    switch (type) {
        case 'Fridge':
        case 'Freezer':
        case 'Fridge Freezer':
            return <Refrigerator size={18} className="text-blue-500" />;
        case 'Washing Machine':
        case 'Tumble Dryer':
        case 'Washer Dryer':
            return <CircleDot size={18} className="text-cyan-500" />; // Drum symbol
        case 'Dishwasher':
            return <Waves size={18} className="text-sky-500" />; // Water waves
        case 'Cooker':
        case 'Hob':
        case 'Oven':
            return <CookingPot size={18} className="text-orange-500" />;
        case 'Microwave':
            return <Zap size={18} className="text-amber-500" />;
        default:
            return <Refrigerator size={18} className="text-gray-500" />;
    }
};

// White Good Item with PAT testing and document links
const WhiteGoodItem: React.FC<{ item: WhiteGood }> = ({ item }) => {
    const conditionColors: Record<string, string> = {
        'Good': 'text-green-600 bg-green-50',
        'Fair': 'text-amber-600 bg-amber-50',
        'Poor': 'text-red-600 bg-red-50',
        'Needs Replacement': 'text-red-700 bg-red-100'
    };

    // Check if warranty is expiring soon
    const warrantyDaysLeft = item.warrantyExpiry
        ? Math.ceil((new Date(item.warrantyExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : null;
    const warrantyExpiringSoon = warrantyDaysLeft !== null && warrantyDaysLeft > 0 && warrantyDaysLeft <= 90;
    const warrantyExpired = warrantyDaysLeft !== null && warrantyDaysLeft <= 0;

    // PAT testing status (not legally required, so just informational)
    const patDaysLeft = item.nextPatDue
        ? Math.ceil((new Date(item.nextPatDue).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : null;
    const patOverdue = patDaysLeft !== null && patDaysLeft <= 0;

    return (
        <div className="p-4 bg-white rounded-lg border border-gray-100 hover:border-ivolve-mid/30 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    {getWhiteGoodIcon(item.type)}
                    <span className="font-medium text-gray-800">{item.type}</span>
                </div>
                {item.condition && (
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${conditionColors[item.condition] || 'bg-gray-100 text-gray-600'}`}>
                        {item.condition}
                    </span>
                )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
                {item.make && (
                    <div>
                        <span className="text-gray-500">Make:</span>{' '}
                        <span className="text-gray-700">{item.make}</span>
                    </div>
                )}
                {item.model && (
                    <div>
                        <span className="text-gray-500">Model:</span>{' '}
                        <span className="text-gray-700">{item.model}</span>
                    </div>
                )}
                {item.location && (
                    <div>
                        <span className="text-gray-500">Location:</span>{' '}
                        <span className="text-gray-700">{item.location}</span>
                    </div>
                )}
                {item.purchaseDate && (
                    <div>
                        <span className="text-gray-500">Purchased:</span>{' '}
                        <span className="text-gray-700">{formatDate(item.purchaseDate)}</span>
                    </div>
                )}
            </div>

            {/* Warranty info */}
            {item.warrantyExpiry && (
                <div className={`mt-2 flex items-center gap-2 text-xs ${
                    warrantyExpired ? 'text-red-600' : warrantyExpiringSoon ? 'text-amber-600' : 'text-gray-500'
                }`}>
                    {(warrantyExpired || warrantyExpiringSoon) && <AlertCircle size={12} />}
                    <span>
                        Warranty: {formatDate(item.warrantyExpiry)}
                        {warrantyExpired && ' (Expired)'}
                        {warrantyExpiringSoon && ` (${warrantyDaysLeft} days left)`}
                    </span>
                </div>
            )}

            {/* PAT Testing info - informational only, no red alerts */}
            {(item.lastPatDate || item.nextPatDue) && (
                <div className={`mt-2 flex items-center gap-2 text-xs ${patOverdue ? 'text-amber-600' : 'text-gray-500'}`}>
                    <Zap size={12} />
                    <span>
                        PAT: {item.lastPatDate && `Last ${formatDate(item.lastPatDate)}`}
                        {item.lastPatDate && item.nextPatDue && ' · '}
                        {item.nextPatDue && `Due ${formatDate(item.nextPatDue)}`}
                        {patOverdue && ' (Overdue)'}
                    </span>
                </div>
            )}

            {/* Document links */}
            {(item.instructionManualUrl || item.warrantyDocumentUrl) && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                    {item.instructionManualUrl && (
                        <a
                            href={item.instructionManualUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded text-xs text-gray-600 hover:text-ivolve-mid transition-colors"
                        >
                            <FileText size={12} />
                            Manual
                            <ExternalLink size={10} />
                        </a>
                    )}
                    {item.warrantyDocumentUrl && (
                        <a
                            href={item.warrantyDocumentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded text-xs text-gray-600 hover:text-ivolve-mid transition-colors"
                        >
                            <FileText size={12} />
                            Warranty Doc
                            <ExternalLink size={10} />
                        </a>
                    )}
                </div>
            )}

            {/* Responsibility */}
            {item.replacementResponsibility && (
                <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-gray-500">Replacement:</span>
                    <ResponsibilityBadge value={item.replacementResponsibility} />
                </div>
            )}
        </div>
    );
};

// Responsibility row for compact display
const ResponsibilityRow: React.FC<{
    icon: React.ReactNode;
    label: string;
    value?: string;
}> = ({ icon, label, value }) => (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:border-ivolve-mid/30 hover:shadow-sm transition-all">
        <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm text-gray-700">{label}</span>
        </div>
        <ResponsibilityBadge value={value} />
    </div>
);

const PropertyDetailsTab: React.FC<PropertyDetailsTabProps> = ({ asset }) => {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        structure: true,
        maintenance: true, // Now expanded by default and higher up
        security: false,
        whiteGoods: false,
        decorating: false
    });

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const features = asset.features || {};
    const maintenance = asset.maintenance || {};

    // Get EPC color
    const getEpcColor = (rating?: string) => {
        if (!rating) return 'bg-gray-100';
        if (['A', 'B'].includes(rating)) return 'bg-green-100';
        if (['C', 'D'].includes(rating)) return 'bg-amber-100';
        return 'bg-red-100';
    };

    return (
        <div className="space-y-6">
            {/* Building Structure & Features */}
            <CollapsibleCard
                title="Building Structure"
                icon={<Building size={20} />}
                isExpanded={expandedSections.structure}
                onToggle={() => toggleSection('structure')}
            >
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    <FeatureItem
                        icon={<Home size={14} className="text-ivolve-mid" />}
                        label="Beds"
                        value={features.bedrooms}
                    />
                    <FeatureItem
                        icon={<Home size={14} className="text-blue-600" />}
                        label="Baths"
                        value={features.bathrooms}
                    />
                    <FeatureItem
                        icon={<Building size={14} className="text-gray-600" />}
                        label="Floors"
                        value={features.floors}
                    />
                    <FeatureItem
                        icon={<Calendar size={14} className="text-gray-600" />}
                        label="Built"
                        value={features.yearBuilt}
                    />
                    <FeatureItem
                        icon={<Car size={14} className="text-purple-600" />}
                        label="Parking"
                        value={features.parking !== 'None' ? features.parking : undefined}
                        colorClass="bg-purple-50"
                    />
                    <FeatureItem
                        icon={<Warehouse size={14} className="text-slate-600" />}
                        label="Garage"
                        value={features.garage ? (features.garageType || 'Yes') : undefined}
                        colorClass="bg-slate-50"
                    />
                    <FeatureItem
                        icon={<TreePine size={14} className="text-green-600" />}
                        label="Garden"
                        value={features.garden !== 'None' ? features.garden : undefined}
                        colorClass="bg-green-50"
                    />
                    <FeatureItem
                        icon={<Warehouse size={14} className="text-amber-600" />}
                        label="Shed"
                        value={features.gardenShed}
                        colorClass="bg-amber-50"
                    />
                    <FeatureItem
                        icon={<ArrowUpFromLine size={14} className="text-indigo-600" />}
                        label="Loft"
                        value={features.loftSpace ? (features.loftAccessible ? 'Accessible' : 'Yes') : undefined}
                        colorClass="bg-indigo-50"
                    />
                    <FeatureItem
                        icon={<ArrowUpFromLine size={14} className="text-gray-600 rotate-180" />}
                        label="Basement"
                        value={features.basement}
                    />
                </div>

                {/* Heating & Energy */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Heating & Energy</h4>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                        <FeatureItem
                            icon={<Thermometer size={14} className="text-orange-600" />}
                            label="Heating"
                            value={features.heating}
                            colorClass="bg-orange-50"
                        />
                        <FeatureItem
                            icon={<Thermometer size={14} className="text-red-500" />}
                            label="Underfloor"
                            value={features.underfloorHeating}
                            colorClass="bg-red-50"
                        />
                        <FeatureItem
                            icon={<Home size={14} className="text-sky-600" />}
                            label="Glazing"
                            value={features.glazing}
                            colorClass="bg-sky-50"
                        />
                        {features.epcRating && (
                            <div className={`flex items-center gap-2 p-2 ${getEpcColor(features.epcRating)} rounded-lg border border-transparent hover:border-gray-200 hover:shadow-sm transition-all`}>
                                <div className="w-8 h-8 rounded-md bg-white/80 flex items-center justify-center shadow-sm flex-shrink-0">
                                    <Zap size={14} className={
                                        ['A', 'B'].includes(features.epcRating) ? 'text-green-600' :
                                        ['C', 'D'].includes(features.epcRating) ? 'text-amber-600' : 'text-red-600'
                                    } />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase">EPC</p>
                                    <p className="text-sm font-bold text-gray-800">{features.epcRating}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    {features.epcExpiryDate && (
                        <p className="text-xs text-gray-500 mt-2">EPC expires: {formatDate(features.epcExpiryDate)}</p>
                    )}
                </div>

                {/* Adaptations & Amenities */}
                {((features.adaptations && features.adaptations.length > 0) ||
                  (features.amenities && features.amenities.length > 0)) && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        {features.adaptations && features.adaptations.length > 0 && (
                            <div className="mb-3">
                                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Adaptations</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {features.adaptations.map((adaptation, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-ivolve-mid/10 text-ivolve-mid text-xs rounded">
                                            {adaptation}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {features.amenities && features.amenities.length > 0 && (
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Amenities</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {features.amenities.map((amenity, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                            {amenity}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CollapsibleCard>

            {/* Maintenance Responsibilities - MOVED UP */}
            <CollapsibleCard
                title="Maintenance Responsibilities"
                icon={<Wrench size={20} />}
                isExpanded={expandedSections.maintenance}
                onToggle={() => toggleSection('maintenance')}
                collapsedContent={
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        {maintenance.general && <span>General: {maintenance.general}</span>}
                        {maintenance.gardening && <span>· Garden: {maintenance.gardening}</span>}
                    </div>
                }
            >
                <div className="space-y-4">
                    {/* Responsibility Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        <ResponsibilityRow
                            icon={<Wrench size={16} className="text-gray-500" />}
                            label="General Maintenance"
                            value={maintenance.general}
                        />
                        <ResponsibilityRow
                            icon={<Leaf size={16} className="text-green-500" />}
                            label="Gardening"
                            value={maintenance.gardening}
                        />
                        <ResponsibilityRow
                            icon={<Sparkles size={16} className="text-blue-500" />}
                            label="Window Cleaning"
                            value={maintenance.windowCleaning}
                        />
                        <ResponsibilityRow
                            icon={<Refrigerator size={16} className="text-cyan-500" />}
                            label="White Goods"
                            value={maintenance.whiteGoods}
                        />
                        <ResponsibilityRow
                            icon={<PaintBucket size={16} className="text-amber-500" />}
                            label="Decorating"
                            value={maintenance.decorating}
                        />
                    </div>

                    {/* Contractor Details */}
                    {(maintenance.gardeningContractor || maintenance.windowCleaningContractor) && (
                        <div className="pt-3 border-t border-gray-100">
                            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Contractors</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {maintenance.gardeningContractor && (
                                    <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                                        <p className="text-xs text-green-700 uppercase tracking-wider">Gardening</p>
                                        <p className="font-medium text-gray-800 text-sm">{maintenance.gardeningContractor}</p>
                                        {maintenance.gardeningFrequency && (
                                            <p className="text-xs text-gray-600">{maintenance.gardeningFrequency}</p>
                                        )}
                                        {maintenance.gardeningContact && (
                                            <p className="text-xs text-gray-600">{maintenance.gardeningContact}</p>
                                        )}
                                    </div>
                                )}
                                {maintenance.windowCleaningContractor && (
                                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                        <p className="text-xs text-blue-700 uppercase tracking-wider">Window Cleaning</p>
                                        <p className="font-medium text-gray-800 text-sm">{maintenance.windowCleaningContractor}</p>
                                        {maintenance.windowCleaningFrequency && (
                                            <p className="text-xs text-gray-600">{maintenance.windowCleaningFrequency}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {!maintenance.general && !maintenance.gardening && !maintenance.windowCleaning &&
                     !maintenance.whiteGoods && !maintenance.decorating && (
                        <div className="text-center py-6 text-gray-400">
                            <Wrench size={24} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No maintenance responsibilities assigned</p>
                        </div>
                    )}
                </div>
            </CollapsibleCard>

            {/* Security Features */}
            <CollapsibleCard
                title="Security Features"
                icon={<Shield size={20} />}
                isExpanded={expandedSections.security}
                onToggle={() => toggleSection('security')}
                collapsedContent={
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        {features.cctv && <span>CCTV</span>}
                        {features.alarmSystem && <span>Alarm</span>}
                        {features.secureEntry && <span>Secure Entry</span>}
                        {!features.cctv && !features.alarmSystem && !features.secureEntry && (
                            <span className="text-gray-400">No security features recorded</span>
                        )}
                    </div>
                }
            >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <FeatureItem
                        icon={<Camera size={14} className="text-blue-600" />}
                        label="CCTV"
                        value={features.cctv ? (features.cctvCameras ? `${features.cctvCameras} cameras` : 'Yes') : undefined}
                        colorClass="bg-blue-50"
                    />
                    <FeatureItem
                        icon={<Shield size={14} className="text-red-600" />}
                        label="Alarm"
                        value={features.alarmSystem}
                        colorClass="bg-red-50"
                    />
                    <FeatureItem
                        icon={<Lock size={14} className="text-green-600" />}
                        label="Secure Entry"
                        value={features.secureEntry}
                        colorClass="bg-green-50"
                    />
                </div>

                {!features.cctv && !features.alarmSystem && !features.secureEntry && (
                    <div className="text-center py-6 text-gray-400">
                        <Shield size={24} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No security features recorded</p>
                    </div>
                )}
            </CollapsibleCard>

            {/* White Goods */}
            <CollapsibleCard
                title="White Goods"
                icon={<Refrigerator size={20} />}
                isExpanded={expandedSections.whiteGoods}
                onToggle={() => toggleSection('whiteGoods')}
                collapsedContent={
                    <span className="text-sm text-gray-600">
                        {features.whiteGoods?.length || 0} items
                    </span>
                }
            >
                {/* PAT Testing notice */}
                <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2">
                    <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-700">
                        <p className="font-medium">PAT Testing (Portable Appliance Testing)</p>
                        <p className="mt-0.5 text-blue-600">While not legally required, we track PAT testing dates as good practice for appliance safety.</p>
                    </div>
                </div>

                {features.whiteGoods && features.whiteGoods.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {features.whiteGoods.map((item) => (
                            <WhiteGoodItem key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 text-gray-400">
                        <Refrigerator size={24} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No white goods recorded</p>
                    </div>
                )}
            </CollapsibleCard>

            {/* Decorating */}
            <CollapsibleCard
                title="Decorating"
                icon={<PaintBucket size={20} />}
                isExpanded={expandedSections.decorating}
                onToggle={() => toggleSection('decorating')}
                collapsedContent={
                    features.lastDecoratedDate ? (
                        <span className="text-sm text-gray-600">
                            Last decorated: {formatDate(features.lastDecoratedDate)}
                        </span>
                    ) : (
                        <span className="text-sm text-gray-400">No decorating info</span>
                    )
                }
            >
                {/* Supported Living Notice */}
                {asset.serviceType === 'Supported Living' && (
                    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                        <Info size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-amber-800">
                            <p className="font-medium">Please Note</p>
                            <p className="mt-0.5">In supported living properties, the responsibility of decorating the person we support's flat or bedroom will be their responsibility and will not fall to either ivolve or the landlord.</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <div className="p-3 bg-white rounded-lg border border-gray-100 hover:border-ivolve-mid/30 hover:shadow-sm transition-all">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Last Decorated</p>
                            <p className="text-lg font-medium text-gray-800">
                                {formatDate(features.lastDecoratedDate) || 'Not recorded'}
                            </p>
                        </div>

                        {features.lastDecoratedRooms && features.lastDecoratedRooms.length > 0 && (
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Rooms Decorated</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {features.lastDecoratedRooms.map((room, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                            {room}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <div className="p-3 bg-white rounded-lg border border-gray-100 hover:border-ivolve-mid/30 hover:shadow-sm transition-all">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Next Due</p>
                            <p className="text-lg font-medium text-gray-800">
                                {formatDate(features.nextDecoratingDue) || 'Not scheduled'}
                            </p>
                        </div>

                        <div className="p-3 bg-white rounded-lg border border-gray-100 hover:border-ivolve-mid/30 hover:shadow-sm transition-all">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Responsibility</p>
                            <ResponsibilityBadge value={features.decoratingResponsibility} />
                        </div>
                    </div>
                </div>

                {!features.lastDecoratedDate && !features.nextDecoratingDue && (
                    <div className="text-center py-6 text-gray-400">
                        <PaintBucket size={24} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No decorating information recorded</p>
                    </div>
                )}
            </CollapsibleCard>
        </div>
    );
};

export default PropertyDetailsTab;
