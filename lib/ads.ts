import { Platform } from 'react-native';

import { useAppStore } from '@/lib/store';

/** Test / placeholder unit — wire real AdMob IDs in a development build later. */
export const AD_UNIT_BANNER = 'placeholder';

export function shouldShowAds() {
  return !useAppStore.getState().isPremium && Platform.OS !== 'web';
}

export async function initAds() {
  // AdMob requires a custom development build. Expo Go shows a branded placeholder.
}
