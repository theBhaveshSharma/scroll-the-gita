import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { fonts } from '@/constants/theme';
import { useI18n } from '@/lib/i18n';
import { useAppTheme } from '@/lib/useAppTheme';

export default function TabLayout() {
  const theme = useAppTheme();
  const { t } = useI18n();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.border,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.bodyMedium,
          fontSize: 11,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t.tabScroll,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size ?? 24} color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="quiet"
        options={{
          title: t.tabQuiet,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="leaf-outline" size={size ?? 24} color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: t.tabLibrary,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmark-outline" size={size ?? 24} color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t.tabSettings,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size ?? 24} color={String(color)} />
          ),
        }}
      />
    </Tabs>
  );
}
