import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AppLanguage, FontScale, ThemePreference } from '@/lib/types';

type AppState = {
  hydrated: boolean;
  readingIndex: number;
  bookmarks: string[];
  likes: string[];
  notes: Record<string, string>;
  themePreference: ThemePreference;
  fontScale: FontScale;
  language: AppLanguage;
  isPremium: boolean;
  reminderHour: number;
  reminderMinute: number;
  reminderEnabled: boolean;
  studyDate: string;
  studiesUsedToday: number;
  setHydrated: (v: boolean) => void;
  setReadingIndex: (index: number) => void;
  toggleBookmark: (id: string) => void;
  toggleLike: (id: string) => void;
  setNote: (id: string, note: string) => void;
  setThemePreference: (t: ThemePreference) => void;
  setFontScale: (f: FontScale) => void;
  setLanguage: (l: AppLanguage) => void;
  setPremium: (v: boolean) => void;
  setReminder: (enabled: boolean, hour?: number, minute?: number) => void;
  canUseStudy: () => boolean;
  consumeStudy: () => boolean;
  remainingStudies: () => number;
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      readingIndex: 0,
      bookmarks: [],
      likes: [],
      notes: {},
      themePreference: 'system',
      fontScale: 'medium',
      language: 'en',
      isPremium: false,
      reminderHour: 7,
      reminderMinute: 0,
      reminderEnabled: false,
      studyDate: todayKey(),
      studiesUsedToday: 0,
      setHydrated: (v) => set({ hydrated: v }),
      setReadingIndex: (index) => set({ readingIndex: Math.max(0, index) }),
      toggleBookmark: (id) =>
        set((s) => ({
          bookmarks: s.bookmarks.includes(id)
            ? s.bookmarks.filter((x) => x !== id)
            : [...s.bookmarks, id],
        })),
      toggleLike: (id) =>
        set((s) => ({
          likes: s.likes.includes(id) ? s.likes.filter((x) => x !== id) : [...s.likes, id],
        })),
      setNote: (id, note) =>
        set((s) => {
          const notes = { ...s.notes };
          if (!note.trim()) delete notes[id];
          else notes[id] = note;
          return { notes };
        }),
      setThemePreference: (themePreference) => set({ themePreference }),
      setFontScale: (fontScale) => set({ fontScale }),
      setLanguage: (language) => set({ language }),
      setPremium: (isPremium) => set({ isPremium }),
      setReminder: (enabled, hour, minute) =>
        set((s) => ({
          reminderEnabled: enabled,
          reminderHour: hour ?? s.reminderHour,
          reminderMinute: minute ?? s.reminderMinute,
        })),
      // Daily free-study cap disabled for now — all study modes are open.
      canUseStudy: () => true,
      consumeStudy: () => true,
      remainingStudies: () => Infinity,
    }),
    {
      name: 'scroll-the-gita-store',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state, error) => {
        if (error) return;
        // Migrate old translation preference → language
        const raw = state as AppState & { translation?: string };
        if (raw && !raw.language && raw.translation === 'hindi') {
          raw.language = 'hi';
        }
        state?.setHydrated(true);
      },
      partialize: (s) => ({
        readingIndex: s.readingIndex,
        bookmarks: s.bookmarks,
        likes: s.likes,
        notes: s.notes,
        themePreference: s.themePreference,
        fontScale: s.fontScale,
        language: s.language,
        isPremium: s.isPremium,
        reminderHour: s.reminderHour,
        reminderMinute: s.reminderMinute,
        reminderEnabled: s.reminderEnabled,
        studyDate: s.studyDate,
        studiesUsedToday: s.studiesUsedToday,
      }),
    }
  )
);

