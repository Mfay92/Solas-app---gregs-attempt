import React, { useState, useMemo } from 'react';
import {
    Activity, Clock, FileText, Wrench, Shield, Users,
    Home, Calendar, Filter, ChevronDown, ChevronUp, User
} from 'lucide-react';
import { PropertyAsset } from '../../../types';
import { formatDate } from '../../../utils';

interface TabProps {
    asset: PropertyAsset;
    units?: PropertyAsset[];
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
    priority?: 'high' | 'medium' | 'low';
    status?: string;
}

// Activity type config
const activityConfig: Record<ActivityType, { icon: React.ReactNode; color: string; bgColor: string; label: string }> = {
    'repair': { icon: <Wrench size={16} />, color: 'text-orange-600', bgColor: 'bg-orange-100', label: 'Repair' },
    'compliance': { icon: <Shield size={16} />, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Compliance' },
    'tenant': { icon: <Users size={16} />, color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Tenant' },
    'document': { icon: <FileText size={16} />, color: 'text-purple-600', bgColor: 'bg-purple-100', label: 'Document' },
    'lease': { icon: <Home size={16} />, color: 'text-indigo-600', bgColor: 'bg-indigo-100', label: 'Lease' },
    'general': { icon: <Activity size={16} />, color: 'text-gray-600', bgColor: 'bg-gray-100', label: 'General' }
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
                description: `${repair.status} - ${repair.priority} priority`,
                date: repair.reportedDate,
                user: repair.reportedBy,
                priority: repair.priority === 'Emergency' ? 'high' : repair.priority === 'Urgent' ? 'medium' : 'low',
                status: repair.status
            });

            if (repair.completedDate) {
                activities.push({
                    id: `repair-complete-${repair.id}`,
                    type: 'repair',
                    title: `Repair completed: ${repair.title}`,
                    description: repair.contractor ? `Completed by ${repair.contractor}` : undefined,
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
                    title: `${item.type} certificate issued`,
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
                    title: `Document uploaded: ${doc.name}`,
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

// Activity item component
const ActivityItemCard: React.FC<{
    activity: ActivityItem;
    isLast: boolean;
}> = ({ activity, isLast }) => {
    const config = activityConfig[activity.type];

    return (
        <div className="flex gap-4">
            {/* Timeline line and dot */}
            <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full ${config.bgColor} ${config.color} flex items-center justify-center flex-shrink-0`}>
                    {config.icon}
                </div>
                {!isLast && (
                    <div className="w-0.5 flex-1 bg-gray-200 my-2" />
                )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                            <h3 className="font-medium text-gray-800">{activity.title}</h3>
                            {activity.description && (
                                <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                            )}
                        </div>
                        {activity.status && (
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                activity.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                activity.status === 'Open' ? 'bg-amber-100 text-amber-700' :
                                activity.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-600'
                            }`}>
                                {activity.status}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {formatDate(activity.date)}
                        </span>
                        {activity.user && (
                            <span className="flex items-center gap-1">
                                <User size={12} />
                                {activity.user}
                            </span>
                        )}
                        <span className={`px-2 py-0.5 rounded ${config.bgColor} ${config.color}`}>
                            {config.label}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Group activities by date
const groupByDate = (activities: ActivityItem[]): Record<string, ActivityItem[]> => {
    const groups: Record<string, ActivityItem[]> = {};

    activities.forEach(activity => {
        const date = new Date(activity.date);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        let key: string;
        if (diffDays === 0) key = 'Today';
        else if (diffDays === 1) key = 'Yesterday';
        else if (diffDays < 7) key = 'This Week';
        else if (diffDays < 30) key = 'This Month';
        else if (diffDays < 90) key = 'Last 3 Months';
        else key = 'Older';

        if (!groups[key]) groups[key] = [];
        groups[key].push(activity);
    });

    return groups;
};

const ActivityLogTab: React.FC<TabProps> = ({ asset, units = [] }) => {
    const [typeFilter, setTypeFilter] = useState<'all' | ActivityType>('all');
    const [showFilters, setShowFilters] = useState(false);

    // Generate activities from property data
    const allActivities = useMemo(() => {
        return generateActivityFromProperty(asset, units);
    }, [asset, units]);

    // Count by type
    const counts = useMemo(() => ({
        all: allActivities.length,
        repair: allActivities.filter(a => a.type === 'repair').length,
        compliance: allActivities.filter(a => a.type === 'compliance').length,
        tenant: allActivities.filter(a => a.type === 'tenant').length,
        document: allActivities.filter(a => a.type === 'document').length,
        lease: allActivities.filter(a => a.type === 'lease').length,
        general: allActivities.filter(a => a.type === 'general').length
    }), [allActivities]);

    // Filter activities
    const filteredActivities = useMemo(() => {
        if (typeFilter === 'all') return allActivities;
        return allActivities.filter(a => a.type === typeFilter);
    }, [allActivities, typeFilter]);

    // Group by date
    const groupedActivities = useMemo(() => {
        return groupByDate(filteredActivities);
    }, [filteredActivities]);

    const dateOrder = ['Today', 'Yesterday', 'This Week', 'This Month', 'Last 3 Months', 'Older'];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Activity size={20} className="text-ivolve-mid" />
                        Activity Log
                        <span className="text-sm font-normal text-gray-500">({allActivities.length} events)</span>
                    </h2>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                            showFilters ? 'bg-ivolve-mid text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <Filter size={14} />
                        Filter
                        {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="flex items-center gap-2 flex-wrap pt-4 border-t border-gray-100">
                        <button
                            onClick={() => setTypeFilter('all')}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                                typeFilter === 'all'
                                    ? 'bg-ivolve-mid text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            All ({counts.all})
                        </button>
                        {(Object.keys(activityConfig) as ActivityType[]).map(type => (
                            counts[type] > 0 && (
                                <button
                                    key={type}
                                    onClick={() => setTypeFilter(type)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                                        typeFilter === type
                                            ? 'bg-ivolve-mid text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {activityConfig[type].icon}
                                    {activityConfig[type].label} ({counts[type]})
                                </button>
                            )
                        ))}
                    </div>
                )}
            </div>

            {/* Activity Timeline */}
            {filteredActivities.length > 0 ? (
                <div className="space-y-6">
                    {dateOrder.map(period => {
                        const activities = groupedActivities[period];
                        if (!activities || activities.length === 0) return null;

                        return (
                            <div key={period}>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Clock size={14} />
                                    {period}
                                    <span className="text-xs font-normal text-gray-400">
                                        ({activities.length} {activities.length === 1 ? 'event' : 'events'})
                                    </span>
                                </h3>
                                <div>
                                    {activities.map((activity, index) => (
                                        <ActivityItemCard
                                            key={activity.id}
                                            activity={activity}
                                            isLast={index === activities.length - 1}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
                    <Activity size={48} className="mx-auto text-gray-300 mb-3" />
                    {allActivities.length === 0 ? (
                        <>
                            <p className="text-lg font-medium text-gray-500">No activity recorded</p>
                            <p className="text-sm text-gray-400 mt-1">Activity events will appear here as they occur</p>
                        </>
                    ) : (
                        <>
                            <p className="text-lg font-medium text-gray-500">No matching activities</p>
                            <button
                                onClick={() => setTypeFilter('all')}
                                className="mt-3 text-sm text-ivolve-mid hover:underline"
                            >
                                Clear filter
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Quick Stats */}
            {allActivities.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                        <div className="text-2xl font-bold text-gray-800">{counts.repair}</div>
                        <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
                            <Wrench size={14} className="text-orange-500" />
                            Repairs
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                        <div className="text-2xl font-bold text-gray-800">{counts.compliance}</div>
                        <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
                            <Shield size={14} className="text-green-500" />
                            Compliance
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                        <div className="text-2xl font-bold text-gray-800">{counts.tenant}</div>
                        <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
                            <Users size={14} className="text-blue-500" />
                            Tenant Events
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                        <div className="text-2xl font-bold text-gray-800">{counts.document}</div>
                        <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
                            <FileText size={14} className="text-purple-500" />
                            Documents
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivityLogTab;
