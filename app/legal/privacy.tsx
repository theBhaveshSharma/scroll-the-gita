import { ScrollView, StyleSheet, Text } from 'react-native';

import { fonts } from '@/constants/theme';
import { useAppTheme } from '@/lib/useAppTheme';

export default function PrivacyScreen() {
  const theme = useAppTheme();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={styles.content}>
      <Text style={[styles.h, { color: theme.text }]}>Privacy Policy</Text>
      <Text style={[styles.p, { color: theme.textMuted }]}>
        Scroll the Bhagavad Gita stores your reading place, bookmarks, notes, theme preferences, and
        study quota on your device. We do not require an account.
      </Text>
      <Text style={[styles.p, { color: theme.textMuted }]}>
        If you enable Premium purchases, Apple/Google and RevenueCat process payment data according
        to their policies. If you enable optional AI study via your own API key, verse text is sent
        to that provider solely to generate study content.
      </Text>
      <Text style={[styles.p, { color: theme.textMuted }]}>
        Ads on the free tier may use device advertising identifiers per AdMob policies. Premium
        removes ads.
      </Text>
      <Text style={[styles.p, { color: theme.textMuted }]}>
        Contact the publisher to request deletion of any server-side purchase records associated
        with your store account.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },
  h: { fontFamily: fonts.display, fontSize: 28, marginBottom: 14 },
  p: { fontFamily: fonts.body, fontSize: 15, lineHeight: 24, marginBottom: 14 },
});
