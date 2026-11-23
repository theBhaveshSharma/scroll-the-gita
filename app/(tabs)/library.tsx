import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AdBanner } from '@/components/AdBanner';
import { fonts } from '@/constants/theme';
import { chapters, displayTranslation, getVerseById, indexForChapter } from '@/lib/gita';
import { useI18n } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';
import { useAppTheme } from '@/lib/useAppTheme';

export default function LibraryScreen() {
  const theme = useAppTheme();
  const { language, t } = useI18n();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const bookmarks = useAppStore((s) => s.bookmarks);
  const likes = useAppStore((s) => s.likes);
  const notes = useAppStore((s) => s.notes);
  const setNote = useAppStore((s) => s.setNote);
  const setReadingIndex = useAppStore((s) => s.setReadingIndex);

  const openVerse = (id: string) => {
    const verse = getVerseById(id);
    if (!verse) return;
    setReadingIndex(verse.index);
    router.navigate('/');
  };

  const saved = Array.from(new Set([...bookmarks, ...likes]));

  return (
    <View style={[styles.fill, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <FlatList
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            <Text style={[styles.title, { color: theme.text }]}>{t.libraryTitle}</Text>
            <Text style={[styles.sub, { color: theme.textMuted }]}>{t.librarySub}</Text>

            <Text style={[styles.section, { color: theme.accent }]}>{t.chapters}</Text>
            <View style={styles.chapterGrid}>
              {chapters.map((c) => (
                <Pressable
                  key={c.number}
                  onPress={() => {
                    setReadingIndex(indexForChapter(c.number));
                    router.navigate('/');
                  }}
                  style={[
                    styles.chapterChip,
                    { backgroundColor: theme.backgroundElevated, borderColor: theme.border },
                  ]}>
                  <Text style={{ color: theme.text, fontFamily: fonts.bodySemi }}>{c.number}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.section, { color: theme.accent }]}>{t.savedVerses}</Text>
            {saved.length === 0 ? (
              <Text style={{ color: theme.textMuted, fontFamily: fonts.body, marginBottom: 16 }}>
                {t.savedEmpty}
              </Text>
            ) : null}
          </View>
        }
        data={saved}
        keyExtractor={(id) => id}
        renderItem={({ item: id }) => {
          const verse = getVerseById(id);
          if (!verse) return null;
          return (
            <View
              style={[
                styles.verseCard,
                { backgroundColor: theme.backgroundElevated, borderColor: theme.border },
              ]}>
              <Pressable onPress={() => openVerse(id)}>
                <Text style={[styles.verseRef, { color: theme.accent }]}>
                  {verse.chapter}.{verse.verse}
                </Text>
                <Text style={[styles.verseText, { color: theme.text }]} numberOfLines={3}>
                  {displayTranslation(verse, language)}
                </Text>
              </Pressable>
              <TextInput
                placeholder={t.addNote}
                placeholderTextColor={theme.textMuted}
                value={notes[id] ?? ''}
                onChangeText={(txt) => setNote(id, txt)}
                style={[
                  styles.note,
                  {
                    color: theme.text,
                    borderColor: theme.border,
                    backgroundColor: theme.background,
                  },
                ]}
                multiline
              />
            </View>
          );
        }}
      />
      <AdBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontFamily: fonts.display, fontSize: 34 },
  sub: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, marginTop: 6, marginBottom: 18 },
  section: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 8,
  },
  chapterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  chapterChip: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verseCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  verseRef: { fontFamily: fonts.bodySemi, marginBottom: 6 },
  verseText: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  note: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    minHeight: 44,
    fontFamily: fonts.body,
    fontSize: 14,
  },
});
