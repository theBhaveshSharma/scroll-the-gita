# Store listing & release checklist

## Branding

- App name: **Scroll the Bhagavad Gita**
- Bundle ID iOS: `com.scrollthegita.app`
- Package Android: `com.scrollthegita.app`
- Replace `assets/images/icon.png`, adaptive icons, and splash with final art (parchment + saffron / deep night ink).

## Screenshots to capture

1. Full-screen verse feed (one shloka)
2. Chapter picker sheet
3. Study sheet — Sanskrit mode
4. Quiet Space prayers
5. Verse card (night + parchment)
6. Premium paywall

## Listing copy (draft)

**Subtitle:** Scroll the Bhagavad Gita, one verse at a time.

**Description:** Turn mindless scrolling into mindful reading. Scroll the Bhagavad Gita presents every shloka in a calm, full-screen vertical feed. Tap any verse for Sanskrit word study, plain-language explanations, deep study, and related passages. Quiet Space offers morning and evening prayers with gentle audio. Share beautiful verse cards. Free to read — Premium unlocks unlimited studies and removes ads.

## Monetization

| Product | Store ID (configure in App Store Connect / Play Console + RevenueCat) |
| --- | --- |
| Monthly | `gita_premium_monthly` |
| Lifetime | `gita_premium_lifetime` |
| Entitlement | `premium` |

Replace AdMob test app/unit IDs in `app.json` and `lib/ads.ts` before production.

## Legal

In-app Privacy Policy and Terms: `/legal/privacy`, `/legal/terms`. Host the same text on a public URL for store review.

## Build

```bash
npx eas-cli build --platform all
```

TestFlight + Play internal testing before production release.
