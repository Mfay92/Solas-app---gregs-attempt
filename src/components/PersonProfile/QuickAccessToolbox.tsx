import { useState } from 'react';
import {
    AlertCircle, FileText, Users, MessageSquare, PlusCircle,
    ExternalLink, Paperclip, Clock, Pin, X, Phone, Mail, Briefcase, Settings, Edit, Trash2, PoundSterling, Home
} from 'lucide-react';
import { Person, ServiceType } from '../../types';
import { getServiceTypeColor } from '../../utils/serviceTypeUtils';
import ImportantInfoModal, { ImportantInfo } from '../Forms/ImportantInfoModal';
import RenameDocumentModal from '../Forms/RenameDocumentModal';
import ContactModalForm, { Contact } from '../Forms/ContactModal';
import SelectPanelModal from '../Forms/SelectPanelModal';

type ToolboxTab = 'important-info' | 'key-documents' | 'contacts' | 'recent-notes' | 'placeholder-1' | 'placeholder-2' | 'support-plan' | 'rent-details' | 'landlord-details';

interface ContactDetails {
    name: string;
    role: string;
    phone?: string;
    email?: string;
    organization?: string;
}

interface KeyDocument {
    id: string;
    displayName: string;
    fileName: string;
    uploadDate: string;
    isPinned: boolean;
    color: {
        bg: string;
        border: string;
        icon: string;
    };
}

interface QuickAccessToolboxProps {
    person: Person;
    serviceType: ServiceType;
    className?: string;
}

// Contact Modal Component
function ContactModal({ contact, onClose }: { contact: ContactDetails; onClose: () => void }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-ivolve-mid/10 flex items-center justify-center text-ivolve-mid">
                            <Users size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">{contact.name}</h3>
                            <p className="text-sm text-gray-500">{contact.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <div className="space-y-3">
                    {contact.organization && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Briefcase size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Organization</p>
                                <p className="text-sm text-gray-800 font-medium">{contact.organization}</p>
                            </div>
                        </div>
                    )}

                    {contact.phone && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Phone size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Phone</p>
                                <a href={`tel:${contact.phone}`} className="text-sm text-ivolve-mid font-medium hover:underline">
                                    {contact.phone}
                                </a>
                            </div>
                        </div>
                    )}

                    {contact.email && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Mail size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Email</p>
                                <a href={`mailto:${contact.email}`} className="text-sm text-ivolve-mid font-medium hover:underline">
                                    {contact.email}
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-colors font-medium text-sm">
                        View Full Profile
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function QuickAccessToolbox({ person, serviceType, className = '' }: QuickAccessToolboxProps) {
    const [activeTab, setActiveTab] = useState<ToolboxTab>('key-documents');
    const [selectedContact, setSelectedContact] = useState<ContactDetails | null>(null);
    const colors = getServiceTypeColor(serviceType);

    // Important Info state
    const [importantInfoItems, setImportantInfoItems] = useState<ImportantInfo[]>([
        {
            id: '1',
            type: 'allergy',
            title: 'Allergy Warning',
            description: 'Severe peanut allergy. EpiPen required.',
            color: { bg: 'orange-100', border: 'orange-500', text: 'orange-800' }
        },
        {
            id: '2',
            type: 'communication',
            title: 'Communication',
            description: 'Prefers written communication where possible.',
            color: { bg: 'sky-100', border: 'sky-500', text: 'sky-800' }
        }
    ]);
    const [isImportantInfoModalOpen, setIsImportantInfoModalOpen] = useState(false);
    const [editingImportantInfo, setEditingImportantInfo] = useState<ImportantInfo | undefined>(undefined);

    // Key Documents state
    const [keyDocuments, setKeyDocuments] = useState<KeyDocument[]>([
        {
            id: '1',
            displayName: `${person.personal.lastName} Assessment 2026`,
            fileName: `${person.personal.lastName}_assessment.docx`,
            uploadDate: '04/09/2026',
            isPinned: true,
            color: { bg: 'yellow-100', border: 'yellow-400', icon: 'yellow-700' }
        },
        {
            id: '2',
            displayName: `${person.personal.lastName} Support Plan`,
            fileName: 'Support_Plan.pdf',
            uploadDate: '12/08/2026',
            isPinned: false,
            color: { bg: 'pink-100', border: 'pink-400', icon: 'pink-700' }
        },
        {
            id: '3',
            displayName: 'Risk Assessment',
            fileName: 'Risk_Assessment_2026.pdf',
            uploadDate: '15/01/2026',
            isPinned: false,
            color: { bg: 'blue-100', border: 'blue-400', icon: 'blue-700' }
        }
    ]);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [renamingDocument, setRenamingDocument] = useState<KeyDocument | undefined>(undefined);

    // Contacts state
    const [contacts, setContacts] = useState<Contact[]>([
        {
            id: '1',
            name: person.support.keyWorker || 'Not assigned',
            role: 'Key Worker',
            phone: '0121 456 7890',
            email: 'keyworker@example.com',
            organization: 'ivolve Support Services',
            color: { bg: 'green-100', border: 'green-400', icon: 'green-700' }
        },
        {
            id: '2',
            name: person.support.socialWorker || 'Not assigned',
            role: 'Social Worker',
            phone: '0121 555 0123',
            email: 'socialworker@birmingham.gov.uk',
            organization: 'Birmingham City Council',
            color: { bg: 'blue-100', border: 'blue-400', icon: 'blue-700' }
        },
        {
            id: '3',
            name: person.support.careProvider || 'Not assigned',
            role: 'Care Provider',
            phone: '0121 789 4560',
            email: 'provider@careservices.co.uk',
            organization: 'Birmingham Care Services Ltd',
            color: { bg: 'purple-100', border: 'purple-400', icon: 'purple-700' }
        }
    ]);
    const [isContactFormOpen, setIsContactFormOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | undefined>(undefined);

    // Custom panels state
    const [customPanels, setCustomPanels] = useState<{ slot: 'placeholder-1' | 'placeholder-2', panelType: ToolboxTab }[]>([]);
    const [isSelectPanelModalOpen, setIsSelectPanelModalOpen] = useState(false);
    const [selectingPlaceholder, setSelectingPlaceholder] = useState<'placeholder-1' | 'placeholder-2' | null>(null);

    // Unique ID for this component instance to scope the scrollbar styles
    const scrollbarId = `notice-board-${person.id}`;

    // Important Info handlers
    const handleSaveImportantInfo = (info: Omit<ImportantInfo, 'id'>) => {
        if (editingImportantInfo) {
            // Edit existing
            setImportantInfoItems(prev =>
                prev.map(item =>
                    item.id === editingImportantInfo.id
                        ? { ...info, id: item.id }
                        : item
                )
            );
        } else {
            // Add new
            const newInfo: ImportantInfo = {
                ...info,
                id: Date.now().toString()
            };
            setImportantInfoItems(prev => [...prev, newInfo]);
        }
        setIsImportantInfoModalOpen(false);
        setEditingImportantInfo(undefined);
    };

    const handleDeleteImportantInfo = (id: string) => {
        if (confirm('Are you sure you want to delete this important information?')) {
            setImportantInfoItems(prev => prev.filter(item => item.id !== id));
        }
    };

    const handleEditImportantInfo = (info: ImportantInfo) => {
        setEditingImportantInfo(info);
        setIsImportantInfoModalOpen(true);
    };

    const handleAddImportantInfo = () => {
        setEditingImportantInfo(undefined);
        setIsImportantInfoModalOpen(true);
    };

    // Key Documents handlers
    const handleTogglePin = (id: string) => {
        setKeyDocuments(prev =>
            prev.map(doc =>
                doc.id === id ? { ...doc, isPinned: !doc.isPinned } : doc
            )
        );
    };

    const handleRenameDocument = (doc: KeyDocument) => {
        setRenamingDocument(doc);
        setIsRenameModalOpen(true);
    };

    const handleSaveRename = (newName: string) => {
        if (renamingDocument) {
            setKeyDocuments(prev =>
                prev.map(doc =>
                    doc.id === renamingDocument.id
                        ? { ...doc, displayName: newName }
                        : doc
                )
            );
        }
        setIsRenameModalOpen(false);
        setRenamingDocument(undefined);
    };

    const handleDeleteDocument = (id: string) => {
        if (confirm('Are you sure you want to remove this document from the Notice Board?')) {
            setKeyDocuments(prev => prev.filter(doc => doc.id !== id));
        }
    };

    const handleAddDocument = () => {
        // TODO: Open file picker or document selector
        console.log('Add document clicked');
    };

    // Contacts handlers
    const handleSaveContact = (contact: Omit<Contact, 'id'>) => {
        if (editingContact) {
            // Edit existing
            setContacts(prev =>
                prev.map(c =>
                    c.id === editingContact.id
                        ? { ...contact, id: c.id }
                        : c
                )
            );
        } else {
            // Add new
            const newContact: Contact = {
                ...contact,
                id: Date.now().toString()
            };
            setContacts(prev => [...prev, newContact]);
        }
        setIsContactFormOpen(false);
        setEditingContact(undefined);
    };

    const handleEditContact = (contact: Contact) => {
        setEditingContact(contact);
        setIsContactFormOpen(true);
    };

    const handleDeleteContact = (id: string) => {
        if (confirm('Are you sure you want to remove this contact?')) {
            setContacts(prev => prev.filter(c => c.id !== id));
        }
    };

    const handleAddContact = () => {
        setEditingContact(undefined);
        setIsContactFormOpen(true);
    };

    // Custom panels handlers
    const handleSelectPanelType = (panelId: string) => {
        if (selectingPlaceholder) {
            setCustomPanels(prev => [
                ...prev.filter(p => p.slot !== selectingPlaceholder),
                { slot: selectingPlaceholder, panelType: panelId as ToolboxTab }
            ]);
            setActiveTab(panelId as ToolboxTab);
        }
        setIsSelectPanelModalOpen(false);
        setSelectingPlaceholder(null);
    };

    const handlePlaceholderClick = (placeholderId: 'placeholder-1' | 'placeholder-2') => {
        setSelectingPlaceholder(placeholderId);
        setIsSelectPanelModalOpen(true);
    };

    // Helper to get panel config
    const getPanelConfig = (panelType: ToolboxTab) => {
        switch (panelType) {
            case 'support-plan':
                return { label: 'Support Plan', icon: FileText };
            case 'rent-details':
                return { label: 'Rent Details', icon: PoundSterling };
            case 'landlord-details':
                return { label: 'Landlord', icon: Home };
            default:
                return { label: '+ Add Panel', icon: PlusCircle };
        }
    };

    // Build tabs array dynamically
    const placeholder1Panel = customPanels.find(p => p.slot === 'placeholder-1');
    const placeholder2Panel = customPanels.find(p => p.slot === 'placeholder-2');

    const tabs = [
        { id: 'important-info' as ToolboxTab, label: 'Important Info', icon: AlertCircle, isPlaceholder: false },
        { id: 'key-documents' as ToolboxTab, label: 'Key Documents', icon: FileText, isPlaceholder: false },
        { id: 'contacts' as ToolboxTab, label: 'Contacts', icon: Users, isPlaceholder: false },
        { id: 'recent-notes' as ToolboxTab, label: 'Recent Notes', icon: MessageSquare, isPlaceholder: false },
        placeholder1Panel
            ? { id: placeholder1Panel.panelType, label: getPanelConfig(placeholder1Panel.panelType).label, icon: getPanelConfig(placeholder1Panel.panelType).icon, isPlaceholder: false }
            : { id: 'placeholder-1' as ToolboxTab, label: '+ Add Panel', icon: PlusCircle, isPlaceholder: true },
        placeholder2Panel
            ? { id: placeholder2Panel.panelType, label: getPanelConfig(placeholder2Panel.panelType).label, icon: getPanelConfig(placeholder2Panel.panelType).icon, isPlaceholder: false }
            : { id: 'placeholder-2' as ToolboxTab, label: '+ Add Panel', icon: PlusCircle, isPlaceholder: true },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'key-documents':
                // Sort documents: pinned first, then by upload date
                const sortedDocs = [...keyDocuments].sort((a, b) => {
                    if (a.isPinned && !b.isPinned) return -1;
                    if (!a.isPinned && b.isPinned) return 1;
                    return 0;
                });

                return (
                    <div className="space-y-1.5">
                        {/* Dynamic document cards */}
                        {sortedDocs.map((doc) => (
                            <div
                                key={doc.id}
                                className={`bg-${doc.color.bg} p-2 rounded-md border-l-4 border-${doc.color.border} shadow-md hover:shadow-lg transition-shadow group relative`}
                            >
                                <div className="flex items-start gap-2">
                                    <div className={`bg-${doc.color.bg.replace('100', '200')} p-1.5 rounded text-${doc.color.icon}`}>
                                        <FileText size={14} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start gap-1">
                                            {doc.isPinned && (
                                                <Pin size={10} className="text-amber-600 mt-0.5 shrink-0" />
                                            )}
                                            <h4 className="font-semibold text-gray-800 text-xs truncate group-hover:text-ivolve-mid transition-colors flex-1">
                                                {doc.displayName}
                                            </h4>
                                        </div>
                                        <p className="text-[10px] text-gray-600 truncate">{doc.fileName}</p>
                                        <p className="text-[9px] text-gray-500 mt-0.5">Uploaded {doc.uploadDate}</p>
                                    </div>
                                    {/* Action buttons - visible on hover */}
                                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleTogglePin(doc.id)}
                                            className="p-1 bg-white/80 hover:bg-white rounded transition-colors"
                                            title={doc.isPinned ? 'Unpin' : 'Pin'}
                                        >
                                            <Pin size={12} className={doc.isPinned ? 'text-amber-600' : 'text-gray-400'} />
                                        </button>
                                        <button
                                            onClick={() => handleRenameDocument(doc)}
                                            className="p-1 bg-white/80 hover:bg-white rounded transition-colors"
                                            title="Rename"
                                        >
                                            <Edit size={12} className="text-gray-600" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDocument(doc.id)}
                                            className="p-1 bg-white/80 hover:bg-white rounded transition-colors"
                                            title="Remove"
                                        >
                                            <Trash2 size={12} className="text-red-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add document button */}
                        <button
                            onClick={handleAddDocument}
                            className="w-full bg-amber-50/60 p-2 rounded-md border-2 border-dashed border-amber-300 hover:border-amber-400 hover:bg-amber-100/60 transition-all flex flex-col items-center justify-center text-center py-3 group"
                        >
                            <Paperclip size={14} className="text-amber-500 mb-0.5 group-hover:rotate-12 transition-transform duration-200" />
                            <span className="text-[10px] text-amber-600 font-medium">Pin Document</span>
                        </button>
                    </div>
                );
            case 'important-info':
                return (
                    <div className="space-y-1.5">
                        {/* Dynamic important info items */}
                        {importantInfoItems.map((info) => (
                            <div
                                key={info.id}
                                className={`bg-${info.color.bg} p-2 rounded-md border-l-4 border-${info.color.border} shadow-md group relative`}
                            >
                                <div className="flex items-start gap-1.5">
                                    <AlertCircle size={14} className={`text-${info.color.text} mt-0.5 shrink-0`} />
                                    <div className="flex-1">
                                        <p className={`text-[10px] font-bold text-${info.color.text} uppercase tracking-wide mb-0.5`}>
                                            {info.title}
                                        </p>
                                        <p className={`text-xs text-${info.color.text.replace('800', '900')}`}>
                                            {info.description}
                                        </p>
                                    </div>
                                    {/* Edit and Delete buttons - visible on hover */}
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEditImportantInfo(info)}
                                            className="p-1 bg-white/80 hover:bg-white rounded transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={12} className="text-gray-600" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteImportantInfo(info.id)}
                                            className="p-1 bg-white/80 hover:bg-white rounded transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={12} className="text-red-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add new button */}
                        <button
                            onClick={handleAddImportantInfo}
                            className="w-full bg-amber-50/60 p-2 rounded-md border-2 border-dashed border-amber-300 hover:border-amber-400 hover:bg-amber-100/60 transition-all flex flex-col items-center justify-center text-center py-3 group"
                        >
                            <PlusCircle size={14} className="text-amber-500 mb-0.5 group-hover:rotate-90 transition-transform duration-200" />
                            <span className="text-[10px] text-amber-600 font-medium">Add Important Info</span>
                        </button>
                    </div>
                );
            case 'contacts':
                return (
                    <div className="space-y-1.5">
                        {/* Dynamic contact cards */}
                        {contacts.map((contact) => (
                            <div
                                key={contact.id}
                                className={`bg-${contact.color.bg} p-2 rounded-md border-l-4 border-${contact.color.border} shadow-md hover:shadow-lg transition-shadow group relative`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <div
                                        className="flex items-center gap-1.5 flex-1 min-w-0 cursor-pointer"
                                        onClick={() => setSelectedContact({
                                            name: contact.name,
                                            role: contact.role,
                                            phone: contact.phone,
                                            email: contact.email,
                                            organization: contact.organization
                                        })}
                                    >
                                        <div className={`w-6 h-6 rounded-full bg-${contact.color.bg.replace('100', '200')} flex items-center justify-center text-${contact.color.icon} shrink-0`}>
                                            <Users size={12} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-gray-800">{contact.role}</p>
                                            <p className="text-[10px] text-gray-600 truncate">{contact.name}</p>
                                        </div>
                                        <ExternalLink size={12} className="text-gray-500 shrink-0" />
                                    </div>
                                    {/* Edit and Delete buttons - visible on hover */}
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditContact(contact);
                                            }}
                                            className="p-1 bg-white/80 hover:bg-white rounded transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={12} className="text-gray-600" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteContact(contact.id);
                                            }}
                                            className="p-1 bg-white/80 hover:bg-white rounded transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={12} className="text-red-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add contact button */}
                        <button
                            onClick={handleAddContact}
                            className="w-full bg-amber-50/60 p-2 rounded-md border-2 border-dashed border-amber-300 hover:border-amber-400 hover:bg-amber-100/60 transition-all flex flex-col items-center justify-center text-center py-3 group"
                        >
                            <PlusCircle size={14} className="text-amber-500 mb-0.5 group-hover:rotate-90 transition-transform duration-200" />
                            <span className="text-[10px] text-amber-600 font-medium">Add Contact</span>
                        </button>
                    </div>
                );
            case 'recent-notes':
                return (
                    <div className="space-y-1.5">
                        {/* Post-it style note cards */}
                        <div className="bg-lime-100 p-2 rounded-md border-l-4 border-lime-400 shadow-md">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Clock size={10} className="text-lime-600" />
                                <span className="text-[9px] text-lime-700 uppercase font-semibold">Today at 09:30</span>
                            </div>
                            <p className="text-xs text-gray-800 line-clamp-2">
                                Met with {person.personal.firstName} to discuss weekly activities. Seemed in good spirits.
                            </p>
                        </div>
                        <div className="bg-cyan-100 p-2 rounded-md border-l-4 border-cyan-400 shadow-md">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Clock size={10} className="text-cyan-600" />
                                <span className="text-[9px] text-cyan-700 uppercase font-semibold">Yesterday at 14:15</span>
                            </div>
                            <p className="text-xs text-gray-800 line-clamp-2">
                                GP appointment scheduled for next Tuesday. Transport arranged.
                            </p>
                        </div>
                    </div>
                );
            case 'support-plan':
                return (
                    <div className="space-y-1.5">
                        <div className="bg-blue-100 p-3 rounded-md border-l-4 border-blue-400 shadow-md">
                            <div className="space-y-2">
                                <div>
                                    <p className="text-[9px] text-blue-600 uppercase font-bold tracking-wide">Current Plan</p>
                                    <p className="text-xs text-blue-900 font-semibold">Personal Support Plan 2026</p>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                    <span className="text-blue-700">Review Date:</span>
                                    <span className="text-blue-900 font-semibold">15/03/2026</span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                    <span className="text-blue-700">Status:</span>
                                    <span className="text-green-700 font-semibold">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'rent-details':
                return (
                    <div className="space-y-1.5">
                        <div className="bg-green-100 p-3 rounded-md border-l-4 border-green-400 shadow-md">
                            <div className="space-y-2">
                                <div>
                                    <p className="text-[9px] text-green-600 uppercase font-bold tracking-wide">Weekly Rent</p>
                                    <p className="text-lg text-green-900 font-bold">£{person.finance.rentAmount || '0.00'}</p>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                    <span className="text-green-700">Payment Status:</span>
                                    <span className="text-green-900 font-semibold">Up to Date</span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                    <span className="text-green-700">Next Due:</span>
                                    <span className="text-green-900 font-semibold">Monday</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'landlord-details':
                return (
                    <div className="space-y-1.5">
                        <div className="bg-purple-100 p-3 rounded-md border-l-4 border-purple-400 shadow-md">
                            <div className="space-y-2">
                                <div>
                                    <p className="text-[9px] text-purple-600 uppercase font-bold tracking-wide">Landlord</p>
                                    <p className="text-xs text-purple-900 font-semibold">ivolve Housing Ltd</p>
                                </div>
                                <div className="text-[10px] space-y-1">
                                    <div className="flex items-center gap-1">
                                        <Phone size={10} className="text-purple-600" />
                                        <span className="text-purple-900">0121 456 7890</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Mail size={10} className="text-purple-600" />
                                        <span className="text-purple-900 truncate">housing@ivolve.org.uk</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            {/* Custom scrollbar styles */}
            <style>{`
                .${scrollbarId}::-webkit-scrollbar {
                    width: 8px;
                }
                .${scrollbarId}::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }
                .${scrollbarId}::-webkit-scrollbar-thumb {
                    background: ${colors.primary};
                    border-radius: 4px;
                    opacity: 0.8;
                }
                .${scrollbarId}::-webkit-scrollbar-thumb:hover {
                    opacity: 1;
                }
            `}</style>

            <div className={`rounded-xl overflow-hidden shadow-2xl border-3 flex flex-col lg:w-[430px] h-[350px] z-20 ${className}`}
                style={{
                    background: 'linear-gradient(135deg, #D4A574 0%, #C89968 100%)',
                    borderColor: '#8B6F47'
                }}
            >
                {/* Notice Board Header - Cork board style */}
                <div className="bg-gradient-to-r from-amber-800/40 to-amber-900/40 backdrop-blur-sm border-b-2 border-amber-900/30 px-4 py-2">
                    <div className="flex items-center gap-2 text-white">
                        <Pin size={16} />
                        <h3 className="font-bold text-sm tracking-wide drop-shadow-md">Notice Board</h3>
                    </div>
                </div>

                {/* Main Content Area - Flipped Layout */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Side: Tab Navigation - Cork board style */}
                    <div className="w-[110px] bg-gradient-to-b from-amber-700/20 to-amber-800/20 backdrop-blur-sm flex flex-col border-r-2 border-amber-900/30">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            const isPlaceholder = tab.isPlaceholder;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        if (isPlaceholder) {
                                            handlePlaceholderClick(tab.id as 'placeholder-1' | 'placeholder-2');
                                        } else {
                                            setActiveTab(tab.id);
                                        }
                                    }}
                                    className={`
                                        flex flex-col items-center justify-center gap-1 p-2 text-center border-b border-amber-900/20 transition-all flex-1
                                        ${isActive
                                            ? 'bg-amber-600/50 text-white shadow-inner font-bold backdrop-blur-sm'
                                            : isPlaceholder
                                                ? 'bg-amber-600/5 text-white/60 hover:bg-amber-600/10 hover:text-white/80 cursor-pointer'
                                                : 'bg-amber-600/15 text-white/80 hover:bg-amber-600/25 hover:text-white'
                                        }
                                    `}
                                >
                                    <Icon size={isPlaceholder ? 14 : 16} />
                                    <span className="text-[8px] font-bold leading-tight uppercase tracking-wide">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Side: Content Area with Scrollbar on Far Right - Post-it note style */}
                    <div className={`flex-1 bg-amber-50/40 backdrop-blur-sm p-3 overflow-y-auto ${scrollbarId}`}>
                        <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                                {tabs.find(t => t.id === activeTab)?.icon && (
                                    <div className="p-1 rounded-md bg-yellow-200/60 backdrop-blur-sm">
                                        {(() => {
                                            const Icon = tabs.find(t => t.id === activeTab)!.icon;
                                            return <Icon size={14} className="text-white" />;
                                        })()}
                                    </div>
                                )}
                                <h4 className="font-bold text-sm text-white drop-shadow-md">
                                    {tabs.find(t => t.id === activeTab)?.label}
                                </h4>
                            </div>
                            {/* Settings gear - only show for non-placeholder tabs */}
                            {!tabs.find(t => t.id === activeTab)?.isPlaceholder && (
                                <button
                                    onClick={() => {
                                        if (activeTab === 'important-info') {
                                            handleAddImportantInfo();
                                        } else if (activeTab === 'key-documents') {
                                            handleAddDocument();
                                        } else if (activeTab === 'contacts') {
                                            handleAddContact();
                                        } else {
                                            // TODO: Open settings/edit modal for other tabs
                                            console.log(`Settings clicked for ${activeTab}`);
                                        }
                                    }}
                                    className="p-1.5 rounded-md bg-amber-600/30 hover:bg-amber-600/50 backdrop-blur-sm transition-all group"
                                    title={`Add ${tabs.find(t => t.id === activeTab)?.label}`}
                                >
                                    <Settings size={13} className="text-white group-hover:rotate-45 transition-transform duration-300" />
                                </button>
                            )}
                        </div>
                        {renderContent()}
                    </div>
                </div>
            </div>

            {/* Contact Modal */}
            {selectedContact && (
                <ContactModal
                    contact={selectedContact}
                    onClose={() => setSelectedContact(null)}
                />
            )}

            {/* Important Info Modal */}
            {isImportantInfoModalOpen && (
                <ImportantInfoModal
                    info={editingImportantInfo}
                    onSave={handleSaveImportantInfo}
                    onClose={() => {
                        setIsImportantInfoModalOpen(false);
                        setEditingImportantInfo(undefined);
                    }}
                />
            )}

            {/* Rename Document Modal */}
            {isRenameModalOpen && renamingDocument && (
                <RenameDocumentModal
                    currentName={renamingDocument.displayName}
                    onSave={handleSaveRename}
                    onClose={() => {
                        setIsRenameModalOpen(false);
                        setRenamingDocument(undefined);
                    }}
                />
            )}

            {/* Contact Form Modal */}
            {isContactFormOpen && (
                <ContactModalForm
                    contact={editingContact}
                    onSave={handleSaveContact}
                    onClose={() => {
                        setIsContactFormOpen(false);
                        setEditingContact(undefined);
                    }}
                />
            )}

            {/* Select Panel Modal */}
            {isSelectPanelModalOpen && (
                <SelectPanelModal
                    onSelect={handleSelectPanelType}
                    onClose={() => {
                        setIsSelectPanelModalOpen(false);
                        setSelectingPlaceholder(null);
                    }}
                />
            )}
        </>
    );
}
