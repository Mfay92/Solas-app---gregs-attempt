import { useState, useEffect } from 'react';
import {
    X, User, Phone, Save, ChevronRight, ChevronLeft,
    UserCircle, Building, LifeBuoy, AlertCircle,
    type LucideIcon
} from 'lucide-react';
import {
    Person,
    Title,
    OccupantType,
    TenancyType,
    TenancyStatus,
    EmergencyContact
} from '../../types';
import { Button } from '../shared/Button';

interface AddPersonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (person: Person) => void;
    properties?: Array<{ id: string; address: string; postcode: string }>;
}

type FormStep = 'personal' | 'tenancy' | 'support' | 'emergency';

const STEPS: { id: FormStep; label: string; icon: LucideIcon }[] = [
    { id: 'personal', label: 'Personal Details', icon: UserCircle },
    { id: 'tenancy', label: 'Tenancy', icon: Building },
    { id: 'support', label: 'Support & Care', icon: LifeBuoy },
    { id: 'emergency', label: 'Emergency Contacts', icon: Phone }
];

export default function AddPersonModal({
    isOpen,
    onClose,
    onSave,
    properties = []
}: AddPersonModalProps) {
    const [currentStep, setCurrentStep] = useState<FormStep>('personal');
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Form state - Personal
    const [title, setTitle] = useState<Title>('Mr');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [preferredName, setPreferredName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [niNumber, setNiNumber] = useState('');
    const [occupantType, setOccupantType] = useState<OccupantType>('Main Tenant');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [mobile, setMobile] = useState('');

    // Form state - Tenancy
    const [propertyId, setPropertyId] = useState('');
    const [unitId, setUnitId] = useState('');
    const [room, setRoom] = useState('');
    const [tenancyType, setTenancyType] = useState<TenancyType>('Assured');
    const [tenancyStatus, setTenancyStatus] = useState<TenancyStatus>('Current');
    const [moveInDate, setMoveInDate] = useState('');
    const [moveOutDate, setMoveOutDate] = useState('');

    // Form state - Support
    const [careProvider, setCareProvider] = useState('');
    const [socialWorker, setSocialWorker] = useState('');
    const [keyWorker, setKeyWorker] = useState('');
    const [caseManager, setCaseManager] = useState('');
    const [careHours, setCareHours] = useState('');
    const [supportLevel, setSupportLevel] = useState<'Low' | 'Medium' | 'High' | 'Intensive'>('Medium');
    const [medicationNeeds, setMedicationNeeds] = useState('');
    const [dietaryRequirements, setDietaryRequirements] = useState('');
    const [mobilityNeeds, setMobilityNeeds] = useState('');

    // Form state - Finance (basic)
    const [rentAmount, setRentAmount] = useState('');
    const [serviceCharge, setServiceCharge] = useState('');
    const [supportCharge, setSupportCharge] = useState('');
    const [housingBenefit, setHousingBenefit] = useState(false);

    // Form state - Emergency Contacts
    const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);

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
        setCurrentStep('personal');
        setErrors({});
        // Personal
        setTitle('Mr');
        setFirstName('');
        setLastName('');
        setPreferredName('');
        setDateOfBirth('');
        setNiNumber('');
        setOccupantType('Main Tenant');
        setEmail('');
        setPhone('');
        setMobile('');
        // Tenancy
        setPropertyId('');
        setUnitId('');
        setRoom('');
        setTenancyType('Assured');
        setTenancyStatus('Current');
        setMoveInDate('');
        setMoveOutDate('');
        // Support
        setCareProvider('');
        setSocialWorker('');
        setKeyWorker('');
        setCaseManager('');
        setCareHours('');
        setSupportLevel('Medium');
        setMedicationNeeds('');
        setDietaryRequirements('');
        setMobilityNeeds('');
        // Finance
        setRentAmount('');
        setServiceCharge('');
        setSupportCharge('');
        setHousingBenefit(false);
        // Emergency
        setEmergencyContacts([]);
    };

    const validateCurrentStep = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (currentStep === 'personal') {
            if (!firstName.trim()) newErrors.firstName = 'First name is required';
            if (!lastName.trim()) newErrors.lastName = 'Last name is required';
        }

        if (currentStep === 'tenancy') {
            if (!propertyId) newErrors.propertyId = 'Property is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (!validateCurrentStep()) return;

        const currentIndex = STEPS.findIndex(s => s.id === currentStep);
        if (currentIndex < STEPS.length - 1) {
            setCurrentStep(STEPS[currentIndex + 1].id);
        }
    };

    const handlePrevious = () => {
        const currentIndex = STEPS.findIndex(s => s.id === currentStep);
        if (currentIndex > 0) {
            setCurrentStep(STEPS[currentIndex - 1].id);
        }
    };

    const handleSave = () => {
        if (!validateCurrentStep()) return;

        // Final validation
        if (!firstName.trim() || !lastName.trim() || !propertyId) {
            setErrors({
                firstName: !firstName.trim() ? 'First name is required' : '',
                lastName: !lastName.trim() ? 'Last name is required' : '',
                propertyId: !propertyId ? 'Property is required' : ''
            });
            setCurrentStep('personal');
            return;
        }

        const selectedProperty = properties.find(p => p.id === propertyId);
        const propertyAddress = selectedProperty
            ? `${selectedProperty.address}, ${selectedProperty.postcode}`
            : '';

        // Calculate age if DOB provided
        let age: number | undefined;
        if (dateOfBirth) {
            const today = new Date();
            const birthDate = new Date(dateOfBirth);
            age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
        }

        // Calculate total charges
        const rent = parseFloat(rentAmount) || 0;
        const service = parseFloat(serviceCharge) || 0;
        const support = parseFloat(supportCharge) || 0;
        const totalCharges = rent + service + support;

        const newPerson: Person = {
            id: crypto.randomUUID ? crypto.randomUUID() : `person_${Date.now()}`,
            personal: {
                title,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                preferredName: preferredName.trim() || undefined,
                dateOfBirth: dateOfBirth || undefined,
                age,
                niNumber: niNumber.trim() || undefined,
                occupantType,
                email: email.trim() || undefined,
                phone: phone.trim() || undefined,
                mobile: mobile.trim() || undefined
            },
            tenancy: {
                propertyId,
                unitId: unitId || undefined,
                propertyAddress,
                room: room.trim() || undefined,
                tenancyType,
                tenancyStatus,
                moveInDate: moveInDate || undefined,
                moveOutDate: moveOutDate || undefined
            },
            support: {
                careProvider: careProvider.trim() || undefined,
                socialWorker: socialWorker.trim() || undefined,
                keyWorker: keyWorker.trim() || undefined,
                caseManager: caseManager.trim() || undefined,
                careHours: careHours ? parseInt(careHours) : undefined,
                supportLevel,
                medicationNeeds: medicationNeeds.trim() || undefined,
                dietaryRequirements: dietaryRequirements.trim() || undefined,
                mobilityNeeds: mobilityNeeds.trim() || undefined
            },
            emergencyContacts: emergencyContacts.length > 0 ? emergencyContacts : undefined,
            finance: {
                rentAmount: rent || undefined,
                serviceCharge: service || undefined,
                supportCharge: support || undefined,
                totalCharges: totalCharges > 0 ? totalCharges : undefined,
                housingBenefit
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        onSave(newPerson);
        onClose();
        resetForm();
    };

    const addEmergencyContact = () => {
        setEmergencyContacts([
            ...emergencyContacts,
            {
                id: crypto.randomUUID ? crypto.randomUUID() : `ec_${Date.now()}`,
                name: '',
                relationship: '',
                phone: '',
                email: '',
                isPrimary: emergencyContacts.length === 0
            }
        ]);
    };

    const updateEmergencyContact = (index: number, field: keyof EmergencyContact, value: any) => {
        const updated = [...emergencyContacts];
        updated[index] = { ...updated[index], [field]: value };
        setEmergencyContacts(updated);
    };

    const removeEmergencyContact = (index: number) => {
        setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index));
    };

    const setPrimaryContact = (index: number) => {
        setEmergencyContacts(
            emergencyContacts.map((contact, i) => ({
                ...contact,
                isPrimary: i === index
            }))
        );
    };

    if (!isOpen) return null;

    const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === STEPS.length - 1;

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
                            <User size={24} className="text-ivolve-mid" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Add New Person</h2>
                            <p className="text-sm text-gray-500">
                                {STEPS[currentStepIndex].label}
                            </p>
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

                {/* Progress Steps */}
                <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        {STEPS.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = step.id === currentStep;
                            const isCompleted = index < currentStepIndex;

                            return (
                                <div key={step.id} className="flex items-center flex-1">
                                    <div className="flex items-center gap-2 flex-1">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                                                isActive
                                                    ? 'border-ivolve-mid bg-ivolve-mid text-white'
                                                    : isCompleted
                                                    ? 'border-ivolve-bright bg-ivolve-bright text-white'
                                                    : 'border-gray-300 bg-white text-gray-400'
                                            }`}
                                        >
                                            <Icon size={18} />
                                        </div>
                                        <div className="hidden md:block">
                                            <div
                                                className={`text-sm font-medium ${
                                                    isActive ? 'text-ivolve-mid' : 'text-gray-500'
                                                }`}
                                            >
                                                {step.label}
                                            </div>
                                        </div>
                                    </div>
                                    {index < STEPS.length - 1 && (
                                        <div className="flex-1 max-w-[100px] mx-2">
                                            <div
                                                className={`h-1 rounded-full transition-all ${
                                                    isCompleted ? 'bg-ivolve-bright' : 'bg-gray-200'
                                                }`}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {/* Personal Details */}
                    {currentStep === 'personal' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title
                                    </label>
                                    <select
                                        value={title}
                                        onChange={e => setTitle(e.target.value as Title)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                    >
                                        <option value="Mr">Mr</option>
                                        <option value="Mrs">Mrs</option>
                                        <option value="Ms">Ms</option>
                                        <option value="Miss">Miss</option>
                                        <option value="Mx">Mx</option>
                                        <option value="Dr">Dr</option>
                                        <option value="Prof">Prof</option>
                                        <option value="Rev">Rev</option>
                                    </select>
                                </div>
                                <div className="md:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name <span className="text-ivolve-rouge">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={e => setFirstName(e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent ${
                                            errors.firstName ? 'border-ivolve-rouge' : 'border-gray-300'
                                        }`}
                                        placeholder="First name"
                                    />
                                    {errors.firstName && (
                                        <p className="text-sm text-ivolve-rouge mt-1 flex items-center gap-1">
                                            <AlertCircle size={14} />
                                            {errors.firstName}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Name <span className="text-ivolve-rouge">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={e => setLastName(e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent ${
                                            errors.lastName ? 'border-ivolve-rouge' : 'border-gray-300'
                                        }`}
                                        placeholder="Last name"
                                    />
                                    {errors.lastName && (
                                        <p className="text-sm text-ivolve-rouge mt-1 flex items-center gap-1">
                                            <AlertCircle size={14} />
                                            {errors.lastName}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Preferred Name
                                    </label>
                                    <input
                                        type="text"
                                        value={preferredName}
                                        onChange={e => setPreferredName(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                        placeholder="Preferred name"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        value={dateOfBirth}
                                        onChange={e => setDateOfBirth(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        NI Number
                                    </label>
                                    <input
                                        type="text"
                                        value={niNumber}
                                        onChange={e => setNiNumber(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                        placeholder="AB123456C"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Occupant Type
                                    </label>
                                    <select
                                        value={occupantType}
                                        onChange={e => setOccupantType(e.target.value as OccupantType)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                    >
                                        <option value="Main Tenant">Main Tenant</option>
                                        <option value="Joint Tenant">Joint Tenant</option>
                                        <option value="Occupier">Occupier</option>
                                        <option value="Visitor">Visitor</option>
                                        <option value="Emergency Contact">Emergency Contact</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                        placeholder="01234 567890"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mobile
                                    </label>
                                    <input
                                        type="tel"
                                        value={mobile}
                                        onChange={e => setMobile(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                        placeholder="07123 456789"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tenancy */}
                    {currentStep === 'tenancy' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Property <span className="text-ivolve-rouge">*</span>
                                    </label>
                                    <select
                                        value={propertyId}
                                        onChange={e => setPropertyId(e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent ${
                                            errors.propertyId ? 'border-ivolve-rouge' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Select property...</option>
                                        {properties.map(prop => (
                                            <option key={prop.id} value={prop.id}>
                                                {prop.address} ({prop.postcode})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.propertyId && (
                                        <p className="text-sm text-ivolve-rouge mt-1 flex items-center gap-1">
                                            <AlertCircle size={14} />
                                            {errors.propertyId}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Unit ID
                                    </label>
                                    <input
                                        type="text"
                                        value={unitId}
                                        onChange={e => setUnitId(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                        placeholder="Unit ID (if applicable)"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Room
                                    </label>
                                    <input
                                        type="text"
                                        value={room}
                                        onChange={e => setRoom(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                        placeholder="e.g., Room 7A"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tenancy Type
                                    </label>
                                    <select
                                        value={tenancyType}
                                        onChange={e => setTenancyType(e.target.value as TenancyType)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                    >
                                        <option value="Assured">Assured</option>
                                        <option value="Assured Shorthold">Assured Shorthold</option>
                                        <option value="License">License</option>
                                        <option value="Secure">Secure</option>
                                        <option value="Introductory">Introductory</option>
                                        <option value="Non-Secure">Non-Secure</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tenancy Status
                                    </label>
                                    <select
                                        value={tenancyStatus}
                                        onChange={e => setTenancyStatus(e.target.value as TenancyStatus)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                    >
                                        <option value="Current">Current</option>
                                        <option value="Former">Former</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Move In Date
                                    </label>
                                    <input
                                        type="date"
                                        value={moveInDate}
                                        onChange={e => setMoveInDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Move Out Date
                                    </label>
                                    <input
                                        type="date"
                                        value={moveOutDate}
                                        onChange={e => setMoveOutDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-sm font-semibold text-gray-700 mb-4">Finance Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Rent Amount (£/week)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={rentAmount}
                                            onChange={e => setRentAmount(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Service Charge (£/week)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={serviceCharge}
                                            onChange={e => setServiceCharge(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Support Charge (£/week)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={supportCharge}
                                            onChange={e => setSupportCharge(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={housingBenefit}
                                            onChange={e => setHousingBenefit(e.target.checked)}
                                            className="w-4 h-4 text-ivolve-mid border-gray-300 rounded focus:ring-ivolve-mid"
                                        />
                                        <span className="text-sm text-gray-700">Receiving Housing Benefit</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Support & Care */}
                    {currentStep === 'support' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Care Provider
                                    </label>
                                    <input
                                        type="text"
                                        value={careProvider}
                                        onChange={e => setCareProvider(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                        placeholder="Care provider organization"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Social Worker
                                    </label>
                                    <input
                                        type="text"
                                        value={socialWorker}
                                        onChange={e => setSocialWorker(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                        placeholder="Social worker name"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Key Worker
                                    </label>
                                    <input
                                        type="text"
                                        value={keyWorker}
                                        onChange={e => setKeyWorker(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                        placeholder="Key worker name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Case Manager
                                    </label>
                                    <input
                                        type="text"
                                        value={caseManager}
                                        onChange={e => setCaseManager(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                        placeholder="Case manager name"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Care Hours (per week)
                                    </label>
                                    <input
                                        type="number"
                                        value={careHours}
                                        onChange={e => setCareHours(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Support Level
                                    </label>
                                    <select
                                        value={supportLevel}
                                        onChange={e => setSupportLevel(e.target.value as any)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Intensive">Intensive</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Medication Needs
                                    </label>
                                    <textarea
                                        value={medicationNeeds}
                                        onChange={e => setMedicationNeeds(e.target.value)}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent resize-none"
                                        placeholder="Describe medication needs..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Dietary Requirements
                                    </label>
                                    <textarea
                                        value={dietaryRequirements}
                                        onChange={e => setDietaryRequirements(e.target.value)}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent resize-none"
                                        placeholder="Describe dietary requirements..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mobility Needs
                                    </label>
                                    <textarea
                                        value={mobilityNeeds}
                                        onChange={e => setMobilityNeeds(e.target.value)}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent resize-none"
                                        placeholder="Describe mobility needs..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Emergency Contacts */}
                    {currentStep === 'emergency' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700">Emergency Contacts</h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Add contacts who can be reached in case of emergency
                                    </p>
                                </div>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={addEmergencyContact}
                                    leftIcon={<Phone size={16} />}
                                >
                                    Add Contact
                                </Button>
                            </div>

                            {emergencyContacts.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                    <Phone size={36} className="text-gray-300 mx-auto mb-3" />
                                    <p className="text-sm text-gray-500">No emergency contacts added yet</p>
                                    <button
                                        onClick={addEmergencyContact}
                                        className="mt-4 text-sm text-ivolve-mid hover:text-ivolve-dark font-medium"
                                    >
                                        Add your first contact
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {emergencyContacts.map((contact, index) => (
                                        <div
                                            key={contact.id}
                                            className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-medium text-gray-700">
                                                    Contact {index + 1}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    {!contact.isPrimary && emergencyContacts.length > 1 && (
                                                        <button
                                                            onClick={() => setPrimaryContact(index)}
                                                            className="text-xs text-ivolve-mid hover:text-ivolve-dark"
                                                        >
                                                            Set as primary
                                                        </button>
                                                    )}
                                                    {contact.isPrimary && (
                                                        <span className="px-2 py-1 text-xs bg-ivolve-bright/20 text-ivolve-dark rounded">
                                                            Primary
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={() => removeEmergencyContact(index)}
                                                        className="p-1 hover:bg-gray-200 rounded"
                                                        title="Remove contact"
                                                    >
                                                        <X size={16} className="text-gray-400" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={contact.name}
                                                        onChange={e =>
                                                            updateEmergencyContact(index, 'name', e.target.value)
                                                        }
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                                        placeholder="Full name"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        Relationship
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={contact.relationship}
                                                        onChange={e =>
                                                            updateEmergencyContact(index, 'relationship', e.target.value)
                                                        }
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                                        placeholder="e.g., Mother, Brother, Friend"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        Phone
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        value={contact.phone}
                                                        onChange={e =>
                                                            updateEmergencyContact(index, 'phone', e.target.value)
                                                        }
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                                        placeholder="Phone number"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={contact.email || ''}
                                                        onChange={e =>
                                                            updateEmergencyContact(index, 'email', e.target.value)
                                                        }
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                                        placeholder="Email (optional)"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50">
                    <div className="text-sm text-gray-500">
                        Step {currentStepIndex + 1} of {STEPS.length}
                    </div>
                    <div className="flex items-center gap-3">
                        {!isFirstStep && (
                            <Button
                                variant="ghost"
                                onClick={handlePrevious}
                                leftIcon={<ChevronLeft size={16} />}
                            >
                                Previous
                            </Button>
                        )}
                        {!isLastStep ? (
                            <Button
                                variant="primary"
                                onClick={handleNext}
                                rightIcon={<ChevronRight size={16} />}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                onClick={handleSave}
                                leftIcon={<Save size={16} />}
                            >
                                Save Person
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
