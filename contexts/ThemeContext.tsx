
import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to light to prevent flash of unstyled content, will be corrected by useEffect
  const [theme, setTheme] = useState<Theme>('light'); 

  useEffect(() => {
    const root = window.document.documentElement;
    
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Prioritize saved theme, otherwise use system preference
    const initialTheme = savedTheme ?? (systemPrefersDark ? 'dark' : 'light');
    
    setTheme(initialTheme);
    root.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const handleSetTheme = (newTheme: Theme) => {
    const root = window.document.documentElement;
    localStorage.setItem('theme', newTheme);
    root.classList.toggle('dark', newTheme === 'dark');
    setTheme(newTheme);
  };

  const value = useMemo(() => ({ theme, setTheme: handleSetTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
