import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';
import { ThemeMode } from './types/idea';

export interface AppColors {
  background: string;
  surface: string;
  card: string;
  border: string;
  text: string;
  mutedText: string;
  primary: string;
  accent: string;
}

const lightColors: AppColors = {
  background: '#f8fafc',
  surface: '#ffffff',
  card: '#ffffff',
  border: '#e2e8f0',
  text: '#0f172a',
  mutedText: '#475569',
  primary: '#0f766e',
  accent: '#fb923c',
};

const darkColors: AppColors = {
  background: '#020617',
  surface: '#111827',
  card: '#1f2937',
  border: '#334155',
  text: '#f8fafc',
  mutedText: '#cbd5e1',
  primary: '#14b8a6',
  accent: '#f59e0b',
};

export function getColors(themeMode: ThemeMode): AppColors {
  return themeMode === 'dark' ? darkColors : lightColors;
}

export function getNavigationTheme(themeMode: ThemeMode): Theme {
  const colors = getColors(themeMode);
  const base = themeMode === 'dark' ? DarkTheme : DefaultTheme;

  return {
    ...base,
    dark: themeMode === 'dark',
    colors: {
      ...base.colors,
      background: colors.background,
      border: colors.border,
      card: colors.surface,
      primary: colors.primary,
      text: colors.text,
      notification: colors.accent,
    },
  };
}
