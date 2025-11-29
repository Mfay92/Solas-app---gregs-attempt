import React, { useState, useRef, useEffect } from 'react';
import {
    Wrench, FolderOpen, Home, History, GripVertical, ChevronDown, Briefcase,
    MapPin, MessageCircle
} from 'lucide-react';

interface FloatingToolbarProps {
    onReportRepairClick?: () => void;
    onDocumentsClick: () => void;
    onFloorPlanClick: () => void;
    onActivityLogClick: () => void;
    onMapsClick?: () => void;
    onSupportClick?: () => void;
    documentCount?: number;
    hasFloorPlan?: boolean;
}

interface Position {
    x: number;
    y: number;
}

type ExpandDirection = 'down' | 'up' | 'left' | 'right';
type CollapseState = 'icon' | 'pill' | 'expanded';
type ToolbarSize = 'compact' | 'normal' | 'large';

// Tool descriptions for large mode
const toolDescriptions: Record<string, string> = {
    support: 'Ask Solas for help with anything about this property or the system.',
    repair: 'Report repairs for this property and track their progress.',
    documents: 'View and manage all documents related to this property.',
    floorPlans: 'View floor plans and room layouts for this property.',
    maps: 'View property location and plan routes.',
    activity: 'View the activity log and history for this property.'
};

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
    onReportRepairClick,
    onDocumentsClick,
    onFloorPlanClick,
    onActivityLogClick,
    onMapsClick,
    onSupportClick,
    documentCount = 0,
    hasFloorPlan = false
}) => {
    // Start as icon, positioned at top right area
    const [position, setPosition] = useState<Position>({ x: window.innerWidth - 80, y: 70 });
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [collapseState, setCollapseState] = useState<CollapseState>('icon'); // Start as icon
    const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
    const [expandDirection, setExpandDirection] = useState<ExpandDirection>('down');
    const [toolbarSize, setToolbarSize] = useState<ToolbarSize>('compact'); // Default to compact
    const [customScale, setCustomScale] = useState(1);
    const toolbarRef = useRef<HTMLDivElement>(null);
    const resizeStartRef = useRef<{ x: number; y: number; scale: number }>({ x: 0, y: 0, scale: 1 });

    // Size configurations
    const sizeConfig = {
        compact: { iconSize: 40, iconStroke: 20, fontSize: '10px', padding: 'p-2', gap: 'gap-1', showDesc: false },
        normal: { iconSize: 48, iconStroke: 24, fontSize: '11px', padding: 'p-2.5', gap: 'gap-2', showDesc: false },
        large: { iconSize: 56, iconStroke: 28, fontSize: '12px', padding: 'p-3', gap: 'gap-3', showDesc: true }
    };

    const currentSize = sizeConfig[toolbarSize];
    const scaledIconSize = Math.round(currentSize.iconSize * customScale);
    const scaledIconStroke = Math.round(currentSize.iconStroke * customScale);

    // Calculate best expand direction based on position
    const calculateExpandDirection = (x: number, y: number): ExpandDirection => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const expandedWidth = 450;
        const expandedHeight = toolbarSize === 'large' ? 280 : 160;

        const spaceBelow = viewportHeight - y - 50;
        const spaceAbove = y;
        const spaceRight = viewportWidth - x;
        const spaceLeft = x;

        if (spaceBelow >= expandedHeight) return 'down';
        if (spaceAbove >= expandedHeight) return 'up';
        if (spaceRight >= expandedWidth) return 'right';
        if (spaceLeft >= expandedWidth) return 'left';

        return 'down';
    };

    useEffect(() => {
        if (!isDragging) {
            setExpandDirection(calculateExpandDirection(position.x, position.y));
        }
    }, [position, isDragging, toolbarSize]);

    // Handle drag start
    const handleMouseDown = (e: React.MouseEvent) => {
        if (toolbarRef.current) {
            const rect = toolbarRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
            setIsDragging(true);
        }
    };

    // Handle resize start
    const handleResizeStart = (e: React.MouseEvent) => {
        e.stopPropagation();
        resizeStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            scale: customScale
        };
        setIsResizing(true);
    };

    // Handle drag
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging && toolbarRef.current) {
                const newX = e.clientX - dragOffset.x;
                const newY = e.clientY - dragOffset.y;

                const toolbarWidth = toolbarRef.current.offsetWidth;
                const toolbarHeight = toolbarRef.current.offsetHeight;

                const maxX = window.innerWidth - toolbarWidth;
                const maxY = window.innerHeight - toolbarHeight;

                setPosition({
                    x: Math.max(0, Math.min(newX, maxX)),
                    y: Math.max(0, Math.min(newY, maxY))
                });
            }

            if (isResizing) {
                const deltaX = e.clientX - resizeStartRef.current.x;
                const deltaY = e.clientY - resizeStartRef.current.y;
                const delta = Math.max(deltaX, deltaY);
                const newScale = Math.max(0.7, Math.min(1.5, resizeStartRef.current.scale + delta / 200));
                setCustomScale(newScale);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
        };

        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, dragOffset]);

    // Handle touch events
    const handleTouchStart = (e: React.TouchEvent) => {
        if (toolbarRef.current && e.touches.length === 1) {
            const touch = e.touches[0];
            const rect = toolbarRef.current.getBoundingClientRect();
            setDragOffset({
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top
            });
            setIsDragging(true);
        }
    };

    useEffect(() => {
        const handleTouchMove = (e: TouchEvent) => {
            if (isDragging && toolbarRef.current && e.touches.length === 1) {
                const touch = e.touches[0];
                const newX = touch.clientX - dragOffset.x;
                const newY = touch.clientY - dragOffset.y;

                const toolbarWidth = toolbarRef.current.offsetWidth;
                const toolbarHeight = toolbarRef.current.offsetHeight;

                const maxX = window.innerWidth - toolbarWidth;
                const maxY = window.innerHeight - toolbarHeight;

                setPosition({
                    x: Math.max(0, Math.min(newX, maxX)),
                    y: Math.max(0, Math.min(newY, maxY))
                });
            }
        };

        const handleTouchEnd = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', handleTouchEnd);
        }

        return () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging, dragOffset]);

    // Cycle through sizes when expanded
    const cycleSize = () => {
        const sizes: ToolbarSize[] = ['compact', 'normal', 'large'];
        const currentIndex = sizes.indexOf(toolbarSize);
        const nextIndex = (currentIndex + 1) % sizes.length;
        setToolbarSize(sizes[nextIndex]);
    };

    const getFlexDirection = () => {
        if (expandDirection === 'left' || expandDirection === 'right') return 'flex-col';
        return 'flex-row';
    };

    const getTransformOrigin = () => {
        switch (expandDirection) {
            case 'up': return 'bottom';
            case 'down': return 'top';
            case 'left': return 'right';
            case 'right': return 'left';
        }
    };

    // Render tool button
    const renderToolButton = (
        icon: React.ReactNode,
        label: string,
        descKey: string,
        onClick?: () => void,
        disabled: boolean = false,
        highlight: boolean = false,
        badge?: number
    ) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex flex-col items-center ${currentSize.padding} rounded-xl transition-all ${
                disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 hover:shadow-md'
            } ${highlight ? 'hover:bg-ivolve-bright/10' : ''}`}
            title={label}
            style={{ minWidth: toolbarSize === 'large' ? '90px' : 'auto' }}
        >
            <div
                className={`rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden ${
                    highlight ? 'bg-gradient-to-br from-ivolve-bright to-ivolve-mid' : ''
                }`}
                style={{
                    width: highlight ? scaledIconSize * 1.1 : scaledIconSize,
                    height: highlight ? scaledIconSize * 1.1 : scaledIconSize
                }}
            >
                {highlight && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" />
                )}
                {icon}
                {badge !== undefined && badge > 0 && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-ivolve-bright text-white text-[9px] rounded-full font-bold shadow">
                        {badge}
                    </span>
                )}
            </div>
            <span
                className={`font-semibold mt-1 text-center ${highlight ? 'text-ivolve-mid font-bold' : 'text-gray-600'}`}
                style={{ fontSize: currentSize.fontSize }}
            >
                {label}
            </span>
            {toolbarSize === 'large' && currentSize.showDesc && (
                <span className="text-[9px] text-gray-400 text-center mt-0.5 max-w-[80px] leading-tight">
                    {toolDescriptions[descKey]}
                </span>
            )}
        </button>
    );

    return (
        <div
            ref={toolbarRef}
            className={`fixed z-50 select-none transition-all duration-300 ${isDragging ? 'scale-105' : ''}`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                cursor: isDragging ? 'grabbing' : 'auto'
            }}
        >
            {/* Animated border container */}
            <div className="relative rounded-2xl tool-belt-container">
                {/* Rotating gradient border effect */}
                <div
                    className="absolute inset-0 rounded-2xl rotating-border"
                    style={{
                        padding: '2px',
                        background: 'linear-gradient(90deg, #008C67, #6BD052, #009EA5, #6BD052, #008C67)',
                        backgroundSize: '300% 100%',
                    }}
                >
                    <div className={`w-full h-full ${collapseState === 'icon' ? 'rounded-full' : 'rounded-xl'} ${collapseState === 'expanded' ? 'bg-white' : 'bg-ivolve-mid'}`} />
                </div>

                {/* Main toolbar content */}
                <div
                    className={`relative overflow-hidden shadow-2xl ${collapseState === 'icon' ? 'rounded-full bg-ivolve-mid' : collapseState === 'pill' ? 'rounded-xl bg-ivolve-mid' : 'rounded-xl bg-white'}`}
                    style={{ transformOrigin: getTransformOrigin() }}
                >
                    {collapseState === 'icon' ? (
                        /* Icon-only state - small circle */
                        <button
                            onClick={() => setCollapseState('pill')}
                            onMouseDown={handleMouseDown}
                            onTouchStart={handleTouchStart}
                            className="w-12 h-12 flex items-center justify-center cursor-grab active:cursor-grabbing hover:brightness-110 transition-all"
                            title="Tool Belt - Click to expand"
                        >
                            <Briefcase size={22} className="text-white" />
                        </button>
                    ) : collapseState === 'pill' ? (
                        /* Pill state - oblong with Tool Belt text */
                        <button
                            onClick={() => setCollapseState('expanded')}
                            onMouseDown={handleMouseDown}
                            onTouchStart={handleTouchStart}
                            className="flex items-center gap-2 px-4 py-2.5 cursor-grab active:cursor-grabbing hover:brightness-110 transition-all"
                        >
                            <Briefcase size={18} className="text-white" />
                            <span className="text-sm font-bold text-white whitespace-nowrap">Tool Belt</span>
                            <ChevronDown size={16} className="text-white/80" />
                        </button>
                    ) : (
                        /* Expanded state */
                        <>
                            {/* Header */}
                            <div
                                className="flex items-center justify-between px-3 py-2 bg-ivolve-mid cursor-grab active:cursor-grabbing"
                                onMouseDown={handleMouseDown}
                                onTouchStart={handleTouchStart}
                            >
                                <div className="flex items-center gap-2">
                                    <GripVertical size={14} className="text-white/70" />
                                    <Briefcase size={14} className="text-white" />
                                    <span className="text-xs font-bold text-white">Tool Belt</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {/* Size indicator */}
                                    <button
                                        onClick={cycleSize}
                                        className="px-2 py-0.5 text-[10px] text-white/70 hover:bg-white/20 rounded transition-colors"
                                        title="Change size"
                                    >
                                        {toolbarSize.charAt(0).toUpperCase() + toolbarSize.slice(1)}
                                    </button>
                                    <button
                                        onClick={() => setCollapseState('pill')}
                                        className="p-1 hover:bg-white/20 rounded transition-colors"
                                        title="Collapse to pill"
                                    >
                                        <ChevronDown size={14} className="text-white rotate-180" />
                                    </button>
                                    <button
                                        onClick={() => setCollapseState('icon')}
                                        className="p-1 hover:bg-white/20 rounded transition-colors"
                                        title="Minimize to icon"
                                    >
                                        <div className="w-3 h-3 rounded-full border-2 border-white/70" />
                                    </button>
                                </div>
                            </div>

                            {/* Tools grid */}
                            <div
                                className={`flex items-start ${currentSize.gap} ${currentSize.padding} bg-white ${getFlexDirection()} flex-wrap justify-center`}
                                style={{ transform: `scale(${customScale})`, transformOrigin: 'top left' }}
                            >
                                {/* Solas Support */}
                                {renderToolButton(
                                    <MessageCircle size={scaledIconStroke * 1.1} className="text-white" strokeWidth={2.5} fill="white" fillOpacity={0.2} />,
                                    'Solas Support',
                                    'support',
                                    onSupportClick,
                                    true,
                                    true
                                )}

                                {/* Report Repair */}
                                {renderToolButton(
                                    <div className="bg-gradient-to-br from-ivolve-mid to-ivolve-dark rounded-xl flex items-center justify-center" style={{ width: scaledIconSize, height: scaledIconSize }}>
                                        <Wrench size={scaledIconStroke} className="text-white" strokeWidth={2.5} />
                                    </div>,
                                    'Report Repair',
                                    'repair',
                                    onReportRepairClick,
                                    true
                                )}

                                {/* Documents */}
                                {renderToolButton(
                                    <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center" style={{ width: scaledIconSize, height: scaledIconSize }}>
                                        <FolderOpen size={scaledIconStroke} className="text-white" strokeWidth={2.5} />
                                    </div>,
                                    'Documents',
                                    'documents',
                                    onDocumentsClick,
                                    false,
                                    false,
                                    documentCount
                                )}

                                {/* Floor Plans */}
                                {renderToolButton(
                                    <div className={`rounded-xl flex items-center justify-center ${hasFloorPlan ? 'bg-gradient-to-br from-purple-500 to-purple-700' : 'bg-gradient-to-br from-ivolve-amber to-orange-500'}`} style={{ width: scaledIconSize, height: scaledIconSize }}>
                                        <Home size={scaledIconStroke} className="text-white" strokeWidth={2.5} />
                                    </div>,
                                    'Floor Plans',
                                    'floorPlans',
                                    onFloorPlanClick
                                )}

                                {/* Maps */}
                                {renderToolButton(
                                    <div className="bg-gradient-to-br from-emerald-500 to-teal-700 rounded-xl flex items-center justify-center" style={{ width: scaledIconSize, height: scaledIconSize }}>
                                        <MapPin size={scaledIconStroke} className="text-white" strokeWidth={2.5} />
                                    </div>,
                                    'Maps',
                                    'maps',
                                    onMapsClick,
                                    true
                                )}

                                {/* Activity Log */}
                                {renderToolButton(
                                    <div className="bg-gradient-to-br from-slate-500 to-slate-700 rounded-xl flex items-center justify-center" style={{ width: scaledIconSize, height: scaledIconSize }}>
                                        <History size={scaledIconStroke} className="text-white" strokeWidth={2.5} />
                                    </div>,
                                    'Activity Log',
                                    'activity',
                                    onActivityLogClick
                                )}
                            </div>

                            {/* Resize handle */}
                            <div
                                className="absolute bottom-1 right-1 w-4 h-4 cursor-se-resize opacity-50 hover:opacity-100 transition-opacity"
                                onMouseDown={handleResizeStart}
                                title="Drag to resize"
                            >
                                <svg viewBox="0 0 16 16" className="w-full h-full text-gray-400">
                                    <path fill="currentColor" d="M14 14H12V12H14V14ZM14 10H12V8H14V10ZM10 14H8V12H10V14ZM14 6H12V4H14V6ZM10 10H8V8H10V10ZM6 14H4V12H6V14Z" />
                                </svg>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* CSS for animated effects */}
            <style>{`
                .tool-belt-container {
                    filter: drop-shadow(0 0 8px rgba(0, 140, 103, 0.4));
                }

                .rotating-border {
                    animation: borderRotate 3s linear infinite, borderPulse 2s ease-in-out infinite;
                }

                @keyframes borderRotate {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 300% 50%; }
                }

                @keyframes borderPulse {
                    0%, 100% {
                        filter: drop-shadow(0 0 6px rgba(0, 140, 103, 0.5)) drop-shadow(0 0 15px rgba(107, 208, 82, 0.3));
                    }
                    50% {
                        filter: drop-shadow(0 0 10px rgba(0, 140, 103, 0.7)) drop-shadow(0 0 25px rgba(107, 208, 82, 0.5));
                    }
                }

                .tool-belt-container:hover .rotating-border {
                    animation: borderRotate 1.5s linear infinite, borderPulse 1s ease-in-out infinite;
                }

                .tool-belt-container:hover {
                    filter: drop-shadow(0 0 12px rgba(0, 140, 103, 0.5));
                }

                @keyframes shine {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }

                .animate-shine {
                    animation: shine 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default FloatingToolbar;
