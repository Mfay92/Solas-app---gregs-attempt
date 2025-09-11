import React, { ReactNode, useEffect, useMemo } from 'react';

// A generic modal component
const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode; className?: string }> = ({ title, onClose, children, className = '' }) => {
    const titleId = useMemo(() => `modal-title-${Math.random().toString(36).substring(2, 9)}`, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className={`bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col ${className}`} 
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
            >
                <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
                    <h3 id={titleId} className="text-xl font-bold text-solas-dark">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none" aria-label="Close modal">&times;</button>
                </header>
                <main className="p-6 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
};

export default Modal;