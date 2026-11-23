/**
 * Minimal theme helpers kept for compatibility with the Expo template.
 */
import { Text as DefaultText, View as DefaultView, type TextProps, type ViewProps } from 'react-native';

import { useAppTheme } from '@/lib/useAppTheme';

export function Text(props: TextProps) {
  const theme = useAppTheme();
  const { style, ...other } = props;
  return <DefaultText style={[{ color: theme.text }, style]} {...other} />;
}

export function View(props: ViewProps) {
  const theme = useAppTheme();
  const { style, ...other } = props;
  return <DefaultView style={[{ backgroundColor: theme.background }, style]} {...other} />;
}
