import chapterStories from '@/data/chapter-stories.json';
import {
  chapterDisplayName,
  displayTranslation,
  getChapter,
  getVerseByChapterVerse,
  parseWordMeanings,
} from '@/lib/gita';
import { getStrings, type Strings } from '@/lib/i18n';
import type { AppLanguage, StudyMode, Verse } from '@/lib/types';

export type StudyBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'sanskrit'; text: string }
  | { type: 'transliteration'; text: string }
  | { type: 'word'; word: string; meaning: string }
  | { type: 'related'; chapter: number; verse: number; text: string };

export type StudyResult = {
  mode: StudyMode;
  title: string;
  blocks: StudyBlock[];
  source: 'guided' | 'ai' | 'bundled';
};

const cache = new Map<string, StudyResult>();

type StoryMap = Record<string, { en: string; hi: string }>;
const stories = chapterStories as StoryMap;

function cacheKey(verse: Verse, mode: StudyMode, language: AppLanguage) {
  return `v2:${verse.id}:${mode}:${language}`;
}

function themeLabel(t: Strings, theme: string) {
  return t.themes[theme] ?? theme;
}

function splitStoryParagraphs(text: string): string[] {
  return text
    .split(/\n\n+/)
    .map((p) => p.replace(/\n/g, ' ').trim())
    .filter(Boolean);
}

function guidedDeep(verse: Verse, language: AppLanguage, t: Strings): StudyBlock[] {
  const meaning = displayTranslation(verse, language);
  const chapter = getChapter(verse.chapter);
  const chapterName = chapter
    ? language === 'hi'
      ? t.chapterMeanings[verse.chapter] || chapterDisplayName(chapter, language)
      : chapter.name_english
    : String(verse.chapter);
  const theme = themeLabel(t, verse.theme);
  const story =
    stories[String(verse.chapter)]?.[language] ||
    stories[String(verse.chapter)]?.en ||
    chapter?.summary ||
    '';

  const blocks: StudyBlock[] = [
    { type: 'heading', text: t.headingEpic },
    { type: 'paragraph', text: t.deepEpic },
    { type: 'heading', text: t.headingStory },
    { type: 'paragraph', text: t.deepStoryIntro(verse.chapter, chapterName) },
  ];

  for (const para of splitStoryParagraphs(story)) {
    blocks.push({ type: 'paragraph', text: para });
  }

  if (chapter?.summary && language === 'en' && story !== chapter.summary) {
    // Extra scholarly summary when available and distinct
    blocks.push({
      type: 'paragraph',
      text: chapter.summary.trim(),
    });
  }

  blocks.push(
    { type: 'heading', text: t.headingVerseInStory },
    {
      type: 'paragraph',
      text: t.deepVersePlace(verse.chapter, verse.verse, theme),
    },
    { type: 'heading', text: t.headingMeaning },
    { type: 'paragraph', text: t.deepMeaningLead },
    { type: 'paragraph', text: meaning }
  );

  const words = parseWordMeanings(verse.word_meanings).slice(0, 8);
  if (words.length > 0) {
    blocks.push({ type: 'heading', text: t.headingWords });
    for (const w of words) {
      blocks.push({ type: 'word', word: w.word, meaning: w.meaning });
    }
  }

  blocks.push(
    { type: 'heading', text: t.headingWhyItMatters },
    { type: 'paragraph', text: t.deepWhyItMatters(theme) },
    { type: 'heading', text: t.headingReflection },
    { type: 'paragraph', text: t.deepReflection },
    { type: 'heading', text: t.headingPractice },
    { type: 'paragraph', text: t.deepPractice }
  );

  // Include related verses as part of the fuller study
  if (verse.related.length > 0) {
    blocks.push(
      { type: 'heading', text: t.headingRelated(theme) },
      { type: 'paragraph', text: t.relatedIntro }
    );
    for (const r of verse.related) {
      const related = getVerseByChapterVerse(r.chapter, r.verse);
      blocks.push({
        type: 'related',
        chapter: r.chapter,
        verse: r.verse,
        text: related ? displayTranslation(related, language) : '',
      });
    }
  }

  return blocks;
}

function guidedEasier(verse: Verse, language: AppLanguage, t: Strings): StudyBlock[] {
  const text = displayTranslation(verse, language).replace(/\bO\b/g, '').replace(/\s+/g, ' ').trim();
  const chapter = getChapter(verse.chapter);
  const chapterName = chapter
    ? language === 'hi'
      ? t.chapterMeanings[verse.chapter] || chapterDisplayName(chapter, language)
      : chapter.name_english
    : String(verse.chapter);
  const storyShort = splitStoryParagraphs(
    stories[String(verse.chapter)]?.[language] || stories[String(verse.chapter)]?.en || ''
  )[0];

  const blocks: StudyBlock[] = [];
  if (storyShort) {
    blocks.push(
      { type: 'heading', text: t.headingStory },
      {
        type: 'paragraph',
        text: t.deepStoryIntro(verse.chapter, chapterName),
      },
      { type: 'paragraph', text: storyShort }
    );
  }
  blocks.push(
    { type: 'heading', text: t.headingPlain },
    { type: 'paragraph', text: t.easierIntro(verse.chapter, verse.verse) },
    { type: 'paragraph', text },
    { type: 'heading', text: t.headingTakeaway },
    { type: 'paragraph', text: t.easierTakeaway }
  );
  return blocks;
}

function bundledSanskrit(verse: Verse, t: Strings): StudyBlock[] {
  const words = parseWordMeanings(verse.word_meanings);
  const blocks: StudyBlock[] = [
    { type: 'heading', text: t.headingSanskrit },
    { type: 'sanskrit', text: verse.sanskrit },
    { type: 'heading', text: t.headingTranslit },
    { type: 'transliteration', text: verse.transliteration },
    { type: 'heading', text: t.headingWords },
  ];

  if (words.length === 0) {
    blocks.push({ type: 'paragraph', text: t.noWordMeanings });
  } else {
    for (const w of words) {
      blocks.push({ type: 'word', word: w.word, meaning: w.meaning });
    }
  }
  return blocks;
}

function guidedRelated(verse: Verse, language: AppLanguage, t: Strings): StudyBlock[] {
  const blocks: StudyBlock[] = [
    { type: 'heading', text: t.headingRelated(themeLabel(t, verse.theme)) },
    { type: 'paragraph', text: t.relatedIntro },
  ];

  for (const r of verse.related) {
    const related = getVerseByChapterVerse(r.chapter, r.verse);
    blocks.push({
      type: 'related',
      chapter: r.chapter,
      verse: r.verse,
      text: related ? displayTranslation(related, language) : '',
    });
  }
  return blocks;
}

function aiToBlocks(content: string): StudyBlock[] {
  const lines = content
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
  const blocks: StudyBlock[] = [];
  for (const line of lines) {
    if (
      /^(before this verse|the story|where this verse|what the verse|why it matters|for your life|a small practice|context|meaning|reflection|practice|takeaway|in plain words|इस श्लोक से पहले|कथा|यह श्लोक|श्लोक क्या|यह क्यों|आपके जीवन|छोटा अभ्यास|अर्थ|चिंतन|अभ्यास|सरल|मुख्य)\b/i.test(
        line
      ) &&
      line.length < 60
    ) {
      blocks.push({ type: 'heading', text: line.replace(/:$/, '') });
    } else {
      blocks.push({ type: 'paragraph', text: line });
    }
  }
  return blocks.length ? blocks : [{ type: 'paragraph', text: content }];
}

async function maybeAiStudy(
  verse: Verse,
  mode: StudyMode,
  language: AppLanguage
): Promise<string | null> {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!apiKey || mode === 'sanskrit' || mode === 'related') return null;

  const langInstruction =
    language === 'hi' ? 'Respond entirely in clear Hindi (Devanagari).' : 'Respond in English.';

  const translation = displayTranslation(verse, language);
  const chapter = getChapter(verse.chapter);
  const story = stories[String(verse.chapter)]?.[language] || stories[String(verse.chapter)]?.en || '';
  const prompts: Record<'deep' | 'easier', string> = {
    deep: `${langInstruction} You are a warm, respectful Bhagavad Gita storyteller-teacher. Write a rich Deep Study (450-650 words) that feels like hearing the whole story. Use these headings in order: "Before this verse", "The story of this chapter", "Where this verse sits", "What the verse says", "Why it matters", "For your life", "A small practice". Make the story vivid — Kurukshetra, Arjuna's crisis, Krishna's teaching — then explain this exact verse. Chapter notes: ${chapter?.summary ?? ''}. Extra story material: ${story}. Verse ${verse.chapter}.${verse.verse}. Sanskrit: ${verse.sanskrit}. Translation: ${translation}`,
    easier: `${langInstruction} First give 3-4 sentences of simple story context for this chapter, then rewrite the verse in plain modern language, then one short takeaway. Verse ${verse.chapter}.${verse.verse}: ${translation}`,
  };

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.5,
        messages: [{ role: 'user', content: prompts[mode] }],
      }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content;
    return typeof content === 'string' ? content.trim() : null;
  } catch {
    return null;
  }
}

export async function getStudy(
  verse: Verse,
  mode: StudyMode,
  language: AppLanguage = 'en'
): Promise<StudyResult> {
  const key = cacheKey(verse, mode, language);
  const hit = cache.get(key);
  if (hit) return hit;

  const t = getStrings(language);
  const titles: Record<StudyMode, string> = {
    deep: t.studyDeep,
    sanskrit: t.studySanskrit,
    easier: t.studyEasier,
    related: t.studyRelated,
  };

  if (mode === 'sanskrit') {
    const result: StudyResult = {
      mode,
      title: titles[mode],
      blocks: bundledSanskrit(verse, t),
      source: 'bundled',
    };
    cache.set(key, result);
    return result;
  }

  if (mode === 'related') {
    const result: StudyResult = {
      mode,
      title: titles[mode],
      blocks: guidedRelated(verse, language, t),
      source: 'guided',
    };
    cache.set(key, result);
    return result;
  }

  const ai = await maybeAiStudy(verse, mode, language);
  const result: StudyResult = {
    mode,
    title: titles[mode],
    blocks: ai
      ? aiToBlocks(ai)
      : mode === 'deep'
        ? guidedDeep(verse, language, t)
        : guidedEasier(verse, language, t),
    source: ai ? 'ai' : 'guided',
  };
  cache.set(key, result);
  return result;
}
