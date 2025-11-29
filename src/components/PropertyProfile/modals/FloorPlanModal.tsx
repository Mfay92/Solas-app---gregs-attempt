import { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Download, RotateCw, Home } from 'lucide-react';

interface FloorPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    floorPlanUrl?: string;
    propertyAddress?: string;
}

export default function FloorPlanModal({
    isOpen,
    onClose,
    floorPlanUrl,
    propertyAddress
}: FloorPlanModalProps) {
    const [zoomLevel, setZoomLevel] = useState(1);
    const [rotation, setRotation] = useState(0);

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setZoomLevel(1);
            setRotation(0);
        }
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

    // Lock body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 3));
    const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
    const handleRotate = () => setRotation(prev => (prev + 90) % 360);
    const handleReset = () => {
        setZoomLevel(1);
        setRotation(0);
    };

    const handleDownload = () => {
        if (!floorPlanUrl) return;
        const link = document.createElement('a');
        link.href = floorPlanUrl;
        link.download = `floor-plan-${propertyAddress || 'property'}`;
        link.click();
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-5xl bg-white rounded-xl overflow-hidden shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-ivolve-mid/10 flex items-center justify-center">
                            <Home size={20} className="text-ivolve-mid" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">Floor Plan</h3>
                            {propertyAddress && (
                                <p className="text-sm text-gray-500">{propertyAddress}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {floorPlanUrl && (
                            <>
                                <button
                                    onClick={handleZoomOut}
                                    disabled={zoomLevel <= 0.5}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                                    title="Zoom out"
                                >
                                    <ZoomOut size={18} className="text-gray-600" />
                                </button>
                                <span className="text-sm text-gray-500 w-12 text-center">
                                    {Math.round(zoomLevel * 100)}%
                                </span>
                                <button
                                    onClick={handleZoomIn}
                                    disabled={zoomLevel >= 3}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                                    title="Zoom in"
                                >
                                    <ZoomIn size={18} className="text-gray-600" />
                                </button>
                                <div className="w-px h-6 bg-gray-200 mx-1" />
                                <button
                                    onClick={handleRotate}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Rotate"
                                >
                                    <RotateCw size={18} className="text-gray-600" />
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Reset
                                </button>
                                <div className="w-px h-6 bg-gray-200 mx-1" />
                                <button
                                    onClick={handleDownload}
                                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <Download size={16} />
                                    Download
                                </button>
                            </>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2"
                            title="Close"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="h-[70vh] bg-gray-50 overflow-auto flex items-center justify-center p-8">
                    {floorPlanUrl ? (
                        <div
                            style={{
                                transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                                transition: 'transform 0.3s ease'
                            }}
                        >
                            <img
                                src={floorPlanUrl}
                                alt="Floor Plan"
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                                <Home size={36} className="text-amber-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700">No Floor Plan Available</h3>
                            <p className="text-gray-500 mt-2 max-w-sm">
                                A floor plan hasn't been uploaded for this property yet.
                            </p>
                            <button
                                disabled
                                className="mt-6 px-4 py-2 text-sm text-gray-400 border border-gray-200 rounded-lg cursor-not-allowed"
                            >
                                Upload Floor Plan (Coming Soon)
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
