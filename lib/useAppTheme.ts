import { useColorScheme } from 'react-native';

import { darkTheme, lightTheme, type AppTheme } from '@/constants/theme';
import { useAppStore } from '@/lib/store';

export function useAppTheme(): AppTheme {
  const system = useColorScheme();
  const preference = useAppStore((s) => s.themePreference);
  const mode: 'light' | 'dark' =
    preference === 'system' ? (system === 'dark' ? 'dark' : 'light') : preference;
  return mode === 'dark' ? darkTheme : lightTheme;
}
