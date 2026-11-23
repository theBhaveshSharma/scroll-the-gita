import { StyleSheet, Text, View } from 'react-native';

import { fonts } from '@/constants/theme';
import { shouldShowAds } from '@/lib/ads';
import { useI18n } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';
import { useAppTheme } from '@/lib/useAppTheme';

export function AdBanner() {
  const theme = useAppTheme();
  const { t } = useI18n();
  const isPremium = useAppStore((s) => s.isPremium);

  if (!shouldShowAds() || isPremium) return null;

  return (
    <View
      style={[
        styles.placeholder,
        { backgroundColor: theme.backgroundElevated, borderColor: theme.border },
      ]}>
      <Text style={{ color: theme.textMuted, fontFamily: fonts.body, fontSize: 12 }}>
        {t.adPlaceholder}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
