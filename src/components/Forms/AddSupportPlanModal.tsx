import { useState, useEffect } from 'react';
import { X, FileText, Save, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { SupportPlan } from '../../types';
import { Button } from '../shared/Button';

interface AddSupportPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (plan: SupportPlan) => void;
    personId: string;
}

type PlanType = 'Care Plan' | 'Support Plan' | 'Move-On Plan' | 'Rehabilitation Plan';
type PlanStatus = 'Current' | 'Overdue' | 'Completed' | 'Draft';

export default function AddSupportPlanModal({
    isOpen,
    onClose,
    onSave,
    personId
}: AddSupportPlanModalProps) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Form state
    const [planType, setPlanType] = useState<PlanType>('Support Plan');
    const [dateCreated, setDateCreated] = useState('');
    const [reviewDate, setReviewDate] = useState('');
    const [nextDueDate, setNextDueDate] = useState('');
    const [status, setStatus] = useState<PlanStatus>('Current');
    const [assignedTo, setAssignedTo] = useState('');
    const [notes, setNotes] = useState('');
    const [goals, setGoals] = useState<string[]>(['']);
    const [actions, setActions] = useState<string[]>(['']);

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
        setPlanType('Support Plan');
        setDateCreated(today);
        setReviewDate('');
        setNextDueDate('');
        setStatus('Current');
        setAssignedTo('');
        setNotes('');
        setGoals(['']);
        setActions(['']);
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!dateCreated) newErrors.dateCreated = 'Date created is required';
        if (!reviewDate) newErrors.reviewDate = 'Review date is required';
        if (!nextDueDate) newErrors.nextDueDate = 'Next due date is required';
        if (!assignedTo.trim()) newErrors.assignedTo = 'Assigned to is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;

        // Filter out empty goals and actions
        const filteredGoals = goals.filter(g => g.trim() !== '');
        const filteredActions = actions.filter(a => a.trim() !== '');

        const newPlan: SupportPlan = {
            id: crypto.randomUUID ? crypto.randomUUID() : `plan_${Date.now()}`,
            personId,
            planType,
            dateCreated,
            reviewDate,
            nextDueDate,
            status,
            goals: filteredGoals.length > 0 ? filteredGoals : undefined,
            actions: filteredActions.length > 0 ? filteredActions : undefined,
            notes: notes.trim() || undefined,
            assignedTo: assignedTo.trim(),
            createdBy: 'Current User', // TODO: Replace with actual user
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        onSave(newPlan);
        onClose();
        resetForm();
    };

    // Goal management
    const addGoal = () => {
        setGoals([...goals, '']);
    };

    const updateGoal = (index: number, value: string) => {
        const updated = [...goals];
        updated[index] = value;
        setGoals(updated);
    };

    const removeGoal = (index: number) => {
        if (goals.length > 1) {
            setGoals(goals.filter((_, i) => i !== index));
        }
    };

    // Action management
    const addAction = () => {
        setActions([...actions, '']);
    };

    const updateAction = (index: number, value: string) => {
        const updated = [...actions];
        updated[index] = value;
        setActions(updated);
    };

    const removeAction = (index: number) => {
        if (actions.length > 1) {
            setActions(actions.filter((_, i) => i !== index));
        }
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
                        <div className="w-12 h-12 rounded-lg bg-ivolve-mid/10 flex items-center justify-center">
                            <FileText size={24} className="text-ivolve-mid" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Add Support Plan</h2>
                            <p className="text-sm text-gray-500">Create a new support plan</p>
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
                        {/* Plan Details */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">Plan Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Plan Type
                                    </label>
                                    <select
                                        value={planType}
                                        onChange={e => setPlanType(e.target.value as PlanType)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                    >
                                        <option value="Care Plan">Care Plan</option>
                                        <option value="Support Plan">Support Plan</option>
                                        <option value="Move-On Plan">Move-On Plan</option>
                                        <option value="Rehabilitation Plan">Rehabilitation Plan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        value={status}
                                        onChange={e => setStatus(e.target.value as PlanStatus)}
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

                        {/* Assignment */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Assigned To (Key Worker / Case Manager) <span className="text-ivolve-rouge">*</span>
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

                        {/* Goals */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-gray-700">Goals</h3>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={addGoal}
                                    leftIcon={<Plus size={16} />}
                                >
                                    Add Goal
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {goals.map((goal, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={goal}
                                                onChange={e => updateGoal(index, e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                                placeholder={`Goal ${index + 1}`}
                                            />
                                        </div>
                                        {goals.length > 1 && (
                                            <button
                                                onClick={() => removeGoal(index)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                title="Remove goal"
                                            >
                                                <Trash2 size={18} className="text-gray-400" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-gray-700">Actions</h3>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={addAction}
                                    leftIcon={<Plus size={16} />}
                                >
                                    Add Action
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {actions.map((action, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={action}
                                                onChange={e => updateAction(index, e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                                placeholder={`Action ${index + 1}`}
                                            />
                                        </div>
                                        {actions.length > 1 && (
                                            <button
                                                onClick={() => removeAction(index)}
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

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Notes
                            </label>
                            <textarea
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent resize-none"
                                placeholder="Additional notes about this support plan..."
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave} leftIcon={<Save size={16} />}>
                        Save Plan
                    </Button>
                </div>
            </div>
        </div>
    );
}
