import { useState, useMemo } from 'react';
import {
    Activity, FileText, Wrench, Shield, Users, Home
} from 'lucide-react';
import { PropertyAsset } from '../../../types';
import { formatDate } from '../../../utils';
import Sidebar from '../../shared/Sidebar';

interface ActivityLogSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    asset: PropertyAsset;
    units: PropertyAsset[];
}

// Activity types
type ActivityType = 'repair' | 'compliance' | 'tenant' | 'document' | 'lease' | 'general';

interface ActivityItem {
    id: string;
    type: ActivityType;
    title: string;
    description?: string;
    date: string;
    user?: string;
    status?: string;
}

// Activity type config
const activityConfig: Record<ActivityType, { icon: React.ReactNode; color: string; bgColor: string; label: string }> = {
    'repair': { icon: <Wrench size={14} />, color: 'text-orange-600', bgColor: 'bg-orange-100', label: 'Repair' },
    'compliance': { icon: <Shield size={14} />, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Compliance' },
    'tenant': { icon: <Users size={14} />, color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Tenant' },
    'document': { icon: <FileText size={14} />, color: 'text-purple-600', bgColor: 'bg-purple-100', label: 'Document' },
    'lease': { icon: <Home size={14} />, color: 'text-indigo-600', bgColor: 'bg-indigo-100', label: 'Lease' },
    'general': { icon: <Activity size={14} />, color: 'text-gray-600', bgColor: 'bg-gray-100', label: 'General' }
};

// Generate sample activity from property data
const generateActivityFromProperty = (asset: PropertyAsset, units: PropertyAsset[]): ActivityItem[] => {
    const activities: ActivityItem[] = [];

    // Add repair activities
    if (asset.repairs) {
        asset.repairs.forEach(repair => {
            activities.push({
                id: `repair-${repair.id}`,
                type: 'repair',
                title: repair.title,
                description: `${repair.status} - ${repair.priority}`,
                date: repair.reportedDate,
                user: repair.reportedBy,
                status: repair.status
            });

            if (repair.completedDate) {
                activities.push({
                    id: `repair-complete-${repair.id}`,
                    type: 'repair',
                    title: `Completed: ${repair.title}`,
                    description: repair.contractor ? `By ${repair.contractor}` : undefined,
                    date: repair.completedDate,
                    status: 'Completed'
                });
            }
        });
    }

    // Add compliance activities
    if (asset.complianceItems) {
        asset.complianceItems.forEach(item => {
            if (item.issuedDate) {
                activities.push({
                    id: `compliance-${item.id}`,
                    type: 'compliance',
                    title: `${item.type} issued`,
                    description: item.contractor ? `By ${item.contractor}` : undefined,
                    date: item.issuedDate,
                    status: item.status
                });
            }
        });
    }

    // Add tenant activities
    const allTenants = [
        ...(asset.tenants || []),
        ...units.flatMap(u => u.tenants || [])
    ];

    allTenants.forEach(tenant => {
        if (tenant.moveInDate) {
            activities.push({
                id: `tenant-in-${tenant.id}`,
                type: 'tenant',
                title: `${tenant.name} moved in`,
                date: tenant.moveInDate,
                status: 'Move In'
            });
        }
        if (tenant.moveOutDate) {
            activities.push({
                id: `tenant-out-${tenant.id}`,
                type: 'tenant',
                title: `${tenant.name} moved out`,
                date: tenant.moveOutDate,
                status: 'Move Out'
            });
        }
    });

    // Add document activities
    if (asset.documents) {
        asset.documents.forEach(doc => {
            if (doc.date) {
                activities.push({
                    id: `doc-${doc.id}`,
                    type: 'document',
                    title: `Uploaded: ${doc.name}`,
                    description: `Type: ${doc.type}`,
                    date: doc.date
                });
            }
        });
    }

    // Sort by date (most recent first)
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return activities;
};

// Format relative time
const getRelativeTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return formatDate(dateStr);
};

// Activity item component
const ActivityItemRow: React.FC<{ activity: ActivityItem }> = ({ activity }) => {
    const config = activityConfig[activity.type];

    return (
        <div className="flex gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0">
            <div className={`w-7 h-7 rounded-full ${config.bgColor} ${config.color} flex items-center justify-center flex-shrink-0`}>
                {config.icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 font-medium">{activity.title}</p>
                {activity.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{activity.description}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{getRelativeTime(activity.date)}</span>
                    {activity.status && (
                        <span className={`px-1.5 py-0.5 text-xs rounded ${
                            activity.status === 'Completed' ? 'bg-green-100 text-green-600' :
                            activity.status === 'Open' ? 'bg-amber-100 text-amber-600' :
                            'bg-gray-100 text-gray-500'
                        }`}>
                            {activity.status}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function ActivityLogSidebar({ isOpen, onClose, asset, units }: ActivityLogSidebarProps) {
    const [typeFilter, setTypeFilter] = useState<'all' | ActivityType>('all');

    // Generate activities
    const allActivities = useMemo(() => {
        return generateActivityFromProperty(asset, units);
    }, [asset, units]);

    // Filter activities
    const filteredActivities = useMemo(() => {
        if (typeFilter === 'all') return allActivities;
        return allActivities.filter(a => a.type === typeFilter);
    }, [allActivities, typeFilter]);

    // Get counts
    const counts = useMemo(() => ({
        all: allActivities.length,
        repair: allActivities.filter(a => a.type === 'repair').length,
        compliance: allActivities.filter(a => a.type === 'compliance').length,
        tenant: allActivities.filter(a => a.type === 'tenant').length,
        document: allActivities.filter(a => a.type === 'document').length
    }), [allActivities]);

    return (
        <Sidebar
            isOpen={isOpen}
            onClose={onClose}
            title="Activity Log"
            subtitle={`${allActivities.length} event${allActivities.length !== 1 ? 's' : ''}`}
            width="md"
        >
            <div className="flex flex-col h-full">
                {/* Filter Tabs */}
                <div className="px-4 py-3 border-b border-gray-100 overflow-x-auto">
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setTypeFilter('all')}
                            className={`px-2.5 py-1 text-xs rounded-lg transition-colors whitespace-nowrap ${
                                typeFilter === 'all'
                                    ? 'bg-ivolve-mid text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            All
                        </button>
                        {counts.repair > 0 && (
                            <button
                                onClick={() => setTypeFilter('repair')}
                                className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg transition-colors ${
                                    typeFilter === 'repair'
                                        ? 'bg-ivolve-mid text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <Wrench size={12} />
                                Repairs
                            </button>
                        )}
                        {counts.compliance > 0 && (
                            <button
                                onClick={() => setTypeFilter('compliance')}
                                className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg transition-colors ${
                                    typeFilter === 'compliance'
                                        ? 'bg-ivolve-mid text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <Shield size={12} />
                                Compliance
                            </button>
                        )}
                        {counts.tenant > 0 && (
                            <button
                                onClick={() => setTypeFilter('tenant')}
                                className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg transition-colors ${
                                    typeFilter === 'tenant'
                                        ? 'bg-ivolve-mid text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <Users size={12} />
                                Tenants
                            </button>
                        )}
                        {counts.document > 0 && (
                            <button
                                onClick={() => setTypeFilter('document')}
                                className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg transition-colors ${
                                    typeFilter === 'document'
                                        ? 'bg-ivolve-mid text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <FileText size={12} />
                                Docs
                            </button>
                        )}
                    </div>
                </div>

                {/* Activity List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredActivities.length > 0 ? (
                        <div>
                            {filteredActivities.slice(0, 50).map(activity => (
                                <ActivityItemRow key={activity.id} activity={activity} />
                            ))}
                            {filteredActivities.length > 50 && (
                                <div className="p-4 text-center text-sm text-gray-500">
                                    Showing 50 of {filteredActivities.length} events
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <Activity size={40} className="mx-auto text-gray-300 mb-3" />
                            {allActivities.length === 0 ? (
                                <>
                                    <p className="text-gray-500 font-medium">No activity</p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Activity events will appear here
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="text-gray-500 font-medium">No matching events</p>
                                    <button
                                        onClick={() => setTypeFilter('all')}
                                        className="mt-3 text-sm text-ivolve-mid hover:underline"
                                    >
                                        Show all
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Sidebar>
    );
}
