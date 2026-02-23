import { useState, useEffect } from 'react';
import { Save, RefreshCw, Code, Users, Shield, Home, Settings as SettingsIcon } from 'lucide-react';
import { useToast } from '../ToastProvider';

/**
 * DeveloperSettings Component
 *
 * Allows configuration of feature toggles and field visibility per user group.
 * User groups: Support Providers, Care Providers, Registered Providers, Councils, NHS
 *
 * Features that can be toggled:
 * - Person Profile tabs (Safeguarding, ASB, Support Plans, Risk Assessments, Compliance, Finance, Documents, Notes)
 * - Person fields (NI Number, DOB, Emergency Contacts, Medical Needs, etc.)
 * - Property features (Void Management, Compliance tracking, Financial tracking)
 */

type UserGroup = 'support-provider' | 'care-provider' | 'registered-provider' | 'council' | 'nhs';

interface FeatureToggle {
    id: string;
    label: string;
    description: string;
    category: 'person' | 'property' | 'compliance' | 'finance';
}

interface UserGroupConfig {
    name: string;
    description: string;
    color: string;
    features: Record<string, boolean>;
}

const DEFAULT_FEATURES: FeatureToggle[] = [
    // Person Profile Tabs
    { id: 'tab_safeguarding', label: 'Safeguarding Tab', description: 'Track safeguarding cases and incidents', category: 'person' },
    { id: 'tab_asb', label: 'ASB Tab', description: 'Anti-Social Behaviour case management', category: 'person' },
    { id: 'tab_support_plans', label: 'Support Plans Tab', description: 'Support plan tracking and reviews', category: 'person' },
    { id: 'tab_risk_assessments', label: 'Risk Assessments Tab', description: 'Risk assessment management', category: 'person' },
    { id: 'tab_compliance', label: 'Compliance Tab', description: 'Person-specific compliance (DBS, training)', category: 'compliance' },
    { id: 'tab_finance', label: 'Finance Tab', description: 'Rent account and transactions', category: 'finance' },
    { id: 'tab_documents', label: 'Documents Tab', description: 'Document library', category: 'person' },
    { id: 'tab_notes', label: 'Notes Tab', description: 'Notes and activity timeline', category: 'person' },

    // Person Fields
    { id: 'field_ni_number', label: 'NI Number', description: 'National Insurance Number field', category: 'person' },
    { id: 'field_emergency_contacts', label: 'Emergency Contacts', description: 'Emergency contact details', category: 'person' },
    { id: 'field_medical_needs', label: 'Medical Needs', description: 'Medication and medical requirements', category: 'person' },
    { id: 'field_dietary_requirements', label: 'Dietary Requirements', description: 'Food allergies and dietary needs', category: 'person' },
    { id: 'field_mobility_needs', label: 'Mobility Needs', description: 'Mobility and accessibility requirements', category: 'person' },

    // Property Features
    { id: 'property_void_management', label: 'Void Management', description: 'Track empty units and void periods', category: 'property' },
    { id: 'property_compliance', label: 'Property Compliance', description: 'Gas safety, EPC, fire safety, legionella', category: 'compliance' },
    { id: 'property_financial', label: 'Property Financials', description: 'Rent accounts, arrears, service charges', category: 'finance' },
    { id: 'property_repairs', label: 'Repairs & Maintenance', description: 'Repair requests and maintenance logs', category: 'property' },
];

const USER_GROUPS: Record<UserGroup, UserGroupConfig> = {
    'support-provider': {
        name: 'Support Provider',
        description: 'Delivers support services to people in housing',
        color: 'bg-blue-100 text-blue-700',
        features: {
            // Support providers need full person data, minimal property/finance
            tab_safeguarding: true,
            tab_asb: true,
            tab_support_plans: true,
            tab_risk_assessments: true,
            tab_compliance: true,
            tab_finance: false,
            tab_documents: true,
            tab_notes: true,
            field_ni_number: false,
            field_emergency_contacts: true,
            field_medical_needs: true,
            field_dietary_requirements: true,
            field_mobility_needs: true,
            property_void_management: false,
            property_compliance: false,
            property_financial: false,
            property_repairs: false,
        }
    },
    'care-provider': {
        name: 'Care Provider',
        description: 'Provides care services (medical, personal care)',
        color: 'bg-purple-100 text-purple-700',
        features: {
            // Care providers focus on health/medical needs
            tab_safeguarding: true,
            tab_asb: false,
            tab_support_plans: true,
            tab_risk_assessments: true,
            tab_compliance: true,
            tab_finance: false,
            tab_documents: true,
            tab_notes: true,
            field_ni_number: false,
            field_emergency_contacts: true,
            field_medical_needs: true,
            field_dietary_requirements: true,
            field_mobility_needs: true,
            property_void_management: false,
            property_compliance: false,
            property_financial: false,
            property_repairs: false,
        }
    },
    'registered-provider': {
        name: 'Registered Provider (Housing Association)',
        description: 'Manages properties and tenancies',
        color: 'bg-green-100 text-green-700',
        features: {
            // RPs need full access - they're the landlord
            tab_safeguarding: true,
            tab_asb: true,
            tab_support_plans: true,
            tab_risk_assessments: true,
            tab_compliance: true,
            tab_finance: true,
            tab_documents: true,
            tab_notes: true,
            field_ni_number: true,
            field_emergency_contacts: true,
            field_medical_needs: true,
            field_dietary_requirements: true,
            field_mobility_needs: true,
            property_void_management: true,
            property_compliance: true,
            property_financial: true,
            property_repairs: true,
        }
    },
    'council': {
        name: 'Council / Local Authority',
        description: 'Commissions services, monitors compliance',
        color: 'bg-amber-100 text-amber-700',
        features: {
            // Councils focus on compliance and safeguarding oversight
            tab_safeguarding: true,
            tab_asb: true,
            tab_support_plans: true,
            tab_risk_assessments: true,
            tab_compliance: true,
            tab_finance: false,
            tab_documents: true,
            tab_notes: false,
            field_ni_number: false,
            field_emergency_contacts: false,
            field_medical_needs: false,
            field_dietary_requirements: false,
            field_mobility_needs: false,
            property_void_management: true,
            property_compliance: true,
            property_financial: false,
            property_repairs: false,
        }
    },
    'nhs': {
        name: 'NHS',
        description: 'Healthcare provider and commissioner',
        color: 'bg-indigo-100 text-indigo-700',
        features: {
            // NHS focuses on health-related data
            tab_safeguarding: true,
            tab_asb: false,
            tab_support_plans: true,
            tab_risk_assessments: true,
            tab_compliance: false,
            tab_finance: false,
            tab_documents: true,
            tab_notes: true,
            field_ni_number: true,
            field_emergency_contacts: true,
            field_medical_needs: true,
            field_dietary_requirements: true,
            field_mobility_needs: true,
            property_void_management: false,
            property_compliance: false,
            property_financial: false,
            property_repairs: false,
        }
    }
};

export default function DeveloperSettings() {
    const { showToast } = useToast();
    const [activeGroup, setActiveGroup] = useState<UserGroup>('registered-provider');
    const [config, setConfig] = useState(USER_GROUPS);
    const [hasChanges, setHasChanges] = useState(false);

    // Load saved settings from localStorage on mount
    useEffect(() => {
        const savedConfig = localStorage.getItem('solas_user_group_config');
        const savedActiveGroup = localStorage.getItem('solas_active_user_group');

        if (savedConfig) {
            try {
                setConfig(JSON.parse(savedConfig));
            } catch (e) {
                console.error('Failed to load user group config:', e);
            }
        }

        if (savedActiveGroup) {
            setActiveGroup(savedActiveGroup as UserGroup);
        }
    }, []);

    const handleToggle = (featureId: string) => {
        setConfig(prev => ({
            ...prev,
            [activeGroup]: {
                ...prev[activeGroup],
                features: {
                    ...prev[activeGroup].features,
                    [featureId]: !prev[activeGroup].features[featureId]
                }
            }
        }));
        setHasChanges(true);
    };

    const handleSave = () => {
        // Save to localStorage
        localStorage.setItem('solas_user_group_config', JSON.stringify(config));
        localStorage.setItem('solas_active_user_group', activeGroup);
        setHasChanges(false);
        showToast('Settings saved successfully!', 'success');
    };

    const handleReset = () => {
        setConfig(USER_GROUPS);
        setHasChanges(true);
    };

    const currentConfig = config[activeGroup];

    const featuresByCategory = DEFAULT_FEATURES.reduce((acc, feature) => {
        if (!acc[feature.category]) acc[feature.category] = [];
        acc[feature.category].push(feature);
        return acc;
    }, {} as Record<string, FeatureToggle[]>);

    const categoryIcons = {
        person: <Users size={16} />,
        property: <Home size={16} />,
        compliance: <Shield size={16} />,
        finance: <span className="text-xs">£</span>
    };

    const categoryLabels = {
        person: 'Person Profile',
        property: 'Property Features',
        compliance: 'Compliance',
        finance: 'Finance'
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-ivolve-paper via-white to-ivolve-paper">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
                <div className="px-4 md:px-8 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3 mb-2">
                                <Code className="text-ivolve-mid" size={32} />
                                Developer Settings
                            </h1>
                            <p className="text-gray-500 text-sm md:text-base">
                                Configure feature toggles and field visibility per user group
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={handleReset}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center gap-2 font-semibold"
                            >
                                <RefreshCw size={18} />
                                Reset to Defaults
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!hasChanges}
                                className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-semibold ${
                                    hasChanges
                                        ? 'bg-ivolve-mid text-white hover:bg-ivolve-dark shadow-sm hover:shadow-md'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                <Save size={18} />
                                Save Changes
                            </button>
                        </div>
                    </div>

                    {/* User Group Selector */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {(Object.keys(USER_GROUPS) as UserGroup[]).map(groupKey => {
                            const group = USER_GROUPS[groupKey];
                            return (
                                <button
                                    key={groupKey}
                                    onClick={() => setActiveGroup(groupKey)}
                                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                                        activeGroup === groupKey
                                            ? `${group.color} shadow-sm`
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {group.name}
                                </button>
                            );
                        })}
                    </div>

                    {hasChanges && (
                        <div className="mt-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                            <strong>Unsaved changes.</strong> Click "Save Changes" to persist your configuration.
                        </div>
                    )}
                </div>
            </div>

            {/* Feature Toggles */}
            <div className="px-4 md:px-8 py-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-1">
                            <SettingsIcon size={20} className="text-ivolve-mid" />
                            {currentConfig.name}
                        </h2>
                        <p className="text-gray-500 text-sm">{currentConfig.description}</p>
                    </div>

                    {Object.entries(featuresByCategory).map(([category, features]) => (
                        <div key={category} className="mb-6 last:mb-0">
                            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                                {categoryIcons[category as keyof typeof categoryIcons]}
                                {categoryLabels[category as keyof typeof categoryLabels]}
                            </h3>

                            <div className="space-y-2">
                                {features.map(feature => {
                                    const isEnabled = currentConfig.features[feature.id];
                                    return (
                                        <label
                                            key={feature.id}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                        >
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-800">{feature.label}</div>
                                                <div className="text-sm text-gray-500">{feature.description}</div>
                                            </div>
                                            <div className="ml-4">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggle(feature.id)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                        isEnabled ? 'bg-ivolve-mid' : 'bg-gray-300'
                                                    }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                            isEnabled ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                    />
                                                </button>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="font-semibold text-blue-900 mb-2">How Feature Toggles Work</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Each user group can have different features enabled/disabled</li>
                        <li>• Settings are saved to localStorage and persist across sessions</li>
                        <li>• Changes require a page refresh to take effect</li>
                        <li>• Default configurations are based on typical user group needs</li>
                        <li>• Disabling a tab/field hides it from the UI but doesn't delete data</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
