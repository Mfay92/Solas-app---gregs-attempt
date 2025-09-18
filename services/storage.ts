import { Property, Stakeholder, IvolveStaff, PpmSchedule, Person, TagStyle, CustomWidget, GrowthOpportunity, DrawerMode } from '../types';

const STORAGE_KEY = 'ivolveAppState';
const VIEW_SETTINGS_KEY = 'ivolvePropertiesViewSettings';
const UI_SETTINGS_KEY = 'ivolveUISettings';
const MINI_STATS_KEY = 'ivolveMiniStatsSettings';
const DASHBOARD_SETTINGS_KEY = 'ivolveDashboardSettings';
const CUSTOM_WIDGETS_KEY = 'ivolveCustomWidgets';


// Note: Pinned IDs are stored as an array because Sets are not JSON-serializable.
export interface AppState {
    properties: Property[];
    stakeholders: Stakeholder[];
    ivolveStaff: IvolveStaff[];
    ppmSchedules: PpmSchedule[];
    people: Person[];
    growthOpportunities: GrowthOpportunity[];
    pinnedContactIds: string[];
}

export interface PropertiesViewSettings {
    visibleColumns: Record<string, boolean>;
    highlightToggles: Record<string, boolean>;
    tagStyle?: TagStyle;
    columnOrder?: string[];
    viewMode?: 'table' | 'deck' | 'collapsible';
    toggles?: Record<string, boolean>;
}

export interface UISettings {
    drawerMode: DrawerMode;
}

export interface MiniStatsSettings {
    selectedBadges: string[];
}

export interface DashboardSettings {
    visibleWidgetIds: string[];
}


/**
 * Saves the entire application state to localStorage.
 * @param state The application state to save.
 */
export const saveState = (state: AppState): void => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(STORAGE_KEY, serializedState);
    } catch (error) {
        console.warn("Could not save state to localStorage", error);
    }
};

/**
 * Loads the application state from localStorage.
 * @returns The parsed state object, or null if nothing is saved or an error occurs.
 */
export const loadState = (): AppState | null => {
    try {
        const serializedState = localStorage.getItem(STORAGE_KEY);
        if (serializedState === null) {
            return null; // No state saved
        }
        return JSON.parse(serializedState);
    } catch (error) {
        console.warn("Could not load state from localStorage", error);
        return null;
    }
};

/**
 * Clears all application state from localStorage.
 */
export const clearState = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(VIEW_SETTINGS_KEY); // Also clear view settings
        localStorage.removeItem(UI_SETTINGS_KEY); // Also clear UI settings
        localStorage.removeItem(MINI_STATS_KEY); // Also clear mini stats settings
        localStorage.removeItem(DASHBOARD_SETTINGS_KEY); // Also clear dashboard settings
        localStorage.removeItem(CUSTOM_WIDGETS_KEY); // Also clear custom widgets
    } catch (error) {
        console.warn("Could not clear state from localStorage", error);
    }
};

/**
 * Saves the Properties View settings to localStorage.
 * @param settings The view settings to save.
 */
export const savePropertiesViewSettings = (settings: PropertiesViewSettings): void => {
    try {
        localStorage.setItem(VIEW_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
        console.warn("Could not save properties view settings", error);
    }
};

/**
 * Loads the Properties View settings from localStorage.
 * @returns The parsed settings object, or null if nothing is saved or an error occurs.
 */
export const loadPropertiesViewSettings = (): PropertiesViewSettings | null => {
    try {
        const saved = localStorage.getItem(VIEW_SETTINGS_KEY);
        if (saved === null) {
            return null;
        }
        return JSON.parse(saved);
    } catch (error) {
        console.warn("Could not load properties view settings", error);
        return null;
    }
};

/**
 * Clears the Properties View settings from localStorage.
 */
export const clearPropertiesViewSettings = (): void => {
    try {
        localStorage.removeItem(VIEW_SETTINGS_KEY);
    } catch (error) {
        console.warn("Could not clear properties view settings", error);
    }
};

/**
 * Saves the UI settings to localStorage.
 * @param settings The UI settings to save.
 */
export const saveUISettings = (settings: UISettings): void => {
    try {
        localStorage.setItem(UI_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
        console.warn("Could not save UI settings", error);
    }
};

/**
 * Loads the UI settings from localStorage.
 * @returns The parsed settings object, or null if nothing is saved or an error occurs.
 */
export const loadUISettings = (): UISettings | null => {
    try {
        const saved = localStorage.getItem(UI_SETTINGS_KEY);
        if (saved === null) {
            return null;
        }
        return JSON.parse(saved);
    } catch (error) {
        console.warn("Could not load UI settings", error);
        return null;
    }
};

/**
 * Saves the Mini Stats settings to localStorage.
 * @param settings The mini stats settings to save.
 */
export const saveMiniStatsSettings = (settings: MiniStatsSettings): void => {
    try {
        localStorage.setItem(MINI_STATS_KEY, JSON.stringify(settings));
    } catch (error) {
        console.warn("Could not save mini stats settings", error);
    }
};

/**
 * Loads the Mini Stats settings from localStorage.
 * @returns The parsed settings object, or null if nothing is saved or an error occurs.
 */
export const loadMiniStatsSettings = (): MiniStatsSettings | null => {
    try {
        const saved = localStorage.getItem(MINI_STATS_KEY);
        if (saved === null) {
            return null;
        }
        return JSON.parse(saved);
    } catch (error) {
        console.warn("Could not load mini stats settings", error);
        return null;
    }
};

/**
 * Saves the Dashboard settings to localStorage.
 * @param settings The dashboard settings to save.
 */
export const saveDashboardSettings = (settings: DashboardSettings): void => {
    try {
        localStorage.setItem(DASHBOARD_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
        console.warn("Could not save dashboard settings", error);
    }
};

/**
 * Loads the Dashboard settings from localStorage.
 * @returns The parsed settings object, or null if nothing is saved or an error occurs.
 */
export const loadDashboardSettings = (): DashboardSettings | null => {
    try {
        const saved = localStorage.getItem(DASHBOARD_SETTINGS_KEY);
        if (saved === null) {
            return null;
        }
        return JSON.parse(saved);
    } catch (error) {
        console.warn("Could not load dashboard settings", error);
        return null;
    }
};

/**
 * Saves custom report widgets to localStorage.
 * @param widgets The array of custom widgets to save.
 */
export const saveCustomWidgets = (widgets: CustomWidget[]): void => {
    try {
        localStorage.setItem(CUSTOM_WIDGETS_KEY, JSON.stringify(widgets));
    } catch (error) {
        console.warn("Could not save custom widgets", error);
    }
};

/**
 * Loads custom report widgets from localStorage.
 * @returns The array of custom widgets, or an empty array if none are found.
 */
export const loadCustomWidgets = (): CustomWidget[] => {
    try {
        const saved = localStorage.getItem(CUSTOM_WIDGETS_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.warn("Could not load custom widgets", error);
        return [];
    }
};