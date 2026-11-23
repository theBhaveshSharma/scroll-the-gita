import { useAppStore } from '@/lib/store';

export const PREMIUM_ENTITLEMENT = 'premium';
export const PRODUCT_IDS = {
  monthly: 'gita_premium_monthly',
  lifetime: 'gita_premium_lifetime',
};

/**
 * Expo Go / local unlock path.
 * Wire RevenueCat in a development build when ready for store purchases.
 */
export async function initPremium() {}

export async function refreshPremiumStatus() {
  return useAppStore.getState().isPremium;
}

export async function purchasePackage(_kind: 'monthly' | 'lifetime') {
  useAppStore.getState().setPremium(true);
  return { ok: true as const, mock: true as const };
}

export async function restorePurchases() {
  return useAppStore.getState().isPremium;
}
