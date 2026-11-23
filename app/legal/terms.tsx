import { ScrollView, StyleSheet, Text } from 'react-native';

import { fonts } from '@/constants/theme';
import { useAppTheme } from '@/lib/useAppTheme';

export default function TermsScreen() {
  const theme = useAppTheme();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={styles.content}>
      <Text style={[styles.h, { color: theme.text }]}>Terms of Use</Text>
      <Text style={[styles.p, { color: theme.textMuted }]}>
        Scroll the Bhagavad Gita provides the sacred text for personal study and reflection. Translations
        bundled in the app are public-domain or free-to-quote editions (including Shri Purohit Swami
        and Swami Sivananda). The Sanskrit text is an ancient work not subject to copyright.
      </Text>
      <Text style={[styles.p, { color: theme.textMuted }]}>
        Study explanations may be guided templates or optional AI-assisted text and are not a
        substitute for traditional teaching or scholarly commentary.
      </Text>
      <Text style={[styles.p, { color: theme.textMuted }]}>
        Premium subscriptions and lifetime unlocks are billed through the App Store or Google Play
        and renew or restore according to store rules. Free features may include advertisements and
        a daily limit on certain study tools.
      </Text>
      <Text style={[styles.p, { color: theme.textMuted }]}>
        The app is provided as-is, without warranty. Use respectfully.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },
  h: { fontFamily: fonts.display, fontSize: 28, marginBottom: 14 },
  p: { fontFamily: fonts.body, fontSize: 15, lineHeight: 24, marginBottom: 14 },
});
