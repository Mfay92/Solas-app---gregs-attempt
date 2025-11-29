import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    width?: 'sm' | 'md' | 'lg';
}

const widthClasses = {
    sm: 'max-w-xs', // 320px
    md: 'max-w-md', // 400px
    lg: 'max-w-lg', // 480px
};

export default function Sidebar({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    width = 'md'
}: SidebarProps) {
    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when sidebar is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 transition-opacity duration-300"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Sidebar Panel */}
            <div
                className={`relative w-full ${widthClasses[width]} bg-white h-full shadow-2xl flex flex-col animate-slide-in-right`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="sidebar-title"
            >
                {/* Header */}
                <div className="flex-shrink-0 sticky top-0 bg-white border-b border-gray-100 px-6 py-4 z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 id="sidebar-title" className="text-lg font-semibold text-gray-800">
                                {title}
                            </h2>
                            {subtitle && (
                                <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Close sidebar"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
