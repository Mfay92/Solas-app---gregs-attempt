import { FolderOpen, Upload, FileText } from 'lucide-react';

export default function DocumentsTab() {
    return (
        <div className="space-y-6">
            {/* Upload Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Upload className="text-ivolve-mid" size={20} />
                    Upload Documents
                </h2>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-ivolve-mid transition-colors cursor-pointer">
                    <Upload className="mx-auto text-gray-400 mb-3" size={48} />
                    <p className="text-gray-600 font-medium mb-1">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">PDF, DOC, DOCX, JPG, PNG (max 10MB)</p>
                </div>
            </div>

            {/* Document Categories */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FolderOpen className="text-ivolve-mid" size={20} />
                    Document Categories
                </h2>
                <div className="space-y-3">
                    <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                            <FileText className="text-gray-400" size={20} />
                            <div>
                                <div className="font-medium text-gray-800">Assessment Reports</div>
                                <div className="text-sm text-gray-500">0 documents</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                            <FileText className="text-gray-400" size={20} />
                            <div>
                                <div className="font-medium text-gray-800">Medical Records</div>
                                <div className="text-sm text-gray-500">0 documents</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                            <FileText className="text-gray-400" size={20} />
                            <div>
                                <div className="font-medium text-gray-800">Funding Documents</div>
                                <div className="text-sm text-gray-500">0 documents</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                            <FileText className="text-gray-400" size={20} />
                            <div>
                                <div className="font-medium text-gray-800">ID Documents</div>
                                <div className="text-sm text-gray-500">0 documents</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
