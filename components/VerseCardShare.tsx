import { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

import { fonts, palette } from '@/constants/theme';
import { displayTranslation } from '@/lib/gita';
import { useI18n } from '@/lib/i18n';
import { useAppTheme } from '@/lib/useAppTheme';
import type { CardTheme, Verse } from '@/lib/types';

type Props = { verse: Verse };

export function VerseCardShare({ verse }: Props) {
  const theme = useAppTheme();
  const { language, t } = useI18n();
  const cardRef = useRef(null);
  const [cardTheme, setCardTheme] = useState<CardTheme>('night');
  const [busy, setBusy] = useState(false);

  const night = cardTheme === 'night';
  const bg = night ? palette.night : palette.parchment;
  const fg = night ? palette.nightText : palette.ink;
  const muted = night ? palette.nightMuted : palette.inkMuted;
  const accent = night ? palette.saffronSoft : palette.saffron;

  const share = async () => {
    try {
      setBusy(true);
      if (!cardRef.current) return;
      const uri = await (captureRef as (target: unknown, opts: object) => Promise<string>)(cardRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert(t.sharingUnavailable, t.sharingUnavailableBody);
        return;
      }
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: `${t.brandName} ${verse.chapter}.${verse.verse}`,
      });
    } catch (e) {
      Alert.alert(t.couldNotShare, e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={[styles.wrap, { backgroundColor: theme.background }]}>
      <Text style={[styles.heading, { color: theme.text }]}>{t.verseCard}</Text>
      <View style={styles.themes}>
        {(['night', 'parchment'] as CardTheme[]).map((ct) => (
          <Pressable
            key={ct}
            onPress={() => setCardTheme(ct)}
            style={[
              styles.themeChip,
              {
                backgroundColor: cardTheme === ct ? theme.accent : theme.backgroundElevated,
                borderColor: theme.border,
              },
            ]}>
            <Text
              style={{
                color: cardTheme === ct ? '#fff' : theme.text,
                fontFamily: fonts.bodySemi,
              }}>
              {ct === 'night' ? t.night : t.parchment}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.previewWrap}>
        <View ref={cardRef} collapsable={false} style={[styles.card, { backgroundColor: bg }]}>
          <Text style={[styles.cardKicker, { color: accent }]}>
            {language === 'hi' ? 'भगवद्गीता' : 'Bhagavad Gita'} {verse.chapter}.{verse.verse}
          </Text>
          <Text style={[styles.cardSanskrit, { color: fg }]}>{verse.sanskrit}</Text>
          <View style={[styles.cardRule, { backgroundColor: muted }]} />
          <Text style={[styles.cardLang, { color: accent }]}>
            {language === 'hi' ? 'हिंदी' : 'English'}
          </Text>
          <Text style={[styles.cardEnglish, { color: fg }]}>
            {displayTranslation(verse, language)}
          </Text>
          <Text style={[styles.cardBrand, { color: muted }]}>{t.brandName}</Text>
        </View>
      </View>

      <Pressable
        onPress={share}
        disabled={busy}
        style={[styles.shareBtn, { backgroundColor: theme.accent, opacity: busy ? 0.6 : 1 }]}>
        <Text style={styles.shareText}>{busy ? t.preparing : t.shareCard}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20 },
  heading: { fontFamily: fonts.display, fontSize: 30, marginBottom: 12 },
  themes: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  themeChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  previewWrap: { flex: 1, justifyContent: 'center' },
  card: {
    borderRadius: 8,
    padding: 28,
    minHeight: 360,
    justifyContent: 'center',
  },
  cardKicker: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 18,
    textAlign: 'center',
  },
  cardSanskrit: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 34,
    textAlign: 'center',
  },
  cardRule: {
    height: 1,
    width: 40,
    alignSelf: 'center',
    marginVertical: 18,
    opacity: 0.5,
  },
  cardLang: {
    fontFamily: fonts.bodySemi,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 6,
  },
  cardEnglish: {
    fontFamily: fonts.body,
    fontSize: 17,
    lineHeight: 28,
    textAlign: 'center',
  },
  cardBrand: {
    marginTop: 28,
    textAlign: 'center',
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 1,
  },
  shareBtn: {
    marginTop: 16,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  shareText: { color: '#fff', fontFamily: fonts.bodySemi, fontSize: 16 },
});
