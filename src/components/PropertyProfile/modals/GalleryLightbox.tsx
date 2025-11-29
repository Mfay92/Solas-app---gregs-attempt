import { useState, useEffect } from 'react';
import {
    X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut
} from 'lucide-react';
import { PropertyPhoto } from '../../../types';

interface GalleryLightboxProps {
    isOpen: boolean;
    onClose: () => void;
    photos: PropertyPhoto[];
    initialIndex?: number;
    propertyAddress?: string;
}

export default function GalleryLightbox({
    isOpen,
    onClose,
    photos,
    initialIndex = 0,
    propertyAddress
}: GalleryLightboxProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isZoomed, setIsZoomed] = useState(false);

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
            setIsZoomed(false);
        }
    }, [isOpen, initialIndex]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            switch (e.key) {
                case 'Escape':
                    onClose();
                    break;
                case 'ArrowLeft':
                    goToPrevious();
                    break;
                case 'ArrowRight':
                    goToNext();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, currentIndex, photos.length]);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || photos.length === 0) return null;

    // Ensure currentIndex is within bounds
    const safeIndex = Math.min(Math.max(0, currentIndex), photos.length - 1);
    const currentPhoto = photos[safeIndex];

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
        setIsZoomed(false);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
        setIsZoomed(false);
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = currentPhoto.url;
        link.download = currentPhoto.caption || `photo-${currentIndex + 1}`;
        link.click();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-4 text-white">
                <div>
                    <h3 className="font-semibold">
                        {propertyAddress || 'Property Gallery'}
                    </h3>
                    <p className="text-sm text-white/70">
                        {currentIndex + 1} of {photos.length}
                        {currentPhoto.caption && ` • ${currentPhoto.caption}`}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsZoomed(!isZoomed)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title={isZoomed ? 'Zoom out' : 'Zoom in'}
                    >
                        {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
                    </button>
                    <button
                        onClick={handleDownload}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Download"
                    >
                        <Download size={20} />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Close"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Main Image Area */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                {/* Previous Button */}
                {photos.length > 1 && (
                    <button
                        onClick={goToPrevious}
                        className="absolute left-4 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors text-white"
                        aria-label="Previous image"
                    >
                        <ChevronLeft size={24} />
                    </button>
                )}

                {/* Image */}
                <div
                    className={`relative transition-transform duration-300 ${
                        isZoomed ? 'cursor-zoom-out scale-150' : 'cursor-zoom-in'
                    }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                >
                    <img
                        src={currentPhoto.url}
                        alt={currentPhoto.caption || `Photo ${currentIndex + 1}`}
                        className="max-h-[70vh] max-w-[90vw] object-contain"
                    />
                </div>

                {/* Next Button */}
                {photos.length > 1 && (
                    <button
                        onClick={goToNext}
                        className="absolute right-4 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors text-white"
                        aria-label="Next image"
                    >
                        <ChevronRight size={24} />
                    </button>
                )}
            </div>

            {/* Thumbnail Strip */}
            {photos.length > 1 && (
                <div className="flex-shrink-0 p-4">
                    <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
                        {photos.map((photo, index) => (
                            <button
                                key={photo.id}
                                onClick={() => {
                                    setCurrentIndex(index);
                                    setIsZoomed(false);
                                }}
                                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                    index === currentIndex
                                        ? 'border-white ring-2 ring-white/50'
                                        : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                            >
                                <img
                                    src={photo.url}
                                    alt={photo.caption || `Thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
