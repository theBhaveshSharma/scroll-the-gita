import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AdBanner } from '@/components/AdBanner';
import { fonts } from '@/constants/theme';
import { useI18n } from '@/lib/i18n';
import { cancelReminders, scheduleDailyReminder } from '@/lib/notifications';
import { restorePurchases } from '@/lib/premium';
import { useAppStore } from '@/lib/store';
import { useAppTheme } from '@/lib/useAppTheme';
import type { AppLanguage, FontScale, ThemePreference } from '@/lib/types';

export default function SettingsScreen() {
  const theme = useAppTheme();
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    themePreference,
    setThemePreference,
    fontScale,
    setFontScale,
    language,
    setLanguage,
    isPremium,
    setPremium,
    reminderEnabled,
    reminderHour,
    reminderMinute,
    setReminder,
  } = useAppStore();
  const [busy, setBusy] = useState(false);

  const toggleReminder = async (enabled: boolean) => {
    setReminder(enabled);
    if (enabled) {
      const id = await scheduleDailyReminder(reminderHour, reminderMinute);
      if (!id) {
        Alert.alert(t.permissionNeeded, t.permissionBody);
        setReminder(false);
      }
    } else {
      await cancelReminders();
    }
  };

  const onRestore = async () => {
    try {
      setBusy(true);
      const active = await restorePurchases();
      Alert.alert(active ? t.premiumRestored : t.noPurchases);
    } catch (e) {
      Alert.alert(t.restoreFailed, e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={[styles.fill, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>{t.settingsTitle}</Text>

        <Section title={t.language} color={theme.accent}>
          <Segment
            value={language}
            options={[
              { id: 'en', label: t.languageEn },
              { id: 'hi', label: t.languageHi },
            ]}
            onChange={(v) => setLanguage(v as AppLanguage)}
            theme={theme}
          />
        </Section>

        <Section title={t.appearance} color={theme.accent}>
          <Row label={t.theme} text={theme.text}>
            <Segment
              value={themePreference}
              options={[
                { id: 'system', label: t.themeAuto },
                { id: 'light', label: t.themeLight },
                { id: 'dark', label: t.themeDark },
              ]}
              onChange={(v) => setThemePreference(v as ThemePreference)}
              theme={theme}
            />
          </Row>
          <Row label={t.fontSize} text={theme.text}>
            <Segment
              value={fontScale}
              options={[
                { id: 'small', label: 'S' },
                { id: 'medium', label: 'M' },
                { id: 'large', label: 'L' },
              ]}
              onChange={(v) => setFontScale(v as FontScale)}
              theme={theme}
            />
          </Row>
        </Section>

        <Section title={t.reminders} color={theme.accent}>
          <Row label={t.dailyReminder} text={theme.text}>
            <Switch
              value={reminderEnabled}
              onValueChange={toggleReminder}
              trackColor={{ true: theme.accent }}
            />
          </Row>
          <Text style={{ color: theme.textMuted, fontFamily: fonts.body, fontSize: 13 }}>
            {t.defaultTime}: {String(reminderHour).padStart(2, '0')}:
            {String(reminderMinute).padStart(2, '0')}
          </Text>
        </Section>

        <Section title={t.premium} color={theme.accent}>
          <Text style={{ color: theme.text, fontFamily: fonts.body, marginBottom: 10 }}>
            {isPremium ? t.statusPremium : t.statusFree}
          </Text>
          <Pressable
            onPress={() => router.push('/premium')}
            style={[styles.btn, { backgroundColor: theme.accent }]}>
            <Text style={styles.btnText}>{isPremium ? t.managePremium : t.goPremium}</Text>
          </Pressable>
          <Pressable onPress={onRestore} disabled={busy} style={styles.linkBtn}>
            <Text style={{ color: theme.accent, fontFamily: fonts.bodySemi }}>
              {t.restorePurchases}
            </Text>
          </Pressable>
          {!isPremium ? (
            <Pressable onPress={() => setPremium(true)} style={styles.linkBtn}>
              <Text style={{ color: theme.textMuted, fontFamily: fonts.body, fontSize: 12 }}>
                {t.devUnlock}
              </Text>
            </Pressable>
          ) : (
            <Pressable onPress={() => setPremium(false)} style={styles.linkBtn}>
              <Text style={{ color: theme.textMuted, fontFamily: fonts.body, fontSize: 12 }}>
                {t.devClear}
              </Text>
            </Pressable>
          )}
        </Section>

        <Section title={t.legal} color={theme.accent}>
          <Link href="/legal/privacy" style={[styles.legal, { color: theme.text }]}>
            {t.privacy}
          </Link>
          <Link href="/legal/terms" style={[styles.legal, { color: theme.text }]}>
            {t.terms}
          </Link>
        </Section>

        <Text style={[styles.footer, { color: theme.textMuted }]}>{t.footer}</Text>
      </ScrollView>
      <AdBanner />
    </View>
  );
}

function Section({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginBottom: 28 }}>
      <Text
        style={{
          color,
          fontFamily: fonts.bodySemi,
          fontSize: 12,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          marginBottom: 12,
        }}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function Row({
  label,
  children,
  text,
}: {
  label: string;
  children: React.ReactNode;
  text: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={{ color: text, fontFamily: fonts.body, flex: 1 }}>{label}</Text>
      {children}
    </View>
  );
}

function Segment({
  value,
  options,
  onChange,
  theme,
}: {
  value: string;
  options: { id: string; label: string }[];
  onChange: (id: string) => void;
  theme: ReturnType<typeof useAppTheme>;
}) {
  return (
    <View style={styles.segment}>
      {options.map((o) => {
        const active = o.id === value;
        return (
          <Pressable
            key={o.id}
            onPress={() => onChange(o.id)}
            style={[
              styles.segItem,
              {
                backgroundColor: active ? theme.accent : theme.backgroundElevated,
                borderColor: theme.border,
              },
            ]}>
            <Text
              style={{
                color: active ? '#fff' : theme.text,
                fontFamily: fonts.bodySemi,
                fontSize: 12,
              }}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { padding: 20, paddingBottom: 48 },
  title: { fontFamily: fonts.display, fontSize: 34, marginBottom: 22 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  segment: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  segItem: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  btn: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontFamily: fonts.bodySemi },
  linkBtn: { marginTop: 12 },
  legal: { fontFamily: fonts.body, fontSize: 16, marginBottom: 10 },
  footer: {
    fontFamily: fonts.body,
    fontSize: 12,
    marginTop: 8,
    lineHeight: 18,
  },
});
