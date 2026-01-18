# Quick Start Guide

Get PocketPrism running in 3 minutes!

## Prerequisites Check

- ✅ Node.js installed (`node --version`)
- ✅ npm installed (`npm --version`)
- ✅ For iOS testing: Mac with Xcode (or use Expo Go on iPhone)
- ✅ For Android testing: Android Studio (or use Expo Go on Android phone)

## Step 1: Install Dependencies

```bash
npm install
```

This installs all required packages (Expo, React Native, React Navigation, etc.)

## Step 2: Start Development Server

```bash
npm start
```

You'll see a QR code and options to:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web browser
- Scan QR code with Expo Go app

## Step 3: Choose Your Testing Method

### Option A: Test on Your iPhone (Recommended for First Test)

1. Install **Expo Go** app from App Store
2. Make sure iPhone and computer are on same WiFi
3. Open Camera app and scan the QR code
4. App opens in Expo Go automatically!

### Option B: Test in iOS Simulator (Mac Only)

1. Have Xcode installed (free from Mac App Store)
2. Press `i` in the terminal where `npm start` is running
3. iOS Simulator opens automatically
4. App loads in simulator

### Option C: Test in Web Browser (Quick UI Check)

1. Press `w` in the terminal
2. Browser opens automatically
3. Use browser dev tools to set mobile viewport:
   - Chrome: Cmd+Shift+M (Mac) or Ctrl+Shift+M (Windows)
   - Set device to "iPhone SE" or custom 375×667

## What to Test First

1. **Welcome Screen** - Should show friendly greeting
2. **Onboarding** - Complete all 4 steps:
   - Enter a test salary (e.g., $75,000)
   - Select pay frequency (Monthly)
   - Pick a state (any state)
   - Choose living situation
   - Complete onboarding
3. **Dashboard** - Should show take-home pay estimate
4. **Tradeoff Cards** - Browse through 3 example cards
5. **Paycheck Breakdown** - View detailed breakdown

## Troubleshooting

### "Cannot connect to Metro bundler"
- Make sure you ran `npm install` first
- Check that port 8081 is not in use
- Try `npm start -- --reset-cache`

### "Expo Go can't connect"
- Ensure phone and computer are on same WiFi
- Try `npx expo start --tunnel` for remote access
- Restart both Expo Go app and dev server

### "Module not found" errors
```bash
rm -rf node_modules
npm install
npm start -- --clear
```

### iOS Simulator won't open
```bash
# Open Simulator manually
open -a Simulator

# Then start Expo
npm start
# Press 'i' when ready
```

## Next Steps

- Read [docs/TESTING.md](docs/TESTING.md) for comprehensive testing guide
- Check [docs/FUTURE_INTEGRATIONS.md](docs/FUTURE_INTEGRATIONS.md) for planned features
- See [README.md](README.md) for full documentation

## Need Help?

- Expo Docs: https://docs.expo.dev/
- React Native Docs: https://reactnative.dev/
- Project Issues: Check the testing guide for common problems
