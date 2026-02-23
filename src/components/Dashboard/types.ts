export interface WidgetData {
    id: string;
    type: 'battery' | 'numbers' | 'chart' | 'files' | 'text';
    title: string;
    settings?: Record<string, any>;
}


export interface DashboardItem extends WidgetData {
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
    locked: boolean;
}
