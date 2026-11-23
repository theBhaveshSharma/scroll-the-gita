export const palette = {
  saffron: '#C45C26',
  saffronSoft: '#E8A87C',
  ink: '#1A1410',
  inkMuted: '#5C4F42',
  parchment: '#F3E6D0',
  parchmentDeep: '#E8D5B5',
  night: '#0E1218',
  nightElevated: '#171D27',
  nightText: '#F0E6D6',
  nightMuted: '#A89884',
  gold: '#C9A227',
  borderLight: 'rgba(26, 20, 16, 0.12)',
  borderDark: 'rgba(240, 230, 214, 0.12)',
};

export const fonts = {
  display: 'CormorantGaramond_600SemiBold',
  displayItalic: 'CormorantGaramond_500Medium_Italic',
  body: 'Literata_400Regular',
  bodyMedium: 'Literata_500Medium',
  bodySemi: 'Literata_600SemiBold',
};

export type AppTheme = {
  mode: 'light' | 'dark';
  background: string;
  backgroundElevated: string;
  text: string;
  textMuted: string;
  accent: string;
  accentSoft: string;
  border: string;
  tabBar: string;
  overlay: string;
  cardNight: string;
  cardParchment: string;
};

export const lightTheme: AppTheme = {
  mode: 'light',
  background: palette.parchment,
  backgroundElevated: '#FFF8EC',
  text: palette.ink,
  textMuted: palette.inkMuted,
  accent: palette.saffron,
  accentSoft: palette.saffronSoft,
  border: palette.borderLight,
  tabBar: '#FFF8EC',
  overlay: 'rgba(26, 20, 16, 0.45)',
  cardNight: palette.night,
  cardParchment: palette.parchmentDeep,
};

export const darkTheme: AppTheme = {
  mode: 'dark',
  background: palette.night,
  backgroundElevated: palette.nightElevated,
  text: palette.nightText,
  textMuted: palette.nightMuted,
  accent: palette.saffronSoft,
  accentSoft: palette.gold,
  border: palette.borderDark,
  tabBar: palette.nightElevated,
  overlay: 'rgba(0, 0, 0, 0.55)',
  cardNight: '#0A0E14',
  cardParchment: palette.parchment,
};

export const fontScaleMap = {
  small: 0.9,
  medium: 1,
  large: 1.18,
} as const;
