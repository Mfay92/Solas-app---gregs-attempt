import { X, User, Building, FileText, FolderOpen, Shield } from 'lucide-react';
import { usePopOut } from '../../context/PopOutContext';

export default function MinimizedTray() {
    const { windows, restoreWindow, closeWindow } = usePopOut();

    // Only show tray if there are minimized windows
    const minimizedWindows = windows.filter(w => w.isMinimized);
    if (minimizedWindows.length === 0) {
        return null;
    }

    // Get icon based on window type
    const getIcon = (type: string) => {
        switch (type) {
            case 'person-profile':
                return <User size={16} />;
            case 'property-profile':
                return <Building size={16} />;
            case 'form':
                return <FileText size={16} />;
            case 'document':
                return <FolderOpen size={16} />;
            case 'case':
                return <Shield size={16} />;
            default:
                return <FileText size={16} />;
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
            <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-2">
                    Minimized:
                </span>

                {minimizedWindows.map((window) => (
                    <div
                        key={window.id}
                        className="flex items-center gap-2 px-3 py-2 bg-ivolve-mid/10 hover:bg-ivolve-mid/20 rounded-lg transition-colors group"
                    >
                        <button
                            onClick={() => restoreWindow(window.id)}
                            className="flex items-center gap-2"
                            title={`Restore: ${window.title}`}
                        >
                            <div className="text-ivolve-mid">
                                {getIcon(window.type)}
                            </div>
                            <span className="text-sm font-medium text-gray-700 max-w-[200px] truncate">
                                {window.title}
                            </span>
                        </button>

                        <button
                            onClick={() => closeWindow(window.id)}
                            className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded transition-all"
                            title="Close"
                        >
                            <X size={12} className="text-red-600" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
