import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { DocumentViewerState, DocumentViewerContextValue, ViewMode } from './types';

const initialState: DocumentViewerState = {
  viewMode: 'normal',
  expandedSections: new Set(['coreRent', 'eligibleServiceCharges', 'ineligibleServices']),
  expandedItems: new Set(),
  activeTooltip: null,
  showFilter: 'all',
};

const DocumentViewerContext = createContext<DocumentViewerContextValue | undefined>(undefined);

interface DocumentViewerProviderProps {
  children: ReactNode;
  defaultViewMode?: ViewMode;
  defaultExpandedSections?: string[];
}

export function DocumentViewerProvider({
  children,
  defaultViewMode = 'normal',
  defaultExpandedSections = ['coreRent', 'eligibleServiceCharges', 'ineligibleServices'],
}: DocumentViewerProviderProps) {
  const [state, setState] = useState<DocumentViewerState>({
    ...initialState,
    viewMode: defaultViewMode,
    expandedSections: new Set(defaultExpandedSections),
  });

  const setViewMode = useCallback((mode: ViewMode) => {
    setState((prev) => ({ ...prev, viewMode: mode }));
  }, []);

  const toggleSection = useCallback((sectionId: string) => {
    setState((prev) => {
      const newExpanded = new Set(prev.expandedSections);
      if (newExpanded.has(sectionId)) {
        newExpanded.delete(sectionId);
      } else {
        newExpanded.add(sectionId);
      }
      return { ...prev, expandedSections: newExpanded };
    });
  }, []);

  const toggleItem = useCallback((itemId: string) => {
    setState((prev) => {
      const newExpanded = new Set(prev.expandedItems);
      if (newExpanded.has(itemId)) {
        newExpanded.delete(itemId);
      } else {
        newExpanded.add(itemId);
      }
      return { ...prev, expandedItems: newExpanded };
    });
  }, []);

  const setActiveTooltip = useCallback((itemId: string | null) => {
    setState((prev) => ({ ...prev, activeTooltip: itemId }));
  }, []);

  const setShowFilter = useCallback((filter: 'all' | 'core' | 'bills') => {
    setState((prev) => ({ ...prev, showFilter: filter }));
  }, []);

  const value = useMemo<DocumentViewerContextValue>(
    () => ({
      state,
      setViewMode,
      toggleSection,
      toggleItem,
      setActiveTooltip,
      setShowFilter,
      isEasyRead: state.viewMode === 'easyRead',
      isComparison: state.viewMode === 'comparison',
    }),
    [state, setViewMode, toggleSection, toggleItem, setActiveTooltip, setShowFilter]
  );

  return (
    <DocumentViewerContext.Provider value={value}>
      {children}
    </DocumentViewerContext.Provider>
  );
}

export function useDocumentViewer(): DocumentViewerContextValue {
  const context = useContext(DocumentViewerContext);
  if (!context) {
    throw new Error('useDocumentViewer must be used within a DocumentViewerProvider');
  }
  return context;
}

export default DocumentViewerContext;
