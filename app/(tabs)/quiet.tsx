import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Speech from 'expo-speech';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { AdBanner } from '@/components/AdBanner';
import prayers from '@/data/prayers.json';
import { fonts } from '@/constants/theme';
import { useI18n } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';
import { useAppTheme } from '@/lib/useAppTheme';
import type { Prayer } from '@/lib/types';

type Category = 'morning' | 'evening' | 'classic';

export default function QuietScreen() {
  const theme = useAppTheme();
  const { language, t } = useI18n();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isPremium = useAppStore((s) => s.isPremium);
  const [category, setCategory] = useState<Category>('morning');
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const list = useMemo(() => prayers[category] as Prayer[], [category]);

  const speak = (prayer: Prayer) => {
    if (prayer.premium && !isPremium) {
      router.push('/premium');
      return;
    }
    Speech.stop();
    if (speakingId === prayer.id) {
      setSpeakingId(null);
      return;
    }
    setSpeakingId(prayer.id);
    const title = language === 'hi' ? prayer.title_hi : prayer.title;
    const body = language === 'hi' ? prayer.hindi : prayer.english;
    Speech.speak(`${title}. ${body}`, {
      language: language === 'hi' ? 'hi-IN' : 'en-US',
      onDone: () => setSpeakingId(null),
      onStopped: () => setSpeakingId(null),
    });
  };

  const cats: { id: Category; label: string }[] = [
    { id: 'morning', label: t.morning },
    { id: 'evening', label: t.evening },
    { id: 'classic', label: t.classic },
  ];

  return (
    <View style={[styles.fill, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>{t.quietTitle}</Text>
        <Text style={[styles.sub, { color: theme.textMuted }]}>{t.quietSub}</Text>

        <View style={styles.tabs}>
          {cats.map((c) => {
            const active = c.id === category;
            return (
              <Pressable
                key={c.id}
                onPress={() => setCategory(c.id)}
                style={[
                  styles.tab,
                  {
                    backgroundColor: active ? theme.accent : theme.backgroundElevated,
                    borderColor: theme.border,
                  },
                ]}>
                <Text
                  style={{
                    color: active ? '#fff' : theme.text,
                    fontFamily: fonts.bodySemi,
                  }}>
                  {c.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {list.map((prayer) => {
          const locked = prayer.premium && !isPremium;
          const title = language === 'hi' ? prayer.title_hi : prayer.title;
          const body = language === 'hi' ? prayer.hindi : prayer.english;
          return (
            <View
              key={prayer.id}
              style={[
                styles.card,
                {
                  backgroundColor: theme.backgroundElevated,
                  borderColor: theme.border,
                  opacity: locked ? 0.75 : 1,
                },
              ]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>{title}</Text>
                {prayer.premium ? (
                  <Text style={{ color: theme.accent, fontFamily: fonts.bodySemi, fontSize: 11 }}>
                    {t.premiumBadge}
                  </Text>
                ) : null}
              </View>
              <Text style={[styles.sanskrit, { color: theme.text }]}>{prayer.sanskrit}</Text>
              <Text style={[styles.translit, { color: theme.textMuted }]}>
                {prayer.transliteration}
              </Text>
              <Text style={[styles.english, { color: theme.text }]}>{body}</Text>
              <Pressable onPress={() => speak(prayer)} style={styles.audioBtn}>
                <Text style={{ color: theme.accent, fontFamily: fonts.bodySemi }}>
                  {locked
                    ? t.unlockAudio
                    : speakingId === prayer.id
                      ? t.stop
                      : t.listen}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
      <AdBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontFamily: fonts.display, fontSize: 34 },
  sub: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, marginTop: 6, marginBottom: 18 },
  tabs: { flexDirection: 'row', gap: 8, marginBottom: 18 },
  tab: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: { fontFamily: fonts.bodySemi, fontSize: 16, flex: 1, paddingRight: 8 },
  sanskrit: {
    fontFamily: fonts.display,
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 8,
  },
  translit: {
    fontFamily: fonts.displayItalic,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 10,
  },
  english: { fontFamily: fonts.body, fontSize: 15, lineHeight: 24 },
  audioBtn: { marginTop: 14, alignSelf: 'flex-start' },
});
