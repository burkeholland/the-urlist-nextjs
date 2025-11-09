'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    if (!isInitialized) {
      const savedTheme = localStorage.getItem('preferredTheme') as Theme | null;
      const initialTheme = savedTheme || 'system';
      
      setThemeState(initialTheme);
      applyTheme(initialTheme);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const applyTheme = (newTheme: Theme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('preferredTheme', newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  return context;
}
