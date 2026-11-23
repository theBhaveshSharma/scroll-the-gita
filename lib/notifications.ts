import { Platform } from 'react-native';

import { getStrings } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';

export async function ensureNotificationPermission() {
  if (Platform.OS === 'web') return false;
  try {
    const Notifications = await import('expo-notifications');
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    const asked = await Notifications.requestPermissionsAsync();
    return asked.granted;
  } catch {
    return false;
  }
}

export async function scheduleDailyReminder(hour: number, minute: number) {
  if (Platform.OS === 'web') return null;
  try {
    const Notifications = await import('expo-notifications');
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    const ok = await ensureNotificationPermission();
    if (!ok) return null;

    await Notifications.cancelAllScheduledNotificationsAsync();

    const t = getStrings(useAppStore.getState().language);

    return Notifications.scheduleNotificationAsync({
      content: {
        title: t.reminderTitle,
        body: t.reminderBody,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  } catch {
    return null;
  }
}

export async function cancelReminders() {
  if (Platform.OS === 'web') return;
  try {
    const Notifications = await import('expo-notifications');
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // ignore
  }
}
