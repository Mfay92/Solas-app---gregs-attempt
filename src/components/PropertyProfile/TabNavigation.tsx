import React from 'react';
import {
    LayoutDashboard, Building, Building2, Wrench,
    Users, Scale, PoundSterling
} from 'lucide-react';

// Tab structure:
// - Service Overview: High-level service info, key contacts, responsibilities
// - Property Details: Building-focused info (features, white goods, decorating, etc.)
// - Units & Occupancy: Combined units + tenants view
// - Repairs & Compliance: Combined repairs + compliance
// - RPs & Landlords: RP contacts, landlord info, lease/SLA reference
// - Legal: Full legal details (SLA, lease terms) - may be restricted access
// - Rents & Finance: Financial info, rent details

export type TabId = 'service-overview' | 'property-details' | 'units-occupancy' | 'repairs-compliance' | 'rps-landlords' | 'legal' | 'rents-finance';

interface TabNavigationProps {
    activeTab: TabId;
    onTabChange: (tab: TabId) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
    // All tabs in a single row - no dropdown needed
    const tabs = [
        { id: 'service-overview', label: 'Service Overview', icon: LayoutDashboard },
        { id: 'property-details', label: 'Property Details', icon: Building },
        { id: 'units-occupancy', label: 'Units & Occupancy', icon: Building2 },
        { id: 'repairs-compliance', label: 'Repairs & Compliance', icon: Wrench },
        { id: 'rps-landlords', label: 'RPs & Landlords', icon: Users },
        { id: 'legal', label: 'Legal', icon: Scale },
        { id: 'rents-finance', label: 'Rents & Finance', icon: PoundSterling },
    ];

    return (
        <div className="border-b border-gray-200 mb-6">
            <nav className="flex overflow-x-auto no-scrollbar gap-1" aria-label="Tabs">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id as TabId)}
                            className={`
                                flex items-center gap-2 px-5 py-4 border-b-[3px] text-sm whitespace-nowrap transition-all duration-200
                                ${isActive
                                    ? 'border-ivolve-mid text-ivolve-mid bg-ivolve-mid/5 font-semibold'
                                    : 'border-transparent text-gray-600 hover:text-ivolve-mid hover:bg-gray-50 font-medium'}
                            `}
                        >
                            <Icon size={18} />
                            {tab.label}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default TabNavigation;
