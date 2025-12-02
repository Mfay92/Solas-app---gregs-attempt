import React, { useState, useRef, useEffect } from 'react';
import { Maximize2, MoreHorizontal, X, Pencil, Lock, Unlock, Minus } from 'lucide-react';
import clsx from 'clsx';

interface WidgetWrapperProps {
    title: string;
    children: React.ReactNode;
    onRemove?: () => void;
    className?: string;
    style?: React.CSSProperties;
    // Passed by react-grid-layout
    onMouseDown?: React.MouseEventHandler;
    onMouseUp?: React.MouseEventHandler;
    onTouchEnd?: React.TouchEventHandler;
    // New props
    isLocked?: boolean;
    onToggleLock?: () => void;
    onMinimize?: () => void;
}

export const WidgetWrapper = React.forwardRef<HTMLDivElement, WidgetWrapperProps>(
    ({ title: initialTitle, children, onRemove, className, style, onMouseDown, onMouseUp, onTouchEnd, isLocked = false, onToggleLock, onMinimize, ...props }, ref) => {
        const [isFullScreen, setIsFullScreen] = useState(false);
        const [title, setTitle] = useState(initialTitle);
        const [isEditingTitle, setIsEditingTitle] = useState(false);
        const titleInputRef = useRef<HTMLInputElement>(null);

        const toggleFullScreen = () => {
            setIsFullScreen(!isFullScreen);
        };

        useEffect(() => {
            if (isEditingTitle && titleInputRef.current) {
                titleInputRef.current.focus();
            }
        }, [isEditingTitle]);

        const handleTitleSubmit = () => {
            setIsEditingTitle(false);
        };

        const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
                handleTitleSubmit();
            }
        };

        // Common styles for the card - off-white background for contrast on white page
        const cardClasses = clsx(
            'bg-ivolve-paper rounded-xl shadow-sm border border-slate-200/50 flex flex-col overflow-hidden transition-all duration-300 group/card',
            isFullScreen ? 'fixed inset-4 z-50 shadow-2xl bg-white' : 'h-full w-full hover:shadow-md hover:-translate-y-0.5',
            className
        );

        return (
            <>
                {/* Overlay for Full Screen Mode */}
                {isFullScreen && (
                    <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40" onClick={toggleFullScreen} />
                )}

                <div
                    ref={ref}
                    style={style}
                    className={cardClasses}
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    onTouchEnd={onTouchEnd}
                    role="region"
                    aria-label={title}
                    {...props}
                >
                    {/* Header */}
                    <div className="group/header flex items-center justify-between px-4 py-3 bg-ivolve-mid drag-handle cursor-move relative overflow-hidden">
                        {/* Title - always visible, full width when buttons hidden */}
                        <div className="flex-1 min-w-0 z-10">
                            {isEditingTitle ? (
                                <input
                                    ref={titleInputRef}
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    onBlur={handleTitleSubmit}
                                    onKeyDown={handleKeyDown}
                                    className="bg-white/10 text-white font-bold text-lg rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-white/50"
                                    aria-label="Widget title"
                                />
                            ) : (
                                <h2 className="font-bold text-white text-lg truncate select-none font-rounded tracking-wide pr-2">
                                    {title}
                                </h2>
                            )}
                        </div>

                        {/* Action buttons - hover to reveal (always visible in fullscreen) */}
                        <div className={clsx(
                            "flex items-center gap-1.5 z-10 transition-all duration-200",
                            isFullScreen
                                ? "opacity-100"
                                : "opacity-0 group-hover/header:opacity-100 translate-x-2 group-hover/header:translate-x-0"
                        )}>
                            {/* Rename button */}
                            <button
                                onClick={() => setIsEditingTitle(true)}
                                className="p-1.5 bg-white/20 text-white hover:bg-white hover:text-ivolve-mid rounded-full transition-all duration-200 active:scale-95"
                                title="Rename"
                                aria-label="Rename widget"
                            >
                                <Pencil size={14} />
                            </button>

                            {/* Lock Button */}
                            <button
                                onClick={onToggleLock}
                                className="p-1.5 bg-white/20 text-white hover:bg-white hover:text-ivolve-mid rounded-full transition-all duration-200 active:scale-95"
                                title={isLocked ? "Unlock Widget" : "Lock Widget"}
                                aria-label={isLocked ? "Unlock widget" : "Lock widget"}
                            >
                                {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
                            </button>

                            {/* Minimize Button */}
                            <button
                                onClick={onMinimize}
                                className="p-1.5 bg-white/20 text-white hover:bg-white hover:text-ivolve-mid rounded-full transition-all duration-200 active:scale-95"
                                title="Minimize to Dock"
                                aria-label="Minimize widget to dock"
                            >
                                <Minus size={14} />
                            </button>

                            {/* Fullscreen Button */}
                            <button
                                onClick={toggleFullScreen}
                                className="p-1.5 bg-white/20 text-white hover:bg-white hover:text-ivolve-mid rounded-full transition-all duration-200 active:scale-95"
                                title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
                                aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
                            >
                                {isFullScreen ? <X size={14} /> : <Maximize2 size={14} />}
                            </button>

                            {/* More Options */}
                            <button
                                className="p-1.5 bg-white/10 text-white/50 rounded-full transition-all duration-200 cursor-not-allowed"
                                title="Settings (Coming soon)"
                                disabled
                                aria-label="Widget settings (coming soon)"
                            >
                                <MoreHorizontal size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-auto p-4 relative">
                        {children}
                    </div>

                    {/* Custom Resize Handle (Visual Only - react-grid-layout handles logic) */}
                    {!isFullScreen && !isLocked && (
                        <div className="absolute bottom-0 right-0 w-8 h-8 z-20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 pointer-events-none flex items-end justify-end p-1">
                            <div className="w-4 h-4 bg-white border-2 border-ivolve-mid rounded-full shadow-md pointer-events-auto cursor-se-resize hover:scale-110 transition-transform"></div>
                        </div>
                    )}
                </div>
            </>
        );
    }
);

WidgetWrapper.displayName = 'WidgetWrapper';
