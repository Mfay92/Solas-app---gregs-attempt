import { useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface ContactPopoverProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    anchorRef: React.RefObject<HTMLButtonElement | null>;
}

export default function ContactPopover({ isOpen, onClose, title, children, anchorRef }: ContactPopoverProps) {
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(e.target as Node) &&
                anchorRef.current &&
                !anchorRef.current.contains(e.target as Node)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose, anchorRef]);

    if (!isOpen) return null;

    return (
        <div
            ref={popoverRef}
            className="absolute top-full left-0 mt-2 z-[100] bg-white rounded-xl shadow-xl border border-gray-100 p-3 min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-200"
        >
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</span>
                <button onClick={onClose} className="p-0.5 hover:bg-gray-100 rounded transition-colors">
                    <X size={12} className="text-gray-400" />
                </button>
            </div>
            {children}
        </div>
    );
}
