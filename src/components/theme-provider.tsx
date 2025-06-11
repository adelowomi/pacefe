import React from 'react';
import { useDarkMode } from '@/hooks/useDarkMode';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  useDarkMode();

  // This component just ensures the dark mode hook is initialized
  // The actual theme application happens in the hook
  return <>{children}</>;
}
