import { darkTheme, lightTheme } from '@/constants/theme';

export default {
  light: {
    text: lightTheme.text,
    background: lightTheme.background,
    tint: lightTheme.accent,
    tabIconDefault: lightTheme.textMuted,
    tabIconSelected: lightTheme.accent,
  },
  dark: {
    text: darkTheme.text,
    background: darkTheme.background,
    tint: darkTheme.accent,
    tabIconDefault: darkTheme.textMuted,
    tabIconSelected: darkTheme.accent,
  },
};
