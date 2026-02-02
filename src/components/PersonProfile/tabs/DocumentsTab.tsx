import { useState } from 'react';
import { Person, ServiceType } from '../../../types';
import { PersonTabId } from '../PersonHeroBanner';
import {
    FolderOpen, Upload, FileText, FileImage, File,
    Download, Eye, Trash2, Search, Grid3x3, List, Filter
} from 'lucide-react';

interface DocumentsTabProps {
    person: Person;
    onJumpToTab: (tab: PersonTabId) => void;
    serviceType?: ServiceType;
    borderColor?: string;
}

type DocumentCategory =
    | 'Tenancy Documents'
    | 'Support Plans'
    | 'Risk Assessments'
    | 'Medical Documents'
    | 'ID Documents'
    | 'Financial Documents'
    | 'Other';

interface MockDocument {
    id: string;
    filename: string;
    category: DocumentCategory;
    uploadedDate: string;
    uploadedBy: string;
    fileSize: string;
    fileType: 'pdf' | 'doc' | 'image' | 'other';
}

export default function DocumentsTab({ person, onJumpToTab, serviceType, borderColor = 'border-gray-200' }: DocumentsTabProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock documents (empty for now)
    const mockDocuments: MockDocument[] = [];

    const categories: (DocumentCategory | 'All')[] = [
        'All',
        'Tenancy Documents',
        'Support Plans',
        'Risk Assessments',
        'Medical Documents',
        'ID Documents',
        'Financial Documents',
        'Other'
    ];

    const filteredDocuments = mockDocuments.filter(doc => {
        const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
        const matchesSearch = doc.filename.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getFileIcon = (fileType: string) => {
        switch (fileType) {
            case 'pdf':
                return <FileText className="text-red-500" size={24} />;
            case 'doc':
                return <FileText className="text-blue-500" size={24} />;
            case 'image':
                return <FileImage className="text-purple-500" size={24} />;
            default:
                return <File className="text-gray-500" size={24} />;
        }
    };

    const getCategoryColor = (category: DocumentCategory) => {
        const colors: Record<DocumentCategory, string> = {
            'Tenancy Documents': 'bg-blue-100 text-blue-800',
            'Support Plans': 'bg-green-100 text-green-800',
            'Risk Assessments': 'bg-orange-100 text-orange-800',
            'Medical Documents': 'bg-red-100 text-red-800',
            'ID Documents': 'bg-purple-100 text-purple-800',
            'Financial Documents': 'bg-yellow-100 text-yellow-800',
            'Other': 'bg-gray-100 text-gray-800'
        };
        return colors[category];
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className={`bg-white rounded-xl shadow-sm border-2 ${borderColor} overflow-hidden`}>
                <div className="bg-gradient-to-r from-ivolve-teal to-ivolve-mid px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <FolderOpen size={24} />
                            Documents
                        </h2>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white text-ivolve-mid rounded-lg hover:bg-gray-50 transition-colors font-medium">
                            <Upload size={18} />
                            Upload Document
                        </button>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search documents..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ivolve-mid focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center gap-2">
                            <Filter size={20} className="text-gray-400" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value as DocumentCategory | 'All')}
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ivolve-mid focus:border-transparent bg-white"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded transition-colors ${
                                    viewMode === 'list'
                                        ? 'bg-white shadow-sm text-ivolve-mid'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                                title="List view"
                            >
                                <List size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded transition-colors ${
                                    viewMode === 'grid'
                                        ? 'bg-white shadow-sm text-ivolve-mid'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                                title="Grid view"
                            >
                                <Grid3x3 size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Document Count */}
                {filteredDocuments.length > 0 && (
                    <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
                        <p className="text-sm text-gray-600">
                            Showing <span className="font-semibold">{filteredDocuments.length}</span> document{filteredDocuments.length !== 1 ? 's' : ''}
                            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                        </p>
                    </div>
                )}

                {/* Documents List/Grid */}
                {filteredDocuments.length === 0 ? (
                    /* Empty State */
                    <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                            <FolderOpen className="text-gray-400" size={40} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Documents</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            {searchQuery || selectedCategory !== 'All'
                                ? 'No documents match your search criteria. Try adjusting your filters.'
                                : 'No documents have been uploaded for this person yet. Upload the first document to get started.'}
                        </p>
                        <button className="inline-flex items-center gap-2 px-6 py-3 bg-ivolve-mid text-white rounded-lg hover:bg-ivolve-dark transition-colors font-medium">
                            <Upload size={18} />
                            Upload First Document
                        </button>
                    </div>
                ) : viewMode === 'list' ? (
                    /* List View */
                    <div className="divide-y divide-gray-100">
                        {filteredDocuments.map((doc) => (
                            <div key={doc.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 pt-1">
                                        {getFileIcon(doc.fileType)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-800 truncate mb-1">
                                            {doc.filename}
                                        </h4>
                                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                                            <span>Uploaded {new Date(doc.uploadedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            <span className="text-gray-300">•</span>
                                            <span>{doc.uploadedBy}</span>
                                            <span className="text-gray-300">•</span>
                                            <span>{doc.fileSize}</span>
                                        </div>
                                        <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${getCategoryColor(doc.category)}`}>
                                            {doc.category}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 text-ivolve-mid hover:bg-ivolve-mid/10 rounded-lg transition-colors" title="View">
                                            <Eye size={18} />
                                        </button>
                                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Download">
                                            <Download size={18} />
                                        </button>
                                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Grid View */
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredDocuments.map((doc) => (
                                <div key={doc.id} className={`bg-white rounded-lg p-4 border-2 ${borderColor} hover:shadow-md transition-shadow`}>
                                    <div className="flex items-start gap-3 mb-3">
                                        {getFileIcon(doc.fileType)}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-800 truncate text-sm mb-1">
                                                {doc.filename}
                                            </h4>
                                            <p className="text-xs text-gray-500">{doc.fileSize}</p>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <p className="text-xs text-gray-500 mb-1">
                                            {new Date(doc.uploadedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                        <p className="text-xs text-gray-500">by {doc.uploadedBy}</p>
                                    </div>
                                    <span className={`inline-block px-2 py-1 text-xs rounded mb-3 ${getCategoryColor(doc.category)}`}>
                                        {doc.category}
                                    </span>
                                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                                        <button className="flex-1 p-2 text-sm text-ivolve-mid hover:bg-ivolve-mid/10 rounded transition-colors font-medium">
                                            View
                                        </button>
                                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded transition-colors" title="Download">
                                            <Download size={16} />
                                        </button>
                                        <button className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors" title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Document Categories Overview */}
            <div className={`bg-white rounded-xl shadow-sm border-2 ${borderColor} p-6`}>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Document Categories</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {categories.filter(c => c !== 'All').map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category as DocumentCategory)}
                            className={`p-4 rounded-lg border-2 transition-all text-left ${
                                selectedCategory === category
                                    ? 'border-ivolve-mid bg-ivolve-mid/5'
                                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            <p className="text-sm font-semibold text-gray-800 mb-1">{category}</p>
                            <p className={`text-2xl font-bold ${
                                selectedCategory === category ? 'text-ivolve-mid' : 'text-gray-400'
                            }`}>
                                0
                            </p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
