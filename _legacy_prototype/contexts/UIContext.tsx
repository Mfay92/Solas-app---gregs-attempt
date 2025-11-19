import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import * as storage from '../services/storage';
import { PropertyFilters, DrawerMode } from '../types';

interface UIState {
  activeMainView: string;
  selectedPropertyId: string | null;
  selectedUnitId: string | null;
  selectedStakeholderId: string | null;
  selectedIvolveContactId: string | null;
  selectedStakeholderContact: { stakeholderId: string; contactId: string } | null;
  selectedPersonId: string | null;
  drawerMode: DrawerMode;
  activeDrawer: 'property' | 'person' | null;
  propertyFilters: PropertyFilters | null;
  popupPosition: { x: number; y: number };
  isPopupMinimized: boolean;
}

interface UIContextActions {
  setActiveMainView: (view: string) => void;
  selectProperty: (id: string, unitId: string, overlay?: boolean) => void;
  selectStakeholder: (id: string) => void;
  selectIvolveContact: (id: string) => void;
  selectStakeholderContact: (stakeholderId: string, contactId: string) => void;
  selectPerson: (id: string, overlay?: boolean) => void;
  closeAllDrawers: () => void;
  setDrawerMode: (mode: DrawerMode) => void;
  unselectPerson: () => void;
  unselectProperty: () => void;
  applyPropertyFilters: (filters: PropertyFilters) => void;
  clearPropertyFilters: () => void;
  setPopupPosition: (position: { x: number; y: number }) => void;
  setPopupMinimized: (minimized: boolean) => void;
}

type UIContextType = UIState & UIContextActions;

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<UIState>(() => {
    const savedSettings = storage.loadUISettings();
    return {
      activeMainView: 'Dashboard',
      selectedPropertyId: null,
      selectedUnitId: null,
      selectedStakeholderId: null,
      selectedIvolveContactId: null,
      selectedStakeholderContact: null,
      selectedPersonId: null,
      drawerMode: savedSettings ? savedSettings.drawerMode : 'right', // Load initial state here
      activeDrawer: null,
      propertyFilters: null,
      popupPosition: { x: window.innerWidth / 4, y: 50 },
      isPopupMinimized: false,
    };
  });

  // Save drawerMode setting on change
  useEffect(() => {
    storage.saveUISettings({ drawerMode: state.drawerMode });
  }, [state.drawerMode]);


  const actions = useMemo(() => {
    const clearDrawers = () => ({
        selectedPropertyId: null,
        selectedUnitId: null,
        selectedStakeholderId: null,
        selectedIvolveContactId: null,
        selectedStakeholderContact: null,
        selectedPersonId: null,
        activeDrawer: null,
        isPopupMinimized: false,
    });
    
    return {
      setActiveMainView: (view: string) => setState(s => ({ ...s, activeMainView: view })),
      selectProperty: (id: string, unitId: string, overlay = false) => setState(s => ({
          ...(overlay ? s : { ...s, ...clearDrawers() }),
          selectedPropertyId: id,
          selectedUnitId: unitId,
          activeDrawer: 'property'
      })),
      selectStakeholder: (id: string) => setState(s => ({ ...s, ...clearDrawers(), selectedStakeholderId: id })),
      selectIvolveContact: (id: string) => setState(s => ({ ...s, ...clearDrawers(), selectedIvolveContactId: id })),
      selectStakeholderContact: (stakeholderId: string, contactId: string) => setState(s => ({ ...s, ...clearDrawers(), selectedStakeholderContact: { stakeholderId, contactId } })),
      selectPerson: (id: string, overlay = false) => setState(s => ({
          ...(overlay ? s : { ...s, ...clearDrawers() }),
          selectedPersonId: id,
          activeDrawer: 'person',
          isPopupMinimized: false,
      })),
      closeAllDrawers: () => setState(s => ({ ...s, ...clearDrawers() })),
      setDrawerMode: (mode: DrawerMode) => setState(s => ({ ...s, drawerMode: mode })),
      unselectPerson: () => setState(s => ({ ...s, selectedPersonId: null, activeDrawer: s.selectedPropertyId ? 'property' : null })),
      unselectProperty: () => setState(s => ({ ...s, selectedPropertyId: null, selectedUnitId: null, activeDrawer: s.selectedPersonId ? 'person' : null })),
      applyPropertyFilters: (filters: PropertyFilters) => setState(s => ({
          ...s,
          ...clearDrawers(),
          propertyFilters: filters,
          activeMainView: 'Properties',
      })),
      clearPropertyFilters: () => setState(s => ({ ...s, propertyFilters: null })),
      setPopupPosition: (position: { x: number; y: number }) => setState(s => ({ ...s, popupPosition: position })),
      setPopupMinimized: (minimized: boolean) => setState(s => ({ ...s, isPopupMinimized: minimized })),
    }
  }, []);

  const value: UIContextType = {
    ...state,
    ...actions,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};