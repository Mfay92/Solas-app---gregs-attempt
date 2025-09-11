import React, { createContext, useState, useMemo, useContext, ReactNode } from 'react';

type Theme = 'default' | 'festive' | 'spooky' | 'summer' | 'spring';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STYLES = {
  default: {
    '--app-bg': '#FFF6F1', // Off-White from brand guide
    '--app-sidebar': '#008C67', // Mid Green from brand guide
    '--app-sidebar-text': '#e5e7eb',
    '--app-sidebar-text-hover': '#ffffff',
    '--app-sidebar-active': '#025A40', // Dark Green from brand guide
    '--app-header': '#008C67', // Mid Green from brand guide
    '--app-header-text': '#ffffff',
    '--app-card-bg': '#ffffff',
    '--app-text-dark': '#1f2937',
    '--app-text-gray': '#4b5563',
  },
  festive: {
    '--app-bg': '#fef2f2',
    '--app-sidebar': '#881337',
    '--app-sidebar-text': '#fecaca',
    '--app-sidebar-text-hover': '#ffffff',
    '--app-sidebar-active': '#166534',
    '--app-header': '#b91c1c',
    '--app-header-text': '#ffffff',
    '--app-card-bg': '#ffffff',
    '--app-text-dark': '#450a0a',
    '--app-text-gray': '#7f1d1d',
  },
  spooky: {
    '--app-bg': '#1e1b4b',
    '--app-sidebar': '#171717',
    '--app-sidebar-text': '#a3a3a3',
    '--app-sidebar-text-hover': '#ffffff',
    '--app-sidebar-active': '#ea580c',
    '--app-header': '#4a044e',
    '--app-header-text': '#f0abfc',
    '--app-card-bg': '#262626',
    '--app-text-dark': '#f5f5f5',
    '--app-text-gray': '#d4d4d4',
  },
  summer: {
    '--app-bg': '#fffbeb',
    '--app-sidebar': '#06b6d4',
    '--app-sidebar-text': '#cffafe',
    '--app-sidebar-text-hover': '#ffffff',
    '--app-sidebar-active': '#f59e0b',
    '--app-header': '#f97316',
    '--app-header-text': '#ffffff',
    '--app-card-bg': '#ffffff',
    '--app-text-dark': '#78350f',
    '--app-text-gray': '#b45309',
  },
  spring: {
      '--app-bg': '#f0fdf4',
      '--app-sidebar': '#ec4899',
      '--app-sidebar-text': '#fce7f3',
      '--app-sidebar-text-hover': '#ffffff',
      '--app-sidebar-active': '#4d7c0f',
      '--app-header': '#a3e635',
      '--app-header-text': '#1a2e05',
      '--app-card-bg': '#ffffff',
      '--app-text-dark': '#365314',
      '--app-text-gray': '#555555',
  }
};


export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('default');

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  React.useEffect(() => {
    const root = window.document.documentElement;
    const styles = THEME_STYLES[theme];
    
    Object.entries(styles).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }, [theme]);


  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
