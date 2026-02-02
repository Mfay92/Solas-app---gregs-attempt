import { ShieldCheck, Plus, Calendar, FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Person, ServiceType } from '../../../types';
import { PersonTabId } from '../PersonHeroBanner';

interface ComplianceTabProps {
    person: Person;
    onJumpToTab: (tab: PersonTabId) => void;
    serviceType?: ServiceType;
    borderColor?: string;
}

// Compliance item interface (person-specific)
interface PersonComplianceItem {
    id: string;
    type: string;
    category: 'DBS' | 'Training';
    certificateNumber?: string;
    issueDate?: string;
    expiryDate?: string;
    nextDueDate?: string;
    status: 'OK' | 'Due Soon' | 'Overdue' | 'Not Started';
    documentUrl?: string;
    notes?: string;
}

export default function ComplianceTab({ person, onJumpToTab, serviceType, borderColor = 'border-gray-200' }: ComplianceTabProps) {
    // Mock data - will be replaced with real data later
    const complianceItems: PersonComplianceItem[] = [];

    // Format date
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Calculate days until due
    const getDaysUntilDue = (dueDateStr?: string) => {
        if (!dueDateStr) return null;
        const dueDate = new Date(dueDateStr);
        const today = new Date();
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Status colors
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OK':
                return 'bg-green-500 text-white';
            case 'Due Soon':
                return 'bg-yellow-500 text-white';
            case 'Overdue':
                return 'bg-red-500 text-white';
            case 'Not Started':
                return 'bg-gray-400 text-white';
            default:
                return 'bg-gray-400 text-white';
        }
    };

    // Status icon
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'OK':
                return <CheckCircle size={16} />;
            case 'Due Soon':
                return <Clock size={16} />;
            case 'Overdue':
                return <AlertCircle size={16} />;
            case 'Not Started':
                return <AlertCircle size={16} />;
            default:
                return <AlertCircle size={16} />;
        }
    };

    // Separate items by category
    const dbsItems = complianceItems.filter(item => item.category === 'DBS');
    const trainingItems = complianceItems.filter(item => item.category === 'Training');

    // Count overdue items
    const overdueCount = complianceItems.filter(item => item.status === 'Overdue').length;
    const dueSoonCount = complianceItems.filter(item => item.status === 'Due Soon').length;

    const renderComplianceItem = (item: PersonComplianceItem) => {
        const daysUntil = getDaysUntilDue(item.expiryDate || item.nextDueDate);

        return (
            <div key={item.id} className={`bg-white border-2 ${borderColor} rounded-lg p-5 hover:shadow-md transition-shadow`}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h4 className="text-base font-bold text-gray-800 mb-2">{item.type}</h4>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(item.status)}`}>
                            {getStatusIcon(item.status)}
                            {item.status}
                            {daysUntil !== null && item.status !== 'Overdue' && item.status !== 'Not Started' && (
                                <span className="ml-1">({daysUntil} days)</span>
                            )}
                        </span>
                    </div>
                    {item.documentUrl && (
                        <button
                            className="px-3 py-1.5 bg-ivolve-mid/10 text-ivolve-mid rounded-lg hover:bg-ivolve-mid hover:text-white transition-colors flex items-center gap-1.5 text-sm"
                            onClick={() => window.open(item.documentUrl, '_blank')}
                        >
                            <FileText size={14} />
                            <span>View</span>
                        </button>
                    )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {item.certificateNumber && (
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Certificate Number</p>
                            <p className="text-sm font-semibold text-gray-800">{item.certificateNumber}</p>
                        </div>
                    )}
                    {item.issueDate && (
                        <div>
                            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                <Calendar size={12} />
                                Issue Date
                            </p>
                            <p className="text-sm font-semibold text-gray-800">{formatDate(item.issueDate)}</p>
                        </div>
                    )}
                    {item.expiryDate && (
                        <div>
                            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                <Calendar size={12} />
                                Expiry Date
                            </p>
                            <p className={`text-sm font-semibold ${item.status === 'Overdue' ? 'text-red-600' : 'text-gray-800'}`}>
                                {formatDate(item.expiryDate)}
                            </p>
                        </div>
                    )}
                    {item.nextDueDate && !item.expiryDate && (
                        <div>
                            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                <Calendar size={12} />
                                Next Due Date
                            </p>
                            <p className={`text-sm font-semibold ${item.status === 'Overdue' ? 'text-red-600' : 'text-gray-800'}`}>
                                {formatDate(item.nextDueDate)}
                            </p>
                        </div>
                    )}
                </div>

                {/* Notes */}
                {item.notes && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Notes</p>
                        <p className="text-sm text-gray-700">{item.notes}</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <ShieldCheck size={28} className="text-ivolve-mid" />
                        Person Compliance
                    </h2>
                    <p className="text-gray-600 mt-1">
                        DBS checks and training certificates for staff working with people we support
                    </p>
                </div>
                <button className="px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-teal transition-colors flex items-center gap-2 shadow-sm">
                    <Plus size={20} />
                    <span>Add Compliance Item</span>
                </button>
            </div>

            {/* Compliance Overview */}
            {complianceItems.length > 0 && (overdueCount > 0 || dueSoonCount > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {overdueCount > 0 && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="text-red-600" size={20} />
                                <div>
                                    <p className="text-red-800 font-bold">
                                        {overdueCount} Item{overdueCount > 1 ? 's' : ''} Overdue
                                    </p>
                                    <p className="text-red-700 text-sm">Requires immediate attention</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {dueSoonCount > 0 && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                            <div className="flex items-center gap-2">
                                <Clock className="text-yellow-600" size={20} />
                                <div>
                                    <p className="text-yellow-800 font-bold">
                                        {dueSoonCount} Item{dueSoonCount > 1 ? 's' : ''} Due Soon
                                    </p>
                                    <p className="text-yellow-700 text-sm">Due within 30 days</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* DBS Checks Section */}
            {dbsItems.length > 0 && (
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <div className="w-1 h-6 bg-ivolve-mid rounded"></div>
                        DBS Checks
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dbsItems.map(item => renderComplianceItem(item))}
                    </div>
                </div>
            )}

            {/* Training Certificates Section */}
            {trainingItems.length > 0 && (
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <div className="w-1 h-6 bg-blue-500 rounded"></div>
                        Training Certificates
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {trainingItems.map(item => renderComplianceItem(item))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {complianceItems.length === 0 && (
                <div className={`bg-white border-2 ${borderColor} border-dashed rounded-lg p-12 text-center`}>
                    <ShieldCheck size={48} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        No Compliance Records Yet
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-lg mx-auto">
                        Track person-specific compliance items such as DBS checks and training certificates. These records ensure staff working with this person meet all regulatory requirements.
                    </p>

                    {/* Common compliance items guide */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-6 max-w-2xl mx-auto text-left">
                        <h4 className="font-bold text-gray-700 mb-3">Common Compliance Items:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <p className="text-sm font-semibold text-gray-700 mb-1">DBS Checks</p>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Enhanced DBS (3 year validity)</li>
                                </ul>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-700 mb-1">Training</p>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Safeguarding (annual)</li>
                                    <li>• Medication (annual)</li>
                                    <li>• Fire Safety (annual)</li>
                                    <li>• Moving & Handling (annual)</li>
                                    <li>• First Aid (3 yearly)</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <button className="px-6 py-3 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-teal transition-colors flex items-center gap-2 mx-auto shadow-sm">
                        <Plus size={20} />
                        <span>Add First Compliance Item</span>
                    </button>
                </div>
            )}
        </div>
    );
}
