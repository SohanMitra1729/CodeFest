
import React, { createContext, ReactNode } from 'react';

interface ThemeContextType {
  currentAccent: string;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Fixed accent color - no theme switching
  const currentAccent = '#E23C60'; // Myntra-inspired pink

  return (
    <ThemeContext.Provider value={{ currentAccent }}>
      {children}
    </ThemeContext.Provider>
  );
};
