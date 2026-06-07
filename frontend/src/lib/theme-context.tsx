'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeName = 'Light' | 'Dark' | 'Midnight Blue' | 'Emerald Green' | 'Royal Purple' | 'Sunset Orange' | 'Rose Gold' | 'Ocean Breeze';
export type Density = 'Compact' | 'Comfortable';
export type FontSize = 'Small' | 'Medium' | 'Large';

interface ThemeState {
  theme: ThemeName;
  mode: 'light' | 'dark';
  animations: boolean;
  fontSize: FontSize;
  density: Density;
}

interface ThemeContextType extends ThemeState {
  setTheme: (theme: ThemeName) => void;
  setMode: (mode: 'light' | 'dark') => void;
  setAnimations: (animations: boolean) => void;
  setFontSize: (fontSize: FontSize) => void;
  setDensity: (density: Density) => void;
}

const defaultState: ThemeState = {
  theme: 'Dark',
  mode: 'dark',
  animations: true,
  fontSize: 'Medium',
  density: 'Comfortable',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ThemeState>(defaultState);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('designai-theme');
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {}
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('designai-theme', JSON.stringify(state));
    
    const root = document.documentElement;
    root.dataset.theme = state.theme.toLowerCase().replace(/\s+/g, '-');
    root.dataset.mode = state.mode;
    root.dataset.animations = state.animations ? 'on' : 'off';
    root.dataset.fontSize = state.fontSize.toLowerCase();
    root.dataset.density = state.density.toLowerCase();
  }, [state, mounted]);

  // Always return the provider to avoid SSR crashes and hydration mismatches.
  // The state will update on the client after mounting.

  return (
    <ThemeContext.Provider value={{
      ...state,
      setTheme: (t) => setState(s => ({ ...s, theme: t })),
      setMode: (m) => setState(s => ({ ...s, mode: m })),
      setAnimations: (a) => setState(s => ({ ...s, animations: a })),
      setFontSize: (f) => setState(s => ({ ...s, fontSize: f })),
      setDensity: (d) => setState(s => ({ ...s, density: d })),
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
