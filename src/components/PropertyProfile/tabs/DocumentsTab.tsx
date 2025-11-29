import React, { useState, useMemo } from 'react';
import {
    FolderOpen, FileText, Image, File, Download, Search,
    Grid, List, Eye, AlertTriangle, X
} from 'lucide-react';
import { PropertyAsset, DocumentAsset } from '../../../types';
import { formatDate } from '../../../utils';

interface TabProps {
    asset: PropertyAsset;
    units: PropertyAsset[];
}

// Get icon for file type
const getFileIcon = (doc: DocumentAsset) => {
    const name = (doc.name ?? '').toLowerCase();
    if (name.endsWith('.pdf')) return <FileText size={24} className="text-red-500" />;
    if (name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.gif')) {
        return <Image size={24} className="text-blue-500" />;
    }
    if (name.endsWith('.doc') || name.endsWith('.docx')) return <FileText size={24} className="text-blue-600" />;
    if (name.endsWith('.xls') || name.endsWith('.xlsx')) return <FileText size={24} className="text-green-600" />;
    return <File size={24} className="text-gray-500" />;
};

// Type badge colors
const typeColors: Record<string, string> = {
    'Lease': 'bg-purple-100 text-purple-700',
    'Compliance': 'bg-green-100 text-green-700',
    'Other': 'bg-gray-100 text-gray-600'
};

// Document card
const DocumentCard: React.FC<{
    doc: DocumentAsset;
    onClick: () => void;
}> = ({ doc, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:border-ivolve-mid/30 transition-all cursor-pointer group"
        >
            <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-ivolve-mid/10 transition-colors">
                    {getFileIcon(doc)}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 truncate" title={doc.name}>
                        {doc.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${typeColors[doc.type] || typeColors['Other']}`}>
                            {doc.type}
                        </span>
                        {doc.date && (
                            <span className="text-xs text-gray-500">{formatDate(doc.date)}</span>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
                <button
                    onClick={e => {
                        e.stopPropagation();
                        window.open(doc.url, '_blank');
                    }}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-gray-600 hover:text-ivolve-mid hover:bg-gray-50 rounded transition-colors"
                >
                    <Eye size={14} />
                    View
                </button>
                <button
                    onClick={e => {
                        e.stopPropagation();
                        // Trigger download
                        const link = document.createElement('a');
                        link.href = doc.url;
                        link.download = doc.name;
                        link.click();
                    }}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-gray-600 hover:text-ivolve-mid hover:bg-gray-50 rounded transition-colors"
                >
                    <Download size={14} />
                    Download
                </button>
            </div>
        </div>
    );
};

// Preview modal
const PreviewModal: React.FC<{
    doc: DocumentAsset;
    onClose: () => void;
}> = ({ doc, onClose }) => {
    const isImage = doc.name.match(/\.(jpg|jpeg|png|gif)$/i);
    const isPdf = doc.name.match(/\.pdf$/i);

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="relative w-full max-w-4xl bg-white rounded-xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        {getFileIcon(doc)}
                        <div>
                            <h3 className="font-semibold text-gray-800">{doc.name}</h3>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded ${typeColors[doc.type]}`}>
                                {doc.type}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href={doc.url}
                            download={doc.name}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-ivolve-mid border border-gray-200 rounded-lg"
                        >
                            <Download size={16} />
                            Download
                        </a>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>
                </div>
                <div className="h-[70vh] bg-gray-100 flex items-center justify-center">
                    {isImage ? (
                        <img
                            src={doc.url}
                            alt={doc.name}
                            className="max-w-full max-h-full object-contain"
                        />
                    ) : isPdf ? (
                        <iframe
                            src={doc.url}
                            className="w-full h-full"
                            title={doc.name}
                        />
                    ) : (
                        <div className="text-center">
                            {getFileIcon(doc)}
                            <p className="text-gray-500 mt-2">Preview not available</p>
                            <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-flex items-center gap-1 px-4 py-2 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-colors"
                            >
                                <Eye size={16} />
                                Open in new tab
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const DocumentsTab: React.FC<TabProps> = ({ asset }) => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [typeFilter, setTypeFilter] = useState<'all' | 'Lease' | 'Compliance' | 'Other'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDoc, setSelectedDoc] = useState<DocumentAsset | null>(null);

    const documents = asset.documents || [];

    // Count by type
    const counts = useMemo(() => ({
        all: documents.length,
        Lease: documents.filter(d => d.type === 'Lease').length,
        Compliance: documents.filter(d => d.type === 'Compliance').length,
        Other: documents.filter(d => d.type === 'Other').length
    }), [documents]);

    // Filter documents
    const filteredDocs = useMemo(() => {
        let result = [...documents];

        if (typeFilter !== 'all') {
            result = result.filter(d => d.type === typeFilter);
        }

        if (searchQuery) {
            const query = (searchQuery ?? '').toLowerCase();
            result = result.filter(d => (d.name ?? '').toLowerCase().includes(query));
        }

        // Sort by date
        result.sort((a, b) => {
            if (!a.date) return 1;
            if (!b.date) return -1;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        return result;
    }, [documents, typeFilter, searchQuery]);

    return (
        <div className="space-y-6">
            {/* Missing Documents Alert */}
            {asset.missingDocs && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-amber-800">Missing Documents</h3>
                        <p className="text-sm text-amber-700 mt-1">
                            Some required documents may be missing for this property. Please review and upload any missing files.
                        </p>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <FolderOpen size={20} className="text-ivolve-mid" />
                        Documents
                        <span className="text-sm font-normal text-gray-500">({documents.length})</span>
                    </h2>
                    <button
                        disabled
                        className="px-3 py-1.5 text-sm text-gray-400 border border-gray-200 rounded-lg cursor-not-allowed"
                        title="Coming soon"
                    >
                        + Upload Document
                    </button>
                </div>

                {/* Category Tabs */}
                <div className="flex items-center gap-2">
                    {(['all', 'Lease', 'Compliance', 'Other'] as const).map(type => (
                        <button
                            key={type}
                            onClick={() => setTypeFilter(type)}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                                typeFilter === type
                                    ? 'bg-ivolve-mid text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {type === 'all' ? 'All' : type} ({counts[type]})
                        </button>
                    ))}
                </div>
            </div>

            {/* Search and View Toggle */}
            <div className="flex items-center gap-4">
                <div className="flex-1">
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

                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded transition-colors ${
                            viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                        }`}
                    >
                        <Grid size={16} className="text-gray-600" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded transition-colors ${
                            viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                        }`}
                    >
                        <List size={16} className="text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Documents */}
            {filteredDocs.length > 0 ? (
                viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredDocs.map(doc => (
                            <DocumentCard
                                key={doc.id}
                                doc={doc}
                                onClick={() => setSelectedDoc(doc)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Name</th>
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Type</th>
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Date</th>
                                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredDocs.map(doc => (
                                    <tr key={doc.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {getFileIcon(doc)}
                                                <span className="font-medium text-gray-800">{doc.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded ${typeColors[doc.type]}`}>
                                                {doc.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {doc.date ? formatDate(doc.date) : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedDoc(doc)}
                                                    className="p-1.5 text-gray-400 hover:text-ivolve-mid hover:bg-gray-100 rounded transition-colors"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <a
                                                    href={doc.url}
                                                    download={doc.name}
                                                    className="p-1.5 text-gray-400 hover:text-ivolve-mid hover:bg-gray-100 rounded transition-colors"
                                                >
                                                    <Download size={16} />
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
                    <FolderOpen size={48} className="mx-auto text-gray-300 mb-3" />
                    {documents.length === 0 ? (
                        <>
                            <p className="text-lg font-medium text-gray-500">No documents uploaded yet</p>
                            <p className="text-sm text-gray-400 mt-1">Upload lease documents, compliance certificates, and more</p>
                        </>
                    ) : (
                        <>
                            <p className="text-lg font-medium text-gray-500">No documents match your search</p>
                            <button
                                onClick={() => {
                                    setTypeFilter('all');
                                    setSearchQuery('');
                                }}
                                className="mt-3 text-sm text-ivolve-mid hover:underline"
                            >
                                Clear filters
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Preview Modal */}
            {selectedDoc && (
                <PreviewModal
                    doc={selectedDoc}
                    onClose={() => setSelectedDoc(null)}
                />
            )}
        </div>
    );
};

export default DocumentsTab;
