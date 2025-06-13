import { ReactNode } from 'react';

declare module 'next-themes/dist/types' {
  export interface ThemeProviderProps {
    children: ReactNode;
    attribute?: string;
    defaultTheme?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
    forcedTheme?: string;
    storageKey?: string;
    themes?: string[];
  }
}