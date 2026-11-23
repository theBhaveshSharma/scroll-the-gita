import gitaData from '@/data/gita.json';
import type { Chapter, Verse } from '@/lib/types';

type GitaPayload = {
  title: string;
  verse_count: number;
  chapters: Chapter[];
  verses: Verse[];
};

const data = gitaData as GitaPayload;

export const chapters: Chapter[] = data.chapters;
export const verses: Verse[] = data.verses;
export const verseCount = data.verse_count;

const byId = new Map(verses.map((v) => [v.id, v]));
const byChapterVerse = new Map(verses.map((v) => [`${v.chapter}:${v.verse}`, v]));

export function getVerse(index: number): Verse | undefined {
  return verses[index];
}

export function getVerseById(id: string): Verse | undefined {
  return byId.get(id);
}

export function getVerseByChapterVerse(chapter: number, verse: number): Verse | undefined {
  return byChapterVerse.get(`${chapter}:${verse}`);
}

export function getChapter(number: number): Chapter | undefined {
  return chapters.find((c) => c.number === number);
}

export function indexForChapter(chapter: number): number {
  const first = verses.find((v) => v.chapter === chapter);
  return first?.index ?? 0;
}

export function displayTranslation(verse: Verse, language: 'en' | 'hi' = 'en'): string {
  if (language === 'hi') {
    return verse.translation_hindi || verse.translation || verse.translation_sivananda;
  }
  return verse.translation || verse.translation_sivananda || verse.translation_hindi;
}

export function chapterDisplayName(chapter: Chapter, language: 'en' | 'hi'): string {
  if (language === 'hi') return chapter.name_sanskrit || chapter.name_english;
  return chapter.name_english;
}

export function parseWordMeanings(raw: string): { word: string; meaning: string }[] {
  if (!raw) return [];
  // Typical format: "word — meaning; word — meaning"
  return raw
    .split(/;|।/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const split = part.split(/—|–|-|:/);
      if (split.length < 2) return { word: part, meaning: '' };
      return {
        word: split[0].trim(),
        meaning: split.slice(1).join('-').trim(),
      };
    })
    .filter((w) => w.word.length > 0);
}
