import { useState, useMemo } from 'react';
import {
    Search, FileText, Image, File, Download, Eye,
    FolderOpen, ChevronDown, ChevronRight
} from 'lucide-react';
import { PropertyAsset, DocumentAsset } from '../../../types';
import { formatDate } from '../../../utils';
import Sidebar from '../../shared/Sidebar';

interface DocumentsSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    asset: PropertyAsset;
}

// Get icon for file type
const getFileIcon = (doc: DocumentAsset) => {
    const name = (doc.name ?? '').toLowerCase();
    if (name.endsWith('.pdf')) return <FileText size={18} className="text-red-500" />;
    if (name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.gif')) {
        return <Image size={18} className="text-blue-500" />;
    }
    if (name.endsWith('.doc') || name.endsWith('.docx')) return <FileText size={18} className="text-blue-600" />;
    if (name.endsWith('.xls') || name.endsWith('.xlsx')) return <FileText size={18} className="text-green-600" />;
    return <File size={18} className="text-gray-500" />;
};

// Document category section
const DocumentCategory: React.FC<{
    title: string;
    documents: DocumentAsset[];
    isExpanded: boolean;
    onToggle: () => void;
}> = ({ title, documents, isExpanded, onToggle }) => {
    if (documents.length === 0) return null;

    return (
        <div className="border-b border-gray-100 last:border-b-0">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <FolderOpen size={16} className="text-ivolve-mid" />
                    <span className="font-medium text-gray-700">{title}</span>
                    <span className="text-xs text-gray-400">({documents.length})</span>
                </div>
                {isExpanded ? (
                    <ChevronDown size={16} className="text-gray-400" />
                ) : (
                    <ChevronRight size={16} className="text-gray-400" />
                )}
            </button>

            {isExpanded && (
                <div className="px-4 pb-3 space-y-2">
                    {documents.map(doc => (
                        <div
                            key={doc.id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                            {getFileIcon(doc)}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-700 truncate" title={doc.name}>
                                    {doc.name}
                                </p>
                                {doc.date && (
                                    <p className="text-xs text-gray-400">{formatDate(doc.date)}</p>
                                )}
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 text-gray-400 hover:text-ivolve-mid hover:bg-gray-100 rounded transition-colors"
                                    title="View"
                                >
                                    <Eye size={14} />
                                </a>
                                <a
                                    href={doc.url}
                                    download={doc.name}
                                    className="p-1.5 text-gray-400 hover:text-ivolve-mid hover:bg-gray-100 rounded transition-colors"
                                    title="Download"
                                >
                                    <Download size={14} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default function DocumentsSidebar({ isOpen, onClose, asset }: DocumentsSidebarProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
        'Lease': true,
        'Compliance': true,
        'Other': true
    });

    const documents = asset.documents || [];

    // Group documents by type
    const groupedDocs = useMemo(() => {
        const filtered = searchQuery
            ? documents.filter(d => (d.name ?? '').toLowerCase().includes((searchQuery ?? '').toLowerCase()))
            : documents;

        return {
            Lease: filtered.filter(d => d.type === 'Lease'),
            Compliance: filtered.filter(d => d.type === 'Compliance'),
            Other: filtered.filter(d => d.type === 'Other')
        };
    }, [documents, searchQuery]);

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const totalCount = documents.length;
    const filteredCount = Object.values(groupedDocs).flat().length;

    return (
        <Sidebar
            isOpen={isOpen}
            onClose={onClose}
            title="Documents"
            subtitle={`${totalCount} file${totalCount !== 1 ? 's' : ''}`}
            width="md"
        >
            <div className="flex flex-col h-full">
                {/* Search */}
                <div className="px-4 py-3 border-b border-gray-100">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search documents..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20 focus:border-ivolve-mid"
                        />
                    </div>
                </div>

                {/* Document List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredCount > 0 ? (
                        <div>
                            <DocumentCategory
                                title="Lease Documents"
                                documents={groupedDocs.Lease}
                                isExpanded={expandedCategories['Lease']}
                                onToggle={() => toggleCategory('Lease')}
                            />
                            <DocumentCategory
                                title="Compliance Certificates"
                                documents={groupedDocs.Compliance}
                                isExpanded={expandedCategories['Compliance']}
                                onToggle={() => toggleCategory('Compliance')}
                            />
                            <DocumentCategory
                                title="Other Documents"
                                documents={groupedDocs.Other}
                                isExpanded={expandedCategories['Other']}
                                onToggle={() => toggleCategory('Other')}
                            />
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <FolderOpen size={40} className="mx-auto text-gray-300 mb-3" />
                            {documents.length === 0 ? (
                                <>
                                    <p className="text-gray-500 font-medium">No documents</p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Documents will appear here once uploaded
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="text-gray-500 font-medium">No results</p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        No documents match "{searchQuery}"
                                    </p>
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="mt-3 text-sm text-ivolve-mid hover:underline"
                                    >
                                        Clear search
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-gray-50">
                    <button
                        disabled
                        className="w-full py-2.5 px-4 text-sm text-gray-400 border border-gray-200 rounded-lg cursor-not-allowed bg-white"
                        title="Coming soon"
                    >
                        + Upload Document
                    </button>
                </div>
            </div>
        </Sidebar>
    );
}
