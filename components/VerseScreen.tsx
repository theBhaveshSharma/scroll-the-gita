import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fonts, fontScaleMap, palette } from '@/constants/theme';
import { chapterDisplayName, displayTranslation, getChapter } from '@/lib/gita';
import { useI18n } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';
import { useAppTheme } from '@/lib/useAppTheme';
import type { Verse } from '@/lib/types';

type Props = {
  verse: Verse;
  onOpenStudy: () => void;
  onOpenCard: () => void;
  onToggleBookmark: () => void;
  bookmarked: boolean;
  liked: boolean;
  onToggleLike: () => void;
};

export function VerseScreen({
  verse,
  onOpenStudy,
  onOpenCard,
  onToggleBookmark,
  bookmarked,
  liked,
  onToggleLike,
}: Props) {
  const theme = useAppTheme();
  const { language, t } = useI18n();
  const setLanguage = useAppStore((s) => s.setLanguage);
  const insets = useSafeAreaInsets();
  const fontScale = useAppStore((s) => s.fontScale);
  const scale = fontScaleMap[fontScale];
  const chapter = getChapter(verse.chapter);
  const meaning = displayTranslation(verse, language);

  const gradient =
    theme.mode === 'dark'
      ? ([palette.night, '#141A24', palette.night] as const)
      : ([palette.parchment, '#FFF6E6', palette.parchmentDeep] as const);

  const toggleLanguage = () => setLanguage(language === 'en' ? 'hi' : 'en');

  return (
    <LinearGradient colors={gradient} style={styles.fill}>
      <View
        style={[
          styles.fill,
          {
            paddingTop: insets.top + 16,
            paddingBottom: 12,
            paddingHorizontal: 24,
          },
        ]}>
        <View style={styles.topRow}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={[styles.kicker, { color: theme.textMuted, fontSize: 12 * scale }]}>
              {t.chapterLabel} {verse.chapter} · {t.verseLabel} {verse.verse}
            </Text>
            <Text style={[styles.chapter, { color: theme.accent, fontSize: 15 * scale }]}>
              {chapter ? chapterDisplayName(chapter, language) : ''}
            </Text>
          </View>
          <TouchableOpacity
            onPress={toggleLanguage}
            activeOpacity={0.75}
            style={[
              styles.langToggle,
              {
                borderColor: theme.border,
                backgroundColor: theme.backgroundElevated,
              },
            ]}>
            <Text style={[styles.langToggleText, { color: theme.text }]}>
              {language === 'hi' ? 'Hi' : 'En'}
              <Text style={{ color: theme.textMuted }}> / </Text>
              {language === 'hi' ? 'En' : 'Hi'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.center} pointerEvents="box-none">
          <Text
            style={[
              styles.sanskrit,
              {
                color: theme.text,
                fontSize: 26 * scale,
                lineHeight: 38 * scale,
              },
            ]}
            numberOfLines={6}>
            {verse.sanskrit}
          </Text>
          <Text
            style={[
              styles.transliteration,
              {
                color: theme.textMuted,
                fontSize: 13 * scale,
                lineHeight: 20 * scale,
              },
            ]}
            numberOfLines={3}>
            {verse.transliteration}
          </Text>

          <View style={[styles.rule, { backgroundColor: theme.border }]} />

          <Text style={[styles.langLabel, { color: theme.accent, fontSize: 11 * scale }]}>
            {language === 'hi' ? 'हिंदी' : 'English'}
          </Text>
          <Text
            style={[
              styles.translation,
              {
                color: theme.text,
                fontSize: 18 * scale,
                lineHeight: 28 * scale,
              },
            ]}
            numberOfLines={8}>
            {meaning}
          </Text>
        </View>

        <View style={styles.actions} collapsable={false}>
          <Action label={liked ? t.liked : t.like} onPress={onToggleLike} color={theme.accent} />
          <Action
            label={bookmarked ? t.saved : t.save}
            onPress={onToggleBookmark}
            color={theme.accent}
          />
          <Action label={t.shareCard} onPress={onOpenCard} color={theme.accent} />
          <TouchableOpacity
            onPress={onOpenStudy}
            activeOpacity={0.75}
            style={[styles.studyBtn, { backgroundColor: theme.accent }]}>
            <Text style={styles.studyBtnText}>{t.study}</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.hint, { color: theme.textMuted }]}>{t.tapForStudy}</Text>
      </View>
    </LinearGradient>
  );
}

function Action({
  label,
  onPress,
  color,
}: {
  label: string;
  onPress: () => void;
  color: string;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} hitSlop={8} style={styles.actionBtn}>
      <Text style={[styles.actionText, { color }]} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, width: '100%' },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    zIndex: 30,
    elevation: 30,
  },
  langToggle: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 2,
  },
  langToggleText: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
  },
  kicker: {
    fontFamily: fonts.bodyMedium,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  chapter: {
    fontFamily: fonts.display,
    marginTop: 4,
  },
  center: {
    flex: 1,
    marginTop: 8,
    justifyContent: 'center',
  },
  sanskrit: {
    fontFamily: fonts.display,
    textAlign: 'center',
  },
  transliteration: {
    fontFamily: fonts.displayItalic,
    textAlign: 'center',
    marginTop: 12,
  },
  rule: {
    height: 1,
    width: 48,
    alignSelf: 'center',
    marginVertical: 16,
  },
  langLabel: {
    fontFamily: fonts.bodySemi,
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 8,
  },
  translation: {
    fontFamily: fonts.body,
    textAlign: 'center',
  },
  hint: {
    marginTop: 8,
    textAlign: 'center',
    fontFamily: fonts.body,
    fontSize: 11,
    opacity: 0.75,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    zIndex: 20,
    elevation: 20,
  },
  actionBtn: {
    paddingVertical: 14,
    paddingHorizontal: 6,
    minHeight: 48,
    justifyContent: 'center',
  },
  actionText: {
    fontFamily: fonts.bodySemi,
    fontSize: 15,
  },
  studyBtn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
    minHeight: 48,
    justifyContent: 'center',
  },
  studyBtnText: {
    color: '#fff',
    fontFamily: fonts.bodySemi,
    fontSize: 15,
  },
});
