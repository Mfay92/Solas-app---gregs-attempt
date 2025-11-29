import React, { useState } from 'react';
import { FileText, Search, FileSpreadsheet, FileImage, MoreVertical } from 'lucide-react';

interface FileItem {
    id: string;
    name: string;
    type: 'pdf' | 'sheet' | 'image' | 'doc';
    date: string;
    size: string;
}

const mockFiles: FileItem[] = [
    { id: '1', name: 'Q4 Financial Report.pdf', type: 'pdf', date: '2 days ago', size: '2.4 MB' },
    { id: '2', name: 'Property Maintenance Log.xlsx', type: 'sheet', date: '1 week ago', size: '850 KB' },
    { id: '3', name: 'North Lodge Floorplan.png', type: 'image', date: '3 weeks ago', size: '4.2 MB' },
    { id: '4', name: 'Tenancy Agreement Template.docx', type: 'doc', date: '1 month ago', size: '156 KB' },
    { id: '5', name: 'Safety Compliance Cert.pdf', type: 'pdf', date: '1 month ago', size: '1.1 MB' },
    { id: '6', name: 'Budget Forecast 2025.xlsx', type: 'sheet', date: '2 months ago', size: '1.2 MB' },
];

export const FilesGalleryWidget: React.FC<{ w?: number; h?: number }> = ({ w = 8 }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFiles = mockFiles.filter(file =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getIcon = (type: FileItem['type']) => {
        switch (type) {
            case 'pdf': return <FileText className="text-red-500" size={24} />;
            case 'sheet': return <FileSpreadsheet className="text-green-500" size={24} />;
            case 'image': return <FileImage className="text-blue-500" size={24} />;
            default: return <FileText className="text-slate-500" size={24} />;
        }
    };

    const isCompact = w < 6;

    return (
        <div className="h-full flex flex-col bg-slate-50/30">
            {/* Search Bar - Hide in very compact mode */}
            {!isCompact && (
                <div className="p-3 border-b border-slate-100 bg-white sticky top-0 z-10">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ivolve-mid group-focus-within:text-ivolve-dark transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search files..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20 focus:border-ivolve-mid transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>
            )}

            {/* Files Grid */}
            <div className="flex-1 overflow-y-auto p-3">
                <div className={`grid ${isCompact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'} gap-3`}>
                    {filteredFiles.map((file) => (
                        <div key={file.id} className="group bg-white p-3 rounded-lg border border-slate-200 hover:border-ivolve-mid hover:shadow-md transition-all cursor-pointer flex items-start gap-3 hover:-translate-y-0.5">
                            <div className="p-2 bg-green-50 rounded-lg group-hover:bg-ivolve-mid group-hover:text-white transition-colors text-ivolve-mid">
                                {getIcon(file.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-slate-700 truncate group-hover:text-ivolve-dark transition-colors">{file.name}</h4>
                                {!isCompact && (
                                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium"><span>{file.date}</span><span>•</span><span>{file.size}</span></div>
                                )}
                            </div>
                            {!isCompact && (
                                <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 rounded text-slate-400 transition-all"><MoreVertical size={14} /></button>
                            )}
                        </div>
                    ))}
                </div>
                {filteredFiles.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                        <Search size={32} className="mb-2 opacity-20" />
                        <p className="text-sm">No files found</p>
                    </div>
                )}
            </div>
        </div>
    );
};
