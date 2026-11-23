import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts } from '@/constants/theme';
import { useI18n } from '@/lib/i18n';
import { purchasePackage } from '@/lib/premium';
import { useAppStore } from '@/lib/store';
import { useAppTheme } from '@/lib/useAppTheme';

export default function PremiumScreen() {
  const theme = useAppTheme();
  const { t } = useI18n();
  const isPremium = useAppStore((s) => s.isPremium);
  const [busy, setBusy] = useState(false);

  const buy = async (kind: 'monthly' | 'lifetime') => {
    try {
      setBusy(true);
      const result = await purchasePackage(kind);
      if (result.ok) {
        Alert.alert(
          t.welcomePremium,
          result.mock ? t.welcomePremiumMock : t.welcomePremiumBody
        );
      }
    } catch (e) {
      Alert.alert(t.purchaseFailed, e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={[styles.wrap, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>{t.premiumTitle}</Text>
      <Text style={[styles.body, { color: theme.textMuted }]}>{t.premiumBody}</Text>

      {[t.premiumBullet1, t.premiumBullet2, t.premiumBullet3, t.premiumBullet4].map((item) => (
        <Text key={item} style={[styles.bullet, { color: theme.text }]}>
          · {item}
        </Text>
      ))}

      {isPremium ? (
        <Text style={[styles.status, { color: theme.accent }]}>{t.alreadyPremium}</Text>
      ) : (
        <View style={{ gap: 12, marginTop: 24 }}>
          <Pressable
            disabled={busy}
            onPress={() => buy('monthly')}
            style={[styles.btn, { backgroundColor: theme.accent, opacity: busy ? 0.6 : 1 }]}>
            <Text style={styles.btnText}>{t.subscribeMonthly}</Text>
          </Pressable>
          <Pressable
            disabled={busy}
            onPress={() => buy('lifetime')}
            style={[
              styles.btn,
              {
                backgroundColor: theme.backgroundElevated,
                borderColor: theme.border,
                borderWidth: 1,
                opacity: busy ? 0.6 : 1,
              },
            ]}>
            <Text style={[styles.btnText, { color: theme.text }]}>{t.unlockLifetime}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 24 },
  title: { fontFamily: fonts.display, fontSize: 34, marginBottom: 10 },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24, marginBottom: 18 },
  bullet: { fontFamily: fonts.body, fontSize: 15, lineHeight: 26 },
  status: { marginTop: 28, fontFamily: fonts.bodySemi, fontSize: 16 },
  btn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontFamily: fonts.bodySemi, fontSize: 16 },
});
