import { useState, useEffect } from 'react';
import { X, Shield, Save, AlertCircle, Plus, Trash2 } from 'lucide-react';
import {
    SafeguardingCase,
    SafeguardingCategory,
    SafeguardingLevel,
    SafeguardingSource,
    CaseStatus,
    SafeguardingParty,
    SafeguardingIncident
} from '../../types';
import { Button } from '../shared/Button';

interface AddSafeguardingCaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (safeguardingCase: SafeguardingCase) => void;
    personId: string;
}

export default function AddSafeguardingCaseModal({
    isOpen,
    onClose,
    onSave,
    personId
}: AddSafeguardingCaseModalProps) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Form state
    const [reportedDate, setReportedDate] = useState('');
    const [openedDate, setOpenedDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [closedDate, setClosedDate] = useState('');
    const [category, setCategory] = useState<SafeguardingCategory>('Physical Abuse');
    const [level, setLevel] = useState<SafeguardingLevel>('Level 1');
    const [source, setSource] = useState<SafeguardingSource>('Phone Call');
    const [status, setStatus] = useState<CaseStatus>('Open');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [stage, setStage] = useState('Investigation');
    const [outcome, setOutcome] = useState('');
    const [parties, setParties] = useState<SafeguardingParty[]>([]);
    const [incidents, setIncidents] = useState<SafeguardingIncident[]>([]);

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            resetForm();
        }
    }, [isOpen]);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Keyboard handling
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const resetForm = () => {
        setErrors({});
        const today = new Date().toISOString().split('T')[0];
        setReportedDate(today);
        setOpenedDate(today);
        setDueDate('');
        setClosedDate('');
        setCategory('Physical Abuse');
        setLevel('Level 1');
        setSource('Phone Call');
        setStatus('Open');
        setDescription('');
        setAssignedTo('');
        setStage('Investigation');
        setOutcome('');
        setParties([]);
        setIncidents([]);
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!reportedDate) newErrors.reportedDate = 'Reported date is required';
        if (!openedDate) newErrors.openedDate = 'Opened date is required';
        if (!description.trim()) newErrors.description = 'Description is required';
        if (!assignedTo.trim()) newErrors.assignedTo = 'Assigned to is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;

        const newCase: SafeguardingCase = {
            id: crypto.randomUUID ? crypto.randomUUID() : `safe_${Date.now()}`,
            caseReference: `SAF${new Date().getFullYear()}/${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
            personId,
            reportedDate,
            openedDate,
            dueDate: dueDate || undefined,
            closedDate: closedDate || undefined,
            source,
            status,
            category,
            level,
            assignedTo: assignedTo.trim(),
            stage,
            outcome: outcome.trim() || undefined,
            description: description.trim(),
            parties,
            incidents,
            createdBy: 'Current User', // TODO: Replace with actual user
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        onSave(newCase);
        onClose();
        resetForm();
    };

    // Party management
    const addParty = () => {
        setParties([
            ...parties,
            {
                id: crypto.randomUUID ? crypto.randomUUID() : `party_${Date.now()}`,
                firstName: '',
                lastName: '',
                type: 'Victim',
                unknown: false
            }
        ]);
    };

    const updateParty = (index: number, field: keyof SafeguardingParty, value: any) => {
        const updated = [...parties];
        updated[index] = { ...updated[index], [field]: value };
        setParties(updated);
    };

    const removeParty = (index: number) => {
        setParties(parties.filter((_, i) => i !== index));
    };

    // Incident management
    const addIncident = () => {
        setIncidents([
            ...incidents,
            {
                id: crypto.randomUUID ? crypto.randomUUID() : `incident_${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                category: '',
                description: '',
                location: ''
            }
        ]);
    };

    const updateIncident = (index: number, field: keyof SafeguardingIncident, value: any) => {
        const updated = [...incidents];
        updated[index] = { ...updated[index], [field]: value };
        setIncidents(updated);
    };

    const removeIncident = (index: number) => {
        setIncidents(incidents.filter((_, i) => i !== index));
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl my-8"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-ivolve-rouge/10 flex items-center justify-center">
                            <Shield size={24} className="text-ivolve-rouge" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Add Safeguarding Case</h2>
                            <p className="text-sm text-gray-500">Record a new safeguarding concern</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Close"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Form Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-6">
                        {/* Basic Details */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">Case Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Reported Date <span className="text-ivolve-rouge">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={reportedDate}
                                        onChange={e => setReportedDate(e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent ${
                                            errors.reportedDate ? 'border-ivolve-rouge' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.reportedDate && (
                                        <p className="text-sm text-ivolve-rouge mt-1 flex items-center gap-1">
                                            <AlertCircle size={14} />
                                            {errors.reportedDate}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Opened Date <span className="text-ivolve-rouge">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={openedDate}
                                        onChange={e => setOpenedDate(e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent ${
                                            errors.openedDate ? 'border-ivolve-rouge' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.openedDate && (
                                        <p className="text-sm text-ivolve-rouge mt-1 flex items-center gap-1">
                                            <AlertCircle size={14} />
                                            {errors.openedDate}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Due Date
                                    </label>
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={e => setDueDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Closed Date
                                    </label>
                                    <input
                                        type="date"
                                        value={closedDate}
                                        onChange={e => setClosedDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Classification */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">Classification</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        value={category}
                                        onChange={e => setCategory(e.target.value as SafeguardingCategory)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                    >
                                        <option value="Physical Abuse">Physical Abuse</option>
                                        <option value="Emotional Abuse">Emotional Abuse</option>
                                        <option value="Financial Abuse">Financial Abuse</option>
                                        <option value="Neglect">Neglect</option>
                                        <option value="Sexual Abuse">Sexual Abuse</option>
                                        <option value="Discrimination">Discrimination</option>
                                        <option value="Self-Neglect">Self-Neglect</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Level
                                    </label>
                                    <select
                                        value={level}
                                        onChange={e => setLevel(e.target.value as SafeguardingLevel)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                    >
                                        <option value="Level 1">Level 1</option>
                                        <option value="Level 2">Level 2</option>
                                        <option value="Level 3">Level 3</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Source
                                    </label>
                                    <select
                                        value={source}
                                        onChange={e => setSource(e.target.value as SafeguardingSource)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                    >
                                        <option value="Phone Call">Phone Call</option>
                                        <option value="Email">Email</option>
                                        <option value="In Person">In Person</option>
                                        <option value="Anonymous">Anonymous</option>
                                        <option value="Police">Police</option>
                                        <option value="Social Services">Social Services</option>
                                        <option value="Family">Family</option>
                                        <option value="Neighbour">Neighbour</option>
                                        <option value="Staff Observation">Staff Observation</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Status & Assignment */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">Status & Assignment</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        value={status}
                                        onChange={e => setStatus(e.target.value as CaseStatus)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                    >
                                        <option value="Open">Open</option>
                                        <option value="Closed">Closed</option>
                                        <option value="Monitoring">Monitoring</option>
                                        <option value="Investigation">Investigation</option>
                                        <option value="Referred">Referred</option>
                                        <option value="Resolved">Resolved</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Assigned To <span className="text-ivolve-rouge">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={assignedTo}
                                        onChange={e => setAssignedTo(e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent ${
                                            errors.assignedTo ? 'border-ivolve-rouge' : 'border-gray-300'
                                        }`}
                                        placeholder="Staff member name"
                                    />
                                    {errors.assignedTo && (
                                        <p className="text-sm text-ivolve-rouge mt-1 flex items-center gap-1">
                                            <AlertCircle size={14} />
                                            {errors.assignedTo}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Stage
                                    </label>
                                    <input
                                        type="text"
                                        value={stage}
                                        onChange={e => setStage(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                        placeholder="e.g., Investigation, Monitoring"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description <span className="text-ivolve-rouge">*</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                rows={4}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent resize-none ${
                                    errors.description ? 'border-ivolve-rouge' : 'border-gray-300'
                                }`}
                                placeholder="Detailed description of the safeguarding concern..."
                            />
                            {errors.description && (
                                <p className="text-sm text-ivolve-rouge mt-1 flex items-center gap-1">
                                    <AlertCircle size={14} />
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Outcome */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Outcome
                            </label>
                            <textarea
                                value={outcome}
                                onChange={e => setOutcome(e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent resize-none"
                                placeholder="Case outcome (if resolved)..."
                            />
                        </div>

                        {/* Parties Involved */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-gray-700">Parties Involved</h3>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={addParty}
                                    leftIcon={<Plus size={16} />}
                                >
                                    Add Party
                                </Button>
                            </div>
                            {parties.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                    <p className="text-sm text-gray-500">No parties added</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {parties.map((party, index) => (
                                        <div key={party.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-medium text-gray-700">Party {index + 1}</span>
                                                <button
                                                    onClick={() => removeParty(index)}
                                                    className="p-1 hover:bg-gray-200 rounded"
                                                    title="Remove party"
                                                >
                                                    <Trash2 size={16} className="text-gray-400" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        First Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={party.firstName}
                                                        onChange={e => updateParty(index, 'firstName', e.target.value)}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        Last Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={party.lastName}
                                                        onChange={e => updateParty(index, 'lastName', e.target.value)}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        Type
                                                    </label>
                                                    <select
                                                        value={party.type}
                                                        onChange={e => updateParty(index, 'type', e.target.value)}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                                    >
                                                        <option value="Victim">Victim</option>
                                                        <option value="Perpetrator">Perpetrator</option>
                                                        <option value="Witness">Witness</option>
                                                        <option value="Reporter">Reporter</option>
                                                    </select>
                                                </div>
                                                <div className="flex items-end">
                                                    <label className="flex items-center gap-2 cursor-pointer pb-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={party.unknown}
                                                            onChange={e => updateParty(index, 'unknown', e.target.checked)}
                                                            className="w-4 h-4 text-ivolve-mid border-gray-300 rounded focus:ring-ivolve-mid"
                                                        />
                                                        <span className="text-xs text-gray-700">Unknown</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Incidents */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-gray-700">Incidents</h3>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={addIncident}
                                    leftIcon={<Plus size={16} />}
                                >
                                    Add Incident
                                </Button>
                            </div>
                            {incidents.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                    <p className="text-sm text-gray-500">No incidents recorded</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {incidents.map((incident, index) => (
                                        <div key={incident.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-medium text-gray-700">Incident {index + 1}</span>
                                                <button
                                                    onClick={() => removeIncident(index)}
                                                    className="p-1 hover:bg-gray-200 rounded"
                                                    title="Remove incident"
                                                >
                                                    <Trash2 size={16} className="text-gray-400" />
                                                </button>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                                            Date
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={incident.date}
                                                            onChange={e => updateIncident(index, 'date', e.target.value)}
                                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                                            Category
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={incident.category}
                                                            onChange={e => updateIncident(index, 'category', e.target.value)}
                                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                                            placeholder="e.g., Verbal abuse"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                                            Location
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={incident.location || ''}
                                                            onChange={e => updateIncident(index, 'location', e.target.value)}
                                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                                            placeholder="Where it occurred"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        Description
                                                    </label>
                                                    <textarea
                                                        value={incident.description}
                                                        onChange={e => updateIncident(index, 'description', e.target.value)}
                                                        rows={2}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent resize-none"
                                                        placeholder="What happened..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave} leftIcon={<Save size={16} />}>
                        Save Case
                    </Button>
                </div>
            </div>
        </div>
    );
}
