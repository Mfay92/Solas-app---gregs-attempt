import { X, PlusCircle, FileText, PoundSterling, Home } from 'lucide-react';

interface PanelOption {
    id: string;
    label: string;
    description: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    color: string;
    colorClasses: {
        bg: string;
        bgHover: string;
        border: string;
        borderHover: string;
        text: string;
        iconBg: string;
        iconBgHover: string;
    };
}

interface SelectPanelModalProps {
    onSelect: (panelId: string) => void;
    onClose: () => void;
}

const AVAILABLE_PANELS: PanelOption[] = [
    {
        id: 'support-plan',
        label: 'Support Plan',
        description: 'View current support plan details and review dates',
        icon: FileText,
        color: 'blue',
        colorClasses: {
            bg: 'bg-white',
            bgHover: 'hover:bg-blue-50',
            border: 'border-gray-200',
            borderHover: 'hover:border-blue-500',
            text: 'text-blue-600',
            iconBg: 'bg-blue-100',
            iconBgHover: 'group-hover:bg-blue-200'
        }
    },
    {
        id: 'rent-details',
        label: 'Rent Details',
        description: 'Quick access to rent amount, payment status, and arrears',
        icon: PoundSterling,
        color: 'green',
        colorClasses: {
            bg: 'bg-white',
            bgHover: 'hover:bg-green-50',
            border: 'border-gray-200',
            borderHover: 'hover:border-green-500',
            text: 'text-green-600',
            iconBg: 'bg-green-100',
            iconBgHover: 'group-hover:bg-green-200'
        }
    },
    {
        id: 'landlord-details',
        label: 'Landlord Details',
        description: 'Landlord contact information and property manager details',
        icon: Home,
        color: 'purple',
        colorClasses: {
            bg: 'bg-white',
            bgHover: 'hover:bg-purple-50',
            border: 'border-gray-200',
            borderHover: 'hover:border-purple-500',
            text: 'text-purple-600',
            iconBg: 'bg-purple-100',
            iconBgHover: 'group-hover:bg-purple-200'
        }
    }
];

export default function SelectPanelModal({ onSelect, onClose }: SelectPanelModalProps) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-100">
                            <PlusCircle size={24} className="text-amber-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Add Panel</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        type="button"
                    >
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                {/* Panel Options */}
                <div className="p-6 space-y-3">
                    <p className="text-sm text-gray-600 mb-4">
                        Select a panel to add to the Notice Board:
                    </p>

                    {AVAILABLE_PANELS.map((panel) => {
                        const Icon = panel.icon;
                        return (
                            <button
                                key={panel.id}
                                onClick={() => onSelect(panel.id)}
                                className={`
                                    w-full p-4 rounded-lg border-2 transition-all text-left group
                                    ${panel.colorClasses.bg} ${panel.colorClasses.bgHover}
                                    ${panel.colorClasses.border} ${panel.colorClasses.borderHover}
                                `}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg transition-colors ${panel.colorClasses.iconBg} ${panel.colorClasses.iconBgHover}`}>
                                        <Icon size={20} className={panel.colorClasses.text} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-800 text-sm mb-1">
                                            {panel.label}
                                        </h3>
                                        <p className="text-xs text-gray-600">
                                            {panel.description}
                                        </p>
                                    </div>
                                    <PlusCircle size={16} className="text-gray-400 group-hover:text-ivolve-mid transition-colors mt-1" />
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="p-6 pt-0">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
