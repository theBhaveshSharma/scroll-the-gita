import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fonts } from '@/constants/theme';
import { displayTranslation } from '@/lib/gita';
import { useI18n } from '@/lib/i18n';
import { getStudy, type StudyBlock, type StudyResult } from '@/lib/study';
import { useAppTheme } from '@/lib/useAppTheme';
import type { StudyMode, Verse } from '@/lib/types';

type Props = { verse: Verse };

export function StudySheet({ verse }: Props) {
  const theme = useAppTheme();
  const { language, t } = useI18n();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<StudyMode>('deep');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StudyResult | null>(null);

  const MODES: { id: StudyMode; label: string; hint: string }[] = [
    { id: 'deep', label: t.studyDeep, hint: t.studyDeepHint },
    { id: 'sanskrit', label: t.studySanskrit, hint: t.studySanskritHint },
    { id: 'easier', label: t.studyEasier, hint: t.studyEasierHint },
    { id: 'related', label: t.studyRelated, hint: t.studyRelatedHint },
  ];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const study = await getStudy(verse, mode, language);
        if (!cancelled) setResult(study);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [verse.id, mode, language]);

  return (
    <View style={[styles.wrap, { backgroundColor: theme.background, paddingBottom: insets.bottom }]}>
      <View style={styles.topBar}>
        <Text style={[styles.topTitle, { color: theme.text }]}>{t.studyTitle}</Text>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.closeHit}>
          <Text style={[styles.closeText, { color: theme.accent }]}>{t.done}</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={[styles.ref, { color: theme.accent }]}>
          {language === 'hi' ? 'भगवद्गीता' : 'Bhagavad Gita'} {verse.chapter}.{verse.verse}
        </Text>
        <Text style={[styles.versePreview, { color: theme.text }]} numberOfLines={4}>
          {displayTranslation(verse, language)}
        </Text>

        <View style={styles.modeGrid}>
          {MODES.map((m) => {
            const active = m.id === mode;
            return (
              <Pressable
                key={m.id}
                onPress={() => setMode(m.id)}
                style={[
                  styles.modeCell,
                  {
                    borderColor: active ? theme.accent : theme.border,
                    backgroundColor: active ? theme.backgroundElevated : 'transparent',
                  },
                ]}>
                <Text style={[styles.modeLabel, { color: active ? theme.accent : theme.text }]}>
                  {m.label}
                </Text>
                <Text style={[styles.modeHint, { color: theme.textMuted }]}>{m.hint}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {loading ? (
          <ActivityIndicator color={theme.accent} style={{ marginTop: 32 }} />
        ) : result ? (
          <View style={styles.blocks}>
            {result.blocks.map((block, i) => (
              <StudyBlockView key={`${result.mode}-${i}`} block={block} />
            ))}
            <Text style={[styles.source, { color: theme.textMuted }]}>
              {result.source === 'ai'
                ? t.sourceAi
                : result.source === 'bundled'
                  ? t.sourceBundled
                  : t.sourceGuided}
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

function StudyBlockView({ block }: { block: StudyBlock }) {
  const theme = useAppTheme();

  switch (block.type) {
    case 'heading':
      return <Text style={[styles.heading, { color: theme.accent }]}>{block.text}</Text>;
    case 'paragraph':
      return <Text style={[styles.paragraph, { color: theme.text }]}>{block.text}</Text>;
    case 'sanskrit':
      return <Text style={[styles.sanskrit, { color: theme.text }]}>{block.text}</Text>;
    case 'transliteration':
      return <Text style={[styles.translit, { color: theme.textMuted }]}>{block.text}</Text>;
    case 'word':
      return (
        <View style={[styles.wordRow, { borderBottomColor: theme.border }]}>
          <Text style={[styles.wordTerm, { color: theme.text }]}>{block.word}</Text>
          {block.meaning ? (
            <Text style={[styles.wordMeaning, { color: theme.textMuted }]}>{block.meaning}</Text>
          ) : null}
        </View>
      );
    case 'related':
      return (
        <View style={styles.relatedRow}>
          <Text style={[styles.relatedRef, { color: theme.accent }]}>
            {block.chapter}.{block.verse}
          </Text>
          {block.text ? (
            <Text style={[styles.relatedText, { color: theme.text }]} numberOfLines={3}>
              {block.text}
            </Text>
          ) : null}
        </View>
      );
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 6,
  },
  topTitle: {
    fontFamily: fonts.display,
    fontSize: 28,
  },
  closeHit: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  closeText: {
    fontFamily: fonts.bodySemi,
    fontSize: 16,
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 48,
  },
  ref: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  versePreview: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 32,
    marginBottom: 20,
  },
  modeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },
  modeCell: {
    width: '47%',
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  modeLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: 15,
    marginBottom: 4,
  },
  modeHint: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 22,
  },
  blocks: { gap: 4 },
  heading: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: 18,
    marginBottom: 8,
  },
  paragraph: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 8,
  },
  sanskrit: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 34,
    textAlign: 'center',
    marginBottom: 8,
  },
  translit: {
    fontFamily: fonts.displayItalic,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  wordRow: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  wordTerm: {
    fontFamily: fonts.bodySemi,
    fontSize: 15,
    marginBottom: 4,
  },
  wordMeaning: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },
  relatedRow: { marginBottom: 18 },
  relatedRef: {
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    marginBottom: 4,
  },
  relatedText: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 23,
  },
  source: {
    marginTop: 28,
    fontFamily: fonts.body,
    fontSize: 12,
  },
});
