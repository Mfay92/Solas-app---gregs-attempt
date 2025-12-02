import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider, Layout, Layouts } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Layout as LayoutIcon, ArrowLeft, X, Package } from 'lucide-react';
import { WidgetWrapper } from './WidgetWrapper';
import { WidgetCentre } from './WidgetCentre';
import { DashboardHeader } from './DashboardHeader';
import { useToast } from '../ToastProvider';
import { DashboardItem, WidgetData } from './types';
import { BatteryWidget } from './Widgets/BatteryWidget';
import { NumbersWidget } from './Widgets/NumbersWidget';
import { ChartWidget } from './Widgets/ChartWidget';
import { FilesGalleryWidget } from './Widgets/FilesGalleryWidget';

const STORAGE_KEY = 'solas-dashboard-layout';
const STORAGE_KEY_DOCKED = 'solas-dashboard-docked';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Custom styles to override react-grid-layout placeholder
const gridStyles = `
  .react-grid-placeholder {
    background: rgba(0, 140, 103, 0.1) !important; /* ivolve-mid with opacity */
    border-radius: 12px !important;
    opacity: 0.5 !important;
  }
`;

// Widget type constraints - min/max sizes per type
const WIDGET_CONSTRAINTS: Record<WidgetData['type'], { minW: number; minH: number; maxW: number; maxH: number }> = {
    battery: { minW: 2, minH: 3, maxW: 6, maxH: 6 },      // Simple status - keep compact
    numbers: { minW: 2, minH: 3, maxW: 6, maxH: 5 },      // KPI numbers - compact
    chart: { minW: 3, minH: 4, maxW: 12, maxH: 10 },      // Charts need more space
    files: { minW: 3, minH: 3, maxW: 12, maxH: 8 },       // File list - flexible
    text: { minW: 2, minH: 2, maxW: 8, maxH: 6 },         // Text widgets - flexible
};

// Default layout configuration for different breakpoints
const defaultLayouts: Layouts = {
    lg: [ // 12 cols, >= 1200px
        { i: '1', x: 0, y: 0, w: 4, h: 4, ...WIDGET_CONSTRAINTS.battery },
        { i: '2', x: 4, y: 0, w: 4, h: 4, ...WIDGET_CONSTRAINTS.numbers },
        { i: '3', x: 8, y: 0, w: 4, h: 7, ...WIDGET_CONSTRAINTS.chart },
        { i: '4', x: 0, y: 4, w: 8, h: 5, ...WIDGET_CONSTRAINTS.files },
    ],
    md: [ // 10 cols, >= 996px
        { i: '1', x: 0, y: 0, w: 5, h: 4, ...WIDGET_CONSTRAINTS.battery },
        { i: '2', x: 5, y: 0, w: 5, h: 4, ...WIDGET_CONSTRAINTS.numbers },
        { i: '3', x: 0, y: 4, w: 5, h: 6, ...WIDGET_CONSTRAINTS.chart },
        { i: '4', x: 5, y: 4, w: 5, h: 5, ...WIDGET_CONSTRAINTS.files },
    ],
    sm: [ // 6 cols, >= 768px
        { i: '1', x: 0, y: 0, w: 3, h: 4, ...WIDGET_CONSTRAINTS.battery },
        { i: '2', x: 3, y: 0, w: 3, h: 4, ...WIDGET_CONSTRAINTS.numbers },
        { i: '3', x: 0, y: 4, w: 6, h: 5, ...WIDGET_CONSTRAINTS.chart },
        { i: '4', x: 0, y: 9, w: 6, h: 4, ...WIDGET_CONSTRAINTS.files },
    ],
    xs: [ // 4 cols, >= 480px
        { i: '1', x: 0, y: 0, w: 4, h: 4, ...WIDGET_CONSTRAINTS.battery },
        { i: '2', x: 0, y: 4, w: 4, h: 4, ...WIDGET_CONSTRAINTS.numbers },
        { i: '3', x: 0, y: 8, w: 4, h: 5, ...WIDGET_CONSTRAINTS.chart },
        { i: '4', x: 0, y: 13, w: 4, h: 4, ...WIDGET_CONSTRAINTS.files },
    ],
    xxs: [ // 2 cols, < 480px
        { i: '1', x: 0, y: 0, w: 2, h: 4, ...WIDGET_CONSTRAINTS.battery },
        { i: '2', x: 0, y: 4, w: 2, h: 4, ...WIDGET_CONSTRAINTS.numbers },
        { i: '3', x: 0, y: 8, w: 2, h: 5, ...WIDGET_CONSTRAINTS.chart },
        { i: '4', x: 0, y: 13, w: 2, h: 4, ...WIDGET_CONSTRAINTS.files },
    ],
};

export const DashboardLayout: React.FC = () => {
    const [items, setItems] = useState<DashboardItem[]>([
        { id: '1', type: 'battery', title: 'Project Status', x: 0, y: 0, w: 4, h: 4, ...WIDGET_CONSTRAINTS.battery, locked: false },
        { id: '2', type: 'numbers', title: 'Total Revenue', x: 4, y: 0, w: 4, h: 4, ...WIDGET_CONSTRAINTS.numbers, locked: false },
        { id: '3', type: 'chart', title: 'Monthly Performance', x: 8, y: 0, w: 4, h: 7, ...WIDGET_CONSTRAINTS.chart, locked: false },
        { id: '4', type: 'files', title: 'Recent Documents', x: 0, y: 4, w: 8, h: 5, ...WIDGET_CONSTRAINTS.files, locked: false },
    ]);

    const [dockedItems, setDockedItems] = useState<DashboardItem[]>([]);
    const [isWidgetCentreOpen, setIsWidgetCentreOpen] = useState(false);
    const [isStorageOpen, setIsStorageOpen] = useState(false);
    const [layouts, setLayouts] = useState<Layouts>(defaultLayouts);

    // Load saved layout on mount
    useEffect(() => {
        const savedItems = localStorage.getItem(STORAGE_KEY);
        const savedDocked = localStorage.getItem(STORAGE_KEY_DOCKED);

        if (savedItems) {
            try {
                setItems(JSON.parse(savedItems));
            } catch (e) {
                console.error('Failed to load dashboard layout:', e);
            }
        }

        if (savedDocked) {
            try {
                setDockedItems(JSON.parse(savedDocked));
            } catch (e) {
                console.error('Failed to load docked items:', e);
            }
        }
    }, []);

    // Save layout when items change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    // Save docked items when they change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_DOCKED, JSON.stringify(dockedItems));
    }, [dockedItems]);

    const [isDragging, setIsDragging] = useState(false);

    const { showToast } = useToast();

    // Sync locked state with grid layout 'static' property
    useEffect(() => {
        const newLayouts = { ...layouts };
        let hasChanges = false;

        (Object.keys(newLayouts) as Array<keyof typeof newLayouts>).forEach(breakpoint => {
            newLayouts[breakpoint] = newLayouts[breakpoint].map((layoutItem: Layout) => {
                const widgetItem = items.find(i => i.id === layoutItem.i);
                if (widgetItem && layoutItem.static !== widgetItem.locked) {
                    hasChanges = true;
                    return { ...layoutItem, static: widgetItem.locked };
                }
                return layoutItem;
            });
        });

        if (hasChanges) {
            setLayouts(newLayouts);
        }
    }, [items, layouts]);


    const handleAddWidget = (type: WidgetData['type']) => {
        const constraints = WIDGET_CONSTRAINTS[type] || { minW: 2, minH: 3, maxW: 6, maxH: 6 };
        const newItem: DashboardItem = {
            id: Date.now().toString(),
            type,
            title: type.charAt(0).toUpperCase() + type.slice(1),
            x: 0,
            y: Infinity,
            w: Math.max(4, constraints.minW), // Start at reasonable size
            h: Math.max(4, constraints.minH),
            ...constraints,
            locked: false
        };
        setItems([...items, newItem]);
    };

    const handleRemoveWidget = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleToggleLock = (id: string) => {
        setItems(items.map(item => {
            if (item.id === id) {
                const newLockedState = !item.locked;
                showToast(newLockedState ? "Widget Locked" : "Widget Unlocked", "success");
                return { ...item, locked: newLockedState };
            }
            return item;
        }));
    };

    const handleMinimize = (id: string) => {
        const itemToDock = items.find(item => item.id === id);
        if (itemToDock) {
            setDockedItems([...dockedItems, itemToDock]);
            setItems(items.filter(item => item.id !== id));
            showToast("Widget moved to storage", "info");
            setIsStorageOpen(true); // Open storage to show where it went
        }
    };

    const handleRestoreFromDock = (id: string) => {
        const itemToRestore = dockedItems.find(item => item.id === id);
        if (itemToRestore) {
            setItems([...items, { ...itemToRestore, x: 0, y: Infinity }]); // Add back to bottom
            setDockedItems(dockedItems.filter(item => item.id !== id));
            showToast("Widget restored to dashboard", "success");
        }
    };

    // Drag Handlers
    const onDragStart = () => {
        setIsDragging(true);
    };

    const onDrag = (_layout: Layout[], _oldItem: Layout, _newItem: Layout, _placeholder: Layout, e: MouseEvent, _element: HTMLElement) => {
        // Auto-open storage if dragging near right edge (approx 300px)
        if (e.clientX > window.innerWidth - 300) {
            if (!isStorageOpen) setIsStorageOpen(true);
        }
    };

    const onDragStop = (_layout: Layout[], _oldItem: Layout, newItem: Layout, _placeholder: Layout, e: MouseEvent, _element: HTMLElement) => {
        setIsDragging(false);
        // If dropped in storage area
        if (e.clientX > window.innerWidth - 320 && isStorageOpen) {
            handleMinimize(newItem.i);
        }
    };

    const renderWidgetContent = (item: DashboardItem) => {
        switch (item.type) {
            case 'battery': return <BatteryWidget w={item.w} h={item.h} />;
            case 'numbers': return <NumbersWidget w={item.w} h={item.h} />;
            case 'chart': return <ChartWidget w={item.w} h={item.h} />;
            case 'files': return <FilesGalleryWidget w={item.w} h={item.h} />;
            default: return <div className="p-4">Unknown Widget</div>;
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
            <style>{gridStyles}</style>

            {/* New Header */}
            <DashboardHeader
                onAddWidget={() => setIsWidgetCentreOpen(true)}
                onToggleStorage={() => setIsStorageOpen(!isStorageOpen)}
            />

            <div className="flex flex-1 overflow-hidden relative">
                {/* Main Content Area */}
                <div className="flex-1 p-4 pt-4 overflow-y-auto">
                    <div className="max-w-[1600px] mx-auto">

                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 border-2 border-dashed border-slate-300 rounded-2xl bg-ivolve-paper/50">
                                <div className="w-16 h-16 bg-ivolve-paper rounded-full flex items-center justify-center mb-3 border border-slate-200">
                                    <LayoutIcon size={32} className="text-slate-400" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-600">Start Building Your Dashboard</h3>
                                <p className="text-slate-500 mt-1 max-w-md text-center text-sm">
                                    Click "Add Widget" to customize your workspace.
                                </p>
                            </div>
                        ) : (
                            <ResponsiveGridLayout
                                className="layout"
                                layouts={layouts}
                                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                                rowHeight={50}
                                draggableHandle=".drag-handle"
                                onLayoutChange={(_currentLayout, allLayouts) => setLayouts(allLayouts)}
                                onDragStart={onDragStart}
                                onDrag={onDrag}
                                onDragStop={onDragStop}
                                margin={[16, 16]}
                            >
                                {items.map((item) => (
                                    <div key={item.id} className={item.locked ? "static-widget" : ""}>
                                        <WidgetWrapper
                                            title={item.title}
                                            onRemove={() => handleRemoveWidget(item.id)}
                                            isLocked={item.locked}
                                            onToggleLock={() => handleToggleLock(item.id)}
                                            onMinimize={() => handleMinimize(item.id)}
                                        >
                                            {renderWidgetContent(item)}
                                        </WidgetWrapper>
                                    </div>
                                ))}
                            </ResponsiveGridLayout>
                        )}
                    </div>
                </div>

                {/* Storage Drawer Overlay (Slides out from right) */}
                <div
                    className={`absolute top-0 right-0 bottom-0 w-72 bg-ivolve-paper shadow-2xl transform transition-transform duration-300 ease-in-out z-40 flex flex-col border-l border-slate-200 ${isStorageOpen ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    <div className="px-3 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between">
                        <h2 className="font-bold text-sm flex items-center gap-2 text-slate-700">
                            <LayoutIcon size={16} className="text-ivolve-mid" />
                            Storage
                        </h2>
                        <button
                            onClick={() => setIsStorageOpen(false)}
                            className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2 flex flex-col">
                        {isDragging ? (
                            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-ivolve-mid m-4 rounded-xl bg-green-50/50 animate-pulse">
                                <div className="text-center text-ivolve-mid">
                                    <Package size={48} className="mx-auto mb-2" />
                                    <p className="font-bold">Drop to Store</p>
                                </div>
                            </div>
                        ) : dockedItems.length === 0 ? (
                            <div className="text-center py-8 text-slate-400">
                                <Package size={24} className="mx-auto mb-2 opacity-50" />
                                <p className="text-xs">Storage is empty</p>
                            </div>
                        ) : (
                            dockedItems.map((item) => (
                                <div key={item.id} className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-slate-700 truncate text-sm">{item.title}</span>
                                        <button
                                            onClick={() => handleRestoreFromDock(item.id)}
                                            className="p-1 text-slate-400 hover:text-ivolve-mid hover:bg-green-50 rounded-full transition-colors"
                                            title="Restore to Dashboard"
                                        >
                                            <ArrowLeft size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <WidgetCentre
                isOpen={isWidgetCentreOpen}
                onClose={() => setIsWidgetCentreOpen(false)}
                onAddWidget={handleAddWidget}
            />
        </div>
    );
};
