import { useState } from 'react';
import { Users, X } from 'lucide-react';

export interface Contact {
    id: string;
    name: string;
    role: string;
    phone?: string;
    email?: string;
    organization?: string;
    color: {
        bg: string;
        border: string;
        icon: string;
    };
}

interface ContactModalFormProps {
    contact?: Contact; // If provided, we're editing; if not, we're adding
    onSave: (contact: Omit<Contact, 'id'>) => void;
    onClose: () => void;
}

const CONTACT_COLORS = [
    { bg: 'green-100', border: 'green-400', icon: 'green-700' },
    { bg: 'blue-100', border: 'blue-400', icon: 'blue-700' },
    { bg: 'purple-100', border: 'purple-400', icon: 'purple-700' },
    { bg: 'pink-100', border: 'pink-400', icon: 'pink-700' },
    { bg: 'indigo-100', border: 'indigo-400', icon: 'indigo-700' },
    { bg: 'teal-100', border: 'teal-400', icon: 'teal-700' }
];

export default function ContactModalForm({ contact, onSave, onClose }: ContactModalFormProps) {
    const [name, setName] = useState(contact?.name || '');
    const [role, setRole] = useState(contact?.role || '');
    const [phone, setPhone] = useState(contact?.phone || '');
    const [email, setEmail] = useState(contact?.email || '');
    const [organization, setOrganization] = useState(contact?.organization || '');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!name.trim()) {
            newErrors.name = 'Name is required';
        } else if (name.length > 50) {
            newErrors.name = 'Name must be 50 characters or less';
        }

        if (!role.trim()) {
            newErrors.role = 'Role is required';
        } else if (role.length > 50) {
            newErrors.role = 'Role must be 50 characters or less';
        }

        if (phone && !/^[\d\s\-\+\(\)]+$/.test(phone)) {
            newErrors.phone = 'Invalid phone number format';
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Invalid email format';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Select a color (cycle through based on role name hash if editing, otherwise random)
        const colorIndex = contact
            ? Math.abs(contact.role.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % CONTACT_COLORS.length
            : Math.floor(Math.random() * CONTACT_COLORS.length);

        onSave({
            name: name.trim(),
            role: role.trim(),
            phone: phone.trim() || undefined,
            email: email.trim() || undefined,
            organization: organization.trim() || undefined,
            color: CONTACT_COLORS[colorIndex]
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-100">
                            <Users size={24} className="text-green-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">
                            {contact ? 'Edit Contact' : 'Add Contact'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        type="button"
                    >
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (errors.name) setErrors({ ...errors, name: '' });
                            }}
                            className={`
                                w-full px-4 py-2 rounded-lg border-2 transition-colors
                                ${errors.name
                                    ? 'border-red-300 focus:border-red-500'
                                    : 'border-gray-200 focus:border-ivolve-mid'
                                }
                                focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20
                            `}
                            placeholder="e.g., John Smith"
                            maxLength={50}
                            autoFocus
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                        )}
                    </div>

                    {/* Role */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                            Role <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="role"
                            type="text"
                            value={role}
                            onChange={(e) => {
                                setRole(e.target.value);
                                if (errors.role) setErrors({ ...errors, role: '' });
                            }}
                            className={`
                                w-full px-4 py-2 rounded-lg border-2 transition-colors
                                ${errors.role
                                    ? 'border-red-300 focus:border-red-500'
                                    : 'border-gray-200 focus:border-ivolve-mid'
                                }
                                focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20
                            `}
                            placeholder="e.g., Social Worker, GP, Family Member"
                            maxLength={50}
                        />
                        {errors.role && (
                            <p className="mt-1 text-xs text-red-600">{errors.role}</p>
                        )}
                    </div>

                    {/* Organization */}
                    <div>
                        <label htmlFor="organization" className="block text-sm font-semibold text-gray-700 mb-2">
                            Organization
                        </label>
                        <input
                            id="organization"
                            type="text"
                            value={organization}
                            onChange={(e) => setOrganization(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-ivolve-mid transition-colors focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20"
                            placeholder="e.g., Birmingham City Council, NHS"
                            maxLength={100}
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                            Phone
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => {
                                setPhone(e.target.value);
                                if (errors.phone) setErrors({ ...errors, phone: '' });
                            }}
                            className={`
                                w-full px-4 py-2 rounded-lg border-2 transition-colors
                                ${errors.phone
                                    ? 'border-red-300 focus:border-red-500'
                                    : 'border-gray-200 focus:border-ivolve-mid'
                                }
                                focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20
                            `}
                            placeholder="e.g., 0121 456 7890"
                            maxLength={20}
                        />
                        {errors.phone && (
                            <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email) setErrors({ ...errors, email: '' });
                            }}
                            className={`
                                w-full px-4 py-2 rounded-lg border-2 transition-colors
                                ${errors.email
                                    ? 'border-red-300 focus:border-red-500'
                                    : 'border-gray-200 focus:border-ivolve-mid'
                                }
                                focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20
                            `}
                            placeholder="e.g., john.smith@example.com"
                            maxLength={100}
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-colors font-medium"
                        >
                            {contact ? 'Save Changes' : 'Add Contact'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
