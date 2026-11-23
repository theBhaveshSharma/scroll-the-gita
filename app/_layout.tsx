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
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

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

  if (!loaded) return null;

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const theme = useAppTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.background }}>
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
    </GestureHandlerRootView>
  );
}
