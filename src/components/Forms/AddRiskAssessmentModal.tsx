import { useState, useEffect } from 'react';
import { X, AlertTriangle, Save, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { RiskAssessment, RiskItem } from '../../types';
import { Button } from '../shared/Button';

interface AddRiskAssessmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (assessment: RiskAssessment) => void;
    personId: string;
}

type AssessmentType = 'General' | 'Fire' | 'Moving & Handling' | 'Safeguarding' | 'Health & Safety' | 'Substance Use';
type AssessmentStatus = 'Current' | 'Overdue' | 'Completed' | 'Draft';
type RiskLevel = 'Low' | 'Medium' | 'High';

export default function AddRiskAssessmentModal({
    isOpen,
    onClose,
    onSave,
    personId
}: AddRiskAssessmentModalProps) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Form state
    const [assessmentType, setAssessmentType] = useState<AssessmentType>('General');
    const [dateCreated, setDateCreated] = useState('');
    const [reviewDate, setReviewDate] = useState('');
    const [nextDueDate, setNextDueDate] = useState('');
    const [overallRiskLevel, setOverallRiskLevel] = useState<RiskLevel>('Low');
    const [status, setStatus] = useState<AssessmentStatus>('Current');
    const [assessedBy, setAssessedBy] = useState('');
    const [risks, setRisks] = useState<RiskItem[]>([]);
    const [mitigationActions, setMitigationActions] = useState<string[]>(['']);

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
        setAssessmentType('General');
        setDateCreated(today);
        setReviewDate('');
        setNextDueDate('');
        setOverallRiskLevel('Low');
        setStatus('Current');
        setAssessedBy('');
        setRisks([]);
        setMitigationActions(['']);
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!dateCreated) newErrors.dateCreated = 'Date created is required';
        if (!reviewDate) newErrors.reviewDate = 'Review date is required';
        if (!nextDueDate) newErrors.nextDueDate = 'Next due date is required';
        if (!assessedBy.trim()) newErrors.assessedBy = 'Assessed by is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateRiskLevel = (likelihood: RiskLevel, impact: RiskLevel): RiskLevel => {
        const matrix: Record<string, RiskLevel> = {
            'Low-Low': 'Low',
            'Low-Medium': 'Low',
            'Low-High': 'Medium',
            'Medium-Low': 'Low',
            'Medium-Medium': 'Medium',
            'Medium-High': 'High',
            'High-Low': 'Medium',
            'High-Medium': 'High',
            'High-High': 'High'
        };
        return matrix[`${likelihood}-${impact}`] || 'Medium';
    };

    const handleSave = () => {
        if (!validate()) return;

        // Filter out empty mitigation actions
        const filteredMitigationActions = mitigationActions.filter(a => a.trim() !== '');

        const newAssessment: RiskAssessment = {
            id: crypto.randomUUID ? crypto.randomUUID() : `risk_${Date.now()}`,
            personId,
            assessmentType,
            dateCreated,
            reviewDate,
            nextDueDate,
            overallRiskLevel,
            risks,
            mitigationActions: filteredMitigationActions,
            status,
            assessedBy: assessedBy.trim(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        onSave(newAssessment);
        onClose();
        resetForm();
    };

    // Risk management
    const addRisk = () => {
        setRisks([
            ...risks,
            {
                id: crypto.randomUUID ? crypto.randomUUID() : `risk_item_${Date.now()}`,
                category: '',
                description: '',
                likelihood: 'Low',
                impact: 'Low',
                riskLevel: 'Low',
                mitigationActions: []
            }
        ]);
    };

    const updateRisk = (index: number, field: keyof RiskItem, value: any) => {
        const updated = [...risks];
        updated[index] = { ...updated[index], [field]: value };

        // Auto-calculate risk level if likelihood or impact changed
        if (field === 'likelihood' || field === 'impact') {
            const risk = updated[index];
            updated[index].riskLevel = calculateRiskLevel(risk.likelihood, risk.impact);
        }

        setRisks(updated);
    };

    const removeRisk = (index: number) => {
        setRisks(risks.filter((_, i) => i !== index));
    };

    // Risk mitigation management
    const addRiskMitigation = (riskIndex: number) => {
        const updated = [...risks];
        updated[riskIndex].mitigationActions.push('');
        setRisks(updated);
    };

    const updateRiskMitigation = (riskIndex: number, mitigationIndex: number, value: string) => {
        const updated = [...risks];
        updated[riskIndex].mitigationActions[mitigationIndex] = value;
        setRisks(updated);
    };

    const removeRiskMitigation = (riskIndex: number, mitigationIndex: number) => {
        const updated = [...risks];
        updated[riskIndex].mitigationActions = updated[riskIndex].mitigationActions.filter(
            (_, i) => i !== mitigationIndex
        );
        setRisks(updated);
    };

    // Mitigation action management
    const addMitigationAction = () => {
        setMitigationActions([...mitigationActions, '']);
    };

    const updateMitigationAction = (index: number, value: string) => {
        const updated = [...mitigationActions];
        updated[index] = value;
        setMitigationActions(updated);
    };

    const removeMitigationAction = (index: number) => {
        if (mitigationActions.length > 1) {
            setMitigationActions(mitigationActions.filter((_, i) => i !== index));
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-5xl bg-white rounded-xl shadow-2xl my-8"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                            <AlertTriangle size={24} className="text-amber-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Add Risk Assessment</h2>
                            <p className="text-sm text-gray-500">Create a new risk assessment</p>
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
                        {/* Assessment Details */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">Assessment Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Assessment Type
                                    </label>
                                    <select
                                        value={assessmentType}
                                        onChange={e => setAssessmentType(e.target.value as AssessmentType)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                    >
                                        <option value="General">General</option>
                                        <option value="Fire">Fire</option>
                                        <option value="Moving & Handling">Moving & Handling</option>
                                        <option value="Safeguarding">Safeguarding</option>
                                        <option value="Health & Safety">Health & Safety</option>
                                        <option value="Substance Use">Substance Use</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        value={status}
                                        onChange={e => setStatus(e.target.value as AssessmentStatus)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                    >
                                        <option value="Current">Current</option>
                                        <option value="Overdue">Overdue</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Draft">Draft</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Dates */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">Dates</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date Created <span className="text-ivolve-rouge">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={dateCreated}
                                        onChange={e => setDateCreated(e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent ${
                                            errors.dateCreated ? 'border-ivolve-rouge' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.dateCreated && (
                                        <p className="text-sm text-ivolve-rouge mt-1 flex items-center gap-1">
                                            <AlertCircle size={14} />
                                            {errors.dateCreated}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Review Date <span className="text-ivolve-rouge">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={reviewDate}
                                        onChange={e => setReviewDate(e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent ${
                                            errors.reviewDate ? 'border-ivolve-rouge' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.reviewDate && (
                                        <p className="text-sm text-ivolve-rouge mt-1 flex items-center gap-1">
                                            <AlertCircle size={14} />
                                            {errors.reviewDate}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Next Due Date <span className="text-ivolve-rouge">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={nextDueDate}
                                        onChange={e => setNextDueDate(e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent ${
                                            errors.nextDueDate ? 'border-ivolve-rouge' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.nextDueDate && (
                                        <p className="text-sm text-ivolve-rouge mt-1 flex items-center gap-1">
                                            <AlertCircle size={14} />
                                            {errors.nextDueDate}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Assignment & Overall Risk */}
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Assessed By <span className="text-ivolve-rouge">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={assessedBy}
                                        onChange={e => setAssessedBy(e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent ${
                                            errors.assessedBy ? 'border-ivolve-rouge' : 'border-gray-300'
                                        }`}
                                        placeholder="Staff member name"
                                    />
                                    {errors.assessedBy && (
                                        <p className="text-sm text-ivolve-rouge mt-1 flex items-center gap-1">
                                            <AlertCircle size={14} />
                                            {errors.assessedBy}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Overall Risk Level
                                    </label>
                                    <select
                                        value={overallRiskLevel}
                                        onChange={e => setOverallRiskLevel(e.target.value as RiskLevel)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Risks */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-gray-700">Risk Categories</h3>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={addRisk}
                                    leftIcon={<Plus size={16} />}
                                >
                                    Add Risk
                                </Button>
                            </div>
                            {risks.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                    <p className="text-sm text-gray-500">No risks identified yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {risks.map((risk, index) => (
                                        <div key={risk.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-medium text-gray-700">Risk {index + 1}</span>
                                                <button
                                                    onClick={() => removeRisk(index)}
                                                    className="p-1 hover:bg-gray-200 rounded"
                                                    title="Remove risk"
                                                >
                                                    <Trash2 size={16} className="text-gray-400" />
                                                </button>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                                            Category
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={risk.category}
                                                            onChange={e => updateRisk(index, 'category', e.target.value)}
                                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                                            placeholder="e.g., Self-harm, Violence, Falls"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                                Likelihood
                                                            </label>
                                                            <select
                                                                value={risk.likelihood}
                                                                onChange={e => updateRisk(index, 'likelihood', e.target.value)}
                                                                className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                                            >
                                                                <option value="Low">Low</option>
                                                                <option value="Medium">Med</option>
                                                                <option value="High">High</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                                Impact
                                                            </label>
                                                            <select
                                                                value={risk.impact}
                                                                onChange={e => updateRisk(index, 'impact', e.target.value)}
                                                                className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                                            >
                                                                <option value="Low">Low</option>
                                                                <option value="Medium">Med</option>
                                                                <option value="High">High</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                                Risk
                                                            </label>
                                                            <div
                                                                className={`px-2 py-2 text-sm font-medium rounded-lg text-center ${
                                                                    risk.riskLevel === 'Low'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : risk.riskLevel === 'Medium'
                                                                        ? 'bg-amber-100 text-amber-800'
                                                                        : 'bg-red-100 text-red-800'
                                                                }`}
                                                            >
                                                                {risk.riskLevel}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        Description
                                                    </label>
                                                    <textarea
                                                        value={risk.description}
                                                        onChange={e => updateRisk(index, 'description', e.target.value)}
                                                        rows={2}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent resize-none"
                                                        placeholder="Describe the risk..."
                                                    />
                                                </div>
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <label className="block text-xs font-medium text-gray-600">
                                                            Mitigation Actions
                                                        </label>
                                                        <button
                                                            onClick={() => addRiskMitigation(index)}
                                                            className="text-xs text-ivolve-mid hover:text-ivolve-dark font-medium"
                                                        >
                                                            + Add Action
                                                        </button>
                                                    </div>
                                                    {risk.mitigationActions.length === 0 ? (
                                                        <p className="text-xs text-gray-400 italic">No mitigation actions added</p>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            {risk.mitigationActions.map((action, actionIndex) => (
                                                                <div key={actionIndex} className="flex items-center gap-2">
                                                                    <input
                                                                        type="text"
                                                                        value={action}
                                                                        onChange={e =>
                                                                            updateRiskMitigation(index, actionIndex, e.target.value)
                                                                        }
                                                                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                                                        placeholder={`Mitigation ${actionIndex + 1}`}
                                                                    />
                                                                    <button
                                                                        onClick={() => removeRiskMitigation(index, actionIndex)}
                                                                        className="p-1 hover:bg-gray-200 rounded"
                                                                    >
                                                                        <X size={14} className="text-gray-400" />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Overall Mitigation Actions */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-gray-700">Overall Mitigation Actions</h3>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={addMitigationAction}
                                    leftIcon={<Plus size={16} />}
                                >
                                    Add Action
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {mitigationActions.map((action, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={action}
                                                onChange={e => updateMitigationAction(index, e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                                placeholder={`Mitigation action ${index + 1}`}
                                            />
                                        </div>
                                        {mitigationActions.length > 1 && (
                                            <button
                                                onClick={() => removeMitigationAction(index)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                title="Remove action"
                                            >
                                                <Trash2 size={18} className="text-gray-400" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave} leftIcon={<Save size={16} />}>
                        Save Assessment
                    </Button>
                </div>
            </div>
        </div>
    );
}
