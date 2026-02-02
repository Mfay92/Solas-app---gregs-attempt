import { useState, useRef, useEffect } from 'react';
import { X, Minus, Maximize2, Minimize2 } from 'lucide-react';
import { usePopOut, PopOutWindow } from '../../context/PopOutContext';

interface PopOutContainerProps {
    window: PopOutWindow;
}

export default function PopOutContainer({ window: popOutWindow }: PopOutContainerProps) {
    const { closeWindow, minimizeWindow } = usePopOut();
    const [isMaximized, setIsMaximized] = useState(false);
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [size] = useState({ width: 800, height: 600 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Don't render if minimized
    if (popOutWindow.isMinimized) {
        return null;
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        // Only start drag if clicking on header (not buttons)
        if ((e.target as HTMLElement).closest('button')) {
            return;
        }

        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;

        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, dragStart]);

    const toggleMaximize = () => {
        setIsMaximized(!isMaximized);
    };

    const handleMinimize = () => {
        minimizeWindow(popOutWindow.id);
    };

    const handleClose = () => {
        closeWindow(popOutWindow.id);
    };

    // Styles for maximized vs windowed
    const containerStyle = isMaximized
        ? {
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              transform: 'none'
          }
        : {
              top: `${position.y}px`,
              left: `${position.x}px`,
              width: `${size.width}px`,
              height: `${size.height}px`
          };

    return (
        <div
            ref={containerRef}
            className="fixed bg-white shadow-2xl rounded-lg overflow-hidden z-50 flex flex-col"
            style={containerStyle}
        >
            {/* Window Header */}
            <div
                className={`bg-ivolve-teal text-white px-4 py-3 flex items-center justify-between select-none ${
                    !isMaximized ? 'cursor-move' : ''
                }`}
                onMouseDown={handleMouseDown}
            >
                <div className="flex items-center gap-3">
                    <span className="font-semibold">{popOutWindow.title}</span>
                    <span className="px-2 py-0.5 bg-white/20 rounded text-xs">
                        {popOutWindow.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    {/* Minimize button */}
                    <button
                        onClick={handleMinimize}
                        className="p-1.5 hover:bg-white/20 rounded transition-colors"
                        title="Minimize"
                    >
                        <Minus size={16} />
                    </button>

                    {/* Maximize/Restore button */}
                    <button
                        onClick={toggleMaximize}
                        className="p-1.5 hover:bg-white/20 rounded transition-colors"
                        title={isMaximized ? 'Restore' : 'Maximize'}
                    >
                        {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>

                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="p-1.5 hover:bg-red-500 rounded transition-colors"
                        title="Close"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Window Content */}
            <div className="flex-1 overflow-auto">
                {popOutWindow.content}
            </div>
        </div>
    );
}
