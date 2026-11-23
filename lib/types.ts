export type Verse = {
  id: string;
  index: number;
  chapter: number;
  verse: number;
  sanskrit: string;
  transliteration: string;
  word_meanings: string;
  translation: string;
  translation_sivananda: string;
  translation_hindi: string;
  theme: string;
  related: { chapter: number; verse: number }[];
};

export type Chapter = {
  number: number;
  name_english: string;
  name_sanskrit: string;
  meaning: string;
  verses_count: number;
  summary: string;
};

export type Prayer = {
  id: string;
  title: string;
  title_hi: string;
  sanskrit: string;
  transliteration: string;
  english: string;
  hindi: string;
  premium: boolean;
};

export type StudyMode = 'deep' | 'sanskrit' | 'easier' | 'related';

export type ThemePreference = 'system' | 'light' | 'dark';
export type FontScale = 'small' | 'medium' | 'large';
export type AppLanguage = 'en' | 'hi';
export type CardTheme = 'night' | 'parchment';
