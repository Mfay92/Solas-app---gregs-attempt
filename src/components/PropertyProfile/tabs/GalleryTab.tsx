import React, { useState, useMemo } from 'react';
import {
    Camera, Grid, Rows3, X, ChevronLeft, ChevronRight,
    Download, MapPin, Maximize2, Tag, Calendar, Image as ImageIcon
} from 'lucide-react';
import { PropertyAsset, PropertyPhoto } from '../../../types';
import { formatDate } from '../../../utils';

interface TabProps {
    asset: PropertyAsset;
    units?: PropertyAsset[];
}

// Photo thumbnail card
const PhotoCard: React.FC<{
    photo: PropertyPhoto;
    onClick: () => void;
}> = ({ photo, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-gray-100"
        >
            <img
                src={photo.url}
                alt={photo.caption || 'Property photo'}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Primary badge */}
            {photo.isPrimary && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-ivolve-mid text-white text-xs font-medium rounded-full">
                    Primary
                </div>
            )}

            {/* Room tag */}
            {photo.room && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded-full">
                    {photo.room}
                </div>
            )}

            {/* Caption on hover */}
            <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform">
                {photo.caption && (
                    <p className="text-white text-sm truncate">{photo.caption}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                    <Maximize2 size={14} className="text-white/70" />
                    <span className="text-white/70 text-xs">Click to enlarge</span>
                </div>
            </div>
        </div>
    );
};

// Lightbox modal
const Lightbox: React.FC<{
    photos: PropertyPhoto[];
    currentIndex: number;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}> = ({ photos, currentIndex, onClose, onPrev, onNext }) => {
    // Ensure index is within bounds
    const safeIndex = Math.min(Math.max(0, currentIndex), Math.max(0, photos.length - 1));
    const photo = photos[safeIndex];

    // Early return if no photos
    if (!photo) return null;

    // Handle keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') onPrev();
            if (e.key === 'ArrowRight') onNext();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, onPrev, onNext]);

    return (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" onClick={onClose}>
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
            >
                <X size={24} />
            </button>

            {/* Navigation arrows */}
            {photos.length > 1 && (
                <>
                    <button
                        onClick={e => { e.stopPropagation(); onPrev(); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <button
                        onClick={e => { e.stopPropagation(); onNext(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ChevronRight size={32} />
                    </button>
                </>
            )}

            {/* Main image */}
            <div
                className="max-w-6xl max-h-[85vh] mx-4"
                onClick={e => e.stopPropagation()}
            >
                <img
                    src={photo.url}
                    alt={photo.caption || 'Property photo'}
                    className="max-w-full max-h-[75vh] object-contain rounded-lg"
                />

                {/* Photo info */}
                <div className="mt-4 text-center">
                    {photo.caption && (
                        <h3 className="text-white text-lg font-medium mb-2">{photo.caption}</h3>
                    )}
                    <div className="flex items-center justify-center gap-4 text-white/60 text-sm">
                        {photo.room && (
                            <span className="flex items-center gap-1">
                                <MapPin size={14} />
                                {photo.room}
                            </span>
                        )}
                        {photo.uploadedAt && (
                            <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {formatDate(photo.uploadedAt)}
                            </span>
                        )}
                        {photo.tags && photo.tags.length > 0 && (
                            <span className="flex items-center gap-1">
                                <Tag size={14} />
                                {photo.tags.join(', ')}
                            </span>
                        )}
                    </div>

                    {/* Counter */}
                    <div className="mt-4 text-white/50 text-sm">
                        {currentIndex + 1} of {photos.length}
                    </div>
                </div>

                {/* Download button */}
                <div className="absolute bottom-4 right-4">
                    <a
                        href={photo.url}
                        download={photo.caption || 'photo'}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                        onClick={e => e.stopPropagation()}
                    >
                        <Download size={16} />
                        Download
                    </a>
                </div>
            </div>

            {/* Thumbnail strip */}
            {photos.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-black/50 rounded-full">
                    {photos.map((p, idx) => (
                        <button
                            key={p.id}
                            onClick={e => { e.stopPropagation(); /* would need setCurrentIndex exposed */ }}
                            className={`w-2 h-2 rounded-full transition-colors ${
                                idx === currentIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Floor plan section
const FloorPlanSection: React.FC<{
    floorPlanUrl: string;
    onView: () => void;
}> = ({ floorPlanUrl, onView }) => {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-ivolve-mid" />
                Floor Plan
            </h3>
            <div
                onClick={onView}
                className="relative rounded-lg overflow-hidden cursor-pointer group"
            >
                <img
                    src={floorPlanUrl}
                    alt="Floor plan"
                    className="w-full h-64 object-contain bg-gray-50"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-gray-800 font-medium">
                        <Maximize2 size={18} />
                        View Full Size
                    </div>
                </div>
            </div>
            <div className="mt-3 flex items-center justify-end">
                <a
                    href={floorPlanUrl}
                    download="floor-plan"
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-ivolve-mid"
                >
                    <Download size={14} />
                    Download
                </a>
            </div>
        </div>
    );
};

const GalleryTab: React.FC<TabProps> = ({ asset }) => {
    const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid');
    const [roomFilter, setRoomFilter] = useState<string>('All');
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [showFloorPlanModal, setShowFloorPlanModal] = useState(false);

    const photos = asset.photos || [];

    // Get unique rooms from photos
    const availableRooms = useMemo(() => {
        const rooms = new Set<string>();
        photos.forEach(p => {
            if (p.room) rooms.add(p.room);
        });
        return ['All', ...Array.from(rooms)];
    }, [photos]);

    // Filter photos
    const filteredPhotos = useMemo(() => {
        if (roomFilter === 'All') return photos;
        return photos.filter(p => p.room === roomFilter);
    }, [photos, roomFilter]);

    // Lightbox navigation
    const openLightbox = (index: number) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);
    const prevPhoto = () => {
        if (lightboxIndex !== null) {
            setLightboxIndex(lightboxIndex === 0 ? filteredPhotos.length - 1 : lightboxIndex - 1);
        }
    };
    const nextPhoto = () => {
        if (lightboxIndex !== null) {
            setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Camera size={20} className="text-ivolve-mid" />
                        Photo Gallery
                        <span className="text-sm font-normal text-gray-500">({photos.length} photos)</span>
                    </h2>

                    <div className="flex items-center gap-2">
                        {/* View mode toggle */}
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded transition-colors ${
                                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                                }`}
                                title="Grid view"
                            >
                                <Grid size={16} className="text-gray-600" />
                            </button>
                            <button
                                onClick={() => setViewMode('large')}
                                className={`p-2 rounded transition-colors ${
                                    viewMode === 'large' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                                }`}
                                title="Large view"
                            >
                                <Rows3 size={16} className="text-gray-600" />
                            </button>
                        </div>

                        {/* Upload button (disabled) */}
                        <button
                            disabled
                            className="px-3 py-1.5 text-sm text-gray-400 border border-gray-200 rounded-lg cursor-not-allowed"
                            title="Coming soon"
                        >
                            + Upload Photos
                        </button>
                    </div>
                </div>

                {/* Room filters */}
                {availableRooms.length > 1 && (
                    <div className="flex items-center gap-2 flex-wrap">
                        {availableRooms.map(room => (
                            <button
                                key={room}
                                onClick={() => setRoomFilter(room)}
                                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                                    roomFilter === room
                                        ? 'bg-ivolve-mid text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {room}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Floor Plan */}
            {asset.floorPlanUrl && (
                <FloorPlanSection
                    floorPlanUrl={asset.floorPlanUrl}
                    onView={() => setShowFloorPlanModal(true)}
                />
            )}

            {/* Photo Grid */}
            {filteredPhotos.length > 0 ? (
                <div className={
                    viewMode === 'grid'
                        ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
                        : 'grid grid-cols-1 md:grid-cols-2 gap-6'
                }>
                    {filteredPhotos.map((photo, index) => (
                        viewMode === 'grid' ? (
                            <PhotoCard
                                key={photo.id}
                                photo={photo}
                                onClick={() => openLightbox(index)}
                            />
                        ) : (
                            <div
                                key={photo.id}
                                onClick={() => openLightbox(index)}
                                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer group hover:shadow-md transition-shadow"
                            >
                                <div className="relative aspect-video">
                                    <img
                                        src={photo.url}
                                        alt={photo.caption || 'Property photo'}
                                        className="w-full h-full object-cover"
                                    />
                                    {photo.isPrimary && (
                                        <div className="absolute top-3 left-3 px-2.5 py-1 bg-ivolve-mid text-white text-sm font-medium rounded-full">
                                            Primary Photo
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    {photo.caption && (
                                        <h4 className="font-medium text-gray-800 mb-2">{photo.caption}</h4>
                                    )}
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        {photo.room && (
                                            <span className="flex items-center gap-1">
                                                <MapPin size={14} />
                                                {photo.room}
                                            </span>
                                        )}
                                        {photo.uploadedAt && (
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {formatDate(photo.uploadedAt)}
                                            </span>
                                        )}
                                    </div>
                                    {photo.tags && photo.tags.length > 0 && (
                                        <div className="flex items-center gap-1 mt-3 flex-wrap">
                                            {photo.tags.map(tag => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
                    <ImageIcon size={48} className="mx-auto text-gray-300 mb-3" />
                    {photos.length === 0 ? (
                        <>
                            <p className="text-lg font-medium text-gray-500">No photos uploaded yet</p>
                            <p className="text-sm text-gray-400 mt-1">Upload photos of the property, units, and amenities</p>
                        </>
                    ) : (
                        <>
                            <p className="text-lg font-medium text-gray-500">No photos match your filter</p>
                            <button
                                onClick={() => setRoomFilter('All')}
                                className="mt-3 text-sm text-ivolve-mid hover:underline"
                            >
                                Clear filter
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Lightbox */}
            {lightboxIndex !== null && (
                <Lightbox
                    photos={filteredPhotos}
                    currentIndex={lightboxIndex}
                    onClose={closeLightbox}
                    onPrev={prevPhoto}
                    onNext={nextPhoto}
                />
            )}

            {/* Floor Plan Modal */}
            {showFloorPlanModal && asset.floorPlanUrl && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowFloorPlanModal(false)}
                >
                    <button
                        onClick={() => setShowFloorPlanModal(false)}
                        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <img
                        src={asset.floorPlanUrl}
                        alt="Floor plan"
                        className="max-w-full max-h-[90vh] object-contain"
                        onClick={e => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};

export default GalleryTab;
