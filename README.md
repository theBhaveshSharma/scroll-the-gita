# Scroll the Bhagavad Gita

A distraction-free Bhagavad Gita reader for iOS and Android — full-screen verse scrolling inspired by Scroll the Bible.

## Features

- **Vertical feed** — swipe verse-by-verse through all 18 chapters (~701 shlokas)
- **Study tools** — Deep Study, Sanskrit (IAST + word meanings), Explain It Easier, Related Passages
- **Quiet Space** — morning, evening, and classic prayers with TTS audio
- **Verse cards** — share night or parchment themed images
- **Free vs Premium** — free reading + limited daily studies (with ads); Premium unlocks unlimited studies, extra audio, and ad-free access

## Stack

Expo (React Native) + TypeScript + Expo Router + Zustand

## Run

```bash
npm install
npx expo start
```

Use **Expo Go** for the reader, Quiet Space, cards, and guided study. Premium/ads are stubbed in Expo Go (dev unlock in Settings). Real **RevenueCat** + **AdMob** need a later development build.

```bash
npx expo start --clear
```

Phone and computer must be on the same Wi‑Fi. Scan the QR code in Expo Go. If the phone can’t reach the packager, press `s` in the terminal for connection options, or run `npx expo login` then `npx expo start --tunnel`.

### Optional env

Create `.env` (see `.env.example`):

- `EXPO_PUBLIC_OPENAI_API_KEY` — optional AI study (falls back to guided offline text)
- `EXPO_PUBLIC_REVENUECAT_IOS_KEY` / `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY`

## Data

Bundled from [gita/gita](https://github.com/gita/gita) (Unlicense):

- English primary: Shri Purohit Swami (public domain)
- Fallback: Swami Sivananda
- Hindi: Swami Tejomayananda

Rebuild after refreshing raw exports:

```bash
# download raw-verse.json, raw-translation.json, raw-chapters.json into data/
python3 scripts/build-gita-data.py
```

## Store prep

See [docs/STORE.md](docs/STORE.md) for icons, listings, and monetization checklist.
