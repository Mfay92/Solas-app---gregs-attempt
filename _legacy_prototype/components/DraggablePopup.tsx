import React, { useState, useEffect, useRef } from 'react';
import { useUI } from '../contexts/UIContext';
import { MinusIcon } from './Icons';

type DraggablePopupProps = {
    children: React.ReactNode;
    personName: string;
    onClose: () => void;
};

const DraggablePopup: React.FC<DraggablePopupProps> = ({ children, personName, onClose }) => {
    const { popupPosition, setPopupPosition, isPopupMinimized, setPopupMinimized } = useUI();
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const nodeRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!nodeRef.current) return;
        // Only allow dragging on the header bar, not the content
        if (e.target !== e.currentTarget && !(e.target as HTMLElement).closest('.drag-handle')) {
            return;
        }
        
        setIsDragging(true);
        const rect = nodeRef.current.getBoundingClientRect();
        dragOffset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
        e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !nodeRef.current) return;
        setPopupPosition({
            x: e.clientX - dragOffset.current.x,
            y: e.clientY - dragOffset.current.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);
    
    if (isPopupMinimized) {
        return null; // The SmartFooter will handle rendering the minimized tab
    }

    return (
        <div
            ref={nodeRef}
            className="fixed w-full max-w-2xl h-[85vh] bg-ivolve-off-white shadow-2xl z-50 rounded-lg flex flex-col"
            style={{ top: popupPosition.y, left: popupPosition.x }}
        >
            <div
                onMouseDown={handleMouseDown}
                className="drag-handle flex-shrink-0 flex justify-between items-center p-2 bg-ivolve-dark-green text-white rounded-t-lg cursor-grab"
            >
                <h3 className="font-bold text-sm ml-2">{personName}</h3>
                <div className="flex items-center space-x-1">
                    <button onClick={() => setPopupMinimized(true)} className="p-2 hover:bg-white/20 rounded-full" title="Minimize"><MinusIcon /></button>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full" title="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            </div>
            {children}
        </div>
    );
};

export default DraggablePopup;
