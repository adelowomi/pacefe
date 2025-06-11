import { useStore } from '@tanstack/react-store';
import { useEffect } from 'react';
import { AppStore } from '@/stores/app-store';

export function useDarkMode() {
  const isDarkMode = useStore(AppStore, (state) => state.isDarkMode);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    AppStore.setState((state) => ({
      ...state,
      isDarkMode: newDarkMode,
    }));
    
    // Persist to localStorage
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  const setDarkMode = (value: boolean) => {
    AppStore.setState((state) => ({
      ...state,
      isDarkMode: value,
    }));
    
    // Persist to localStorage
    localStorage.setItem('darkMode', JSON.stringify(value));
  };

  // Apply dark class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      const parsedDarkMode = JSON.parse(savedDarkMode);
      if (parsedDarkMode !== isDarkMode) {
        setDarkMode(parsedDarkMode);
      }
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark !== isDarkMode) {
        setDarkMode(prefersDark);
      }
    }
  }, []);

  return {
    isDarkMode,
    toggleDarkMode,
    setDarkMode,
  };
}
