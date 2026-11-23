import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { VerseCardShare } from '@/components/VerseCardShare';
import { fonts } from '@/constants/theme';
import { getVerseById } from '@/lib/gita';
import { useI18n } from '@/lib/i18n';
import { useAppTheme } from '@/lib/useAppTheme';

export default function CardModal() {
  const theme = useAppTheme();
  const { t } = useI18n();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const verse = id ? getVerseById(id) : undefined;

  if (!verse) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: theme.text, fontFamily: fonts.body }}>{t.verseNotFound}</Text>
      </View>
    );
  }

  return <VerseCardShare verse={verse} />;
}
