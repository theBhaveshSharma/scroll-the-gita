import {
  CormorantGaramond_500Medium_Italic,
  CormorantGaramond_600SemiBold,
} from '@expo-google-fonts/cormorant-garamond';
import {
  Literata_400Regular,
  Literata_500Medium,
  Literata_600SemiBold,
} from '@expo-google-fonts/literata';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { palette } from '@/constants/theme';
import { initAds } from '@/lib/ads';
import { initPremium } from '@/lib/premium';
import { useAppTheme } from '@/lib/useAppTheme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  anchor: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    CormorantGaramond_600SemiBold,
    CormorantGaramond_500Medium_Italic,
    Literata_400Regular,
    Literata_500Medium,
    Literata_600SemiBold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (!loaded) return;
    SplashScreen.hideAsync();
    initPremium();
    initAds();
  }, [loaded]);

  if (!loaded) {
    return <View style={[styles.fill, { backgroundColor: palette.parchment }]} />;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const theme = useAppTheme();

  const shellBg = Platform.OS === 'web' ? theme.backgroundElevated : theme.background;

  return (
    <GestureHandlerRootView style={[styles.fill, { backgroundColor: shellBg }]}>
      <View
        style={[
          styles.fill,
          styles.appFrame,
          { backgroundColor: theme.background },
          Platform.OS === 'web' && styles.webFrame,
          Platform.OS === 'web' && { borderColor: theme.border },
        ]}>
        <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: theme.backgroundElevated },
            headerTintColor: theme.text,
            headerTitleStyle: { fontFamily: 'Literata_600SemiBold' },
            contentStyle: { backgroundColor: theme.background },
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="study"
            options={{
              presentation: 'modal',
              headerShown: false,
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name="card"
            options={{ presentation: 'modal', title: 'Verse Card', headerShown: true }}
          />
          <Stack.Screen name="premium" options={{ presentation: 'modal', title: 'Premium' }} />
          <Stack.Screen name="legal/privacy" options={{ title: 'Privacy Policy' }} />
          <Stack.Screen name="legal/terms" options={{ title: 'Terms of Use' }} />
        </Stack>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  appFrame: { overflow: 'hidden', width: '100%' },
  webFrame: {
    maxWidth: 430,
    alignSelf: 'center',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
});
