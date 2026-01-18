# Testing Guide for PocketPrism

This guide covers all the ways you can test the PocketPrism app during development.

## Quick Start Testing

### 1. Expo Go (Easiest - Physical Device)

Test on your iPhone or iPad immediately without any build setup:

```bash
# Start the development server
npm start

# Scan the QR code with:
# - iPhone: Camera app (iOS 11+)
# - Android: Expo Go app
```

**Prerequisites:**
- Install **Expo Go** app from App Store on your iOS device
- Make sure your phone and computer are on the same WiFi network
- Open Camera app and scan the QR code from terminal

**Pros:**
- ✅ Fastest way to test
- ✅ No build required
- ✅ Works on real device

**Cons:**
- ❌ Some native modules might not work
- ❌ Not suitable for TestFlight submission
- ❌ Performance may differ from production

---

### 2. iOS Simulator (Recommended for Development)

Test on a simulated iPhone on your Mac:

```bash
# Start the development server
npm start

# In another terminal, or press 'i' in Expo CLI
npm run ios

# Or open iOS Simulator manually
npx expo start --ios
```

**Prerequisites:**
- macOS with Xcode installed
- iOS Simulator (comes with Xcode)

**Pros:**
- ✅ Native iOS environment
- ✅ Fast refresh
- ✅ Debugging tools available
- ✅ Can simulate different iPhone models

**Cons:**
- ❌ Mac-only
- ❌ Performance differs from real device
- ❌ Can't test device features (camera, etc.)

**Available Simulators:**
- iPhone SE (375×667) - Good for testing smallest screen
- iPhone 14 Pro (393×852) - Modern standard
- iPhone 15 Pro Max (430×932) - Largest screen

---

### 3. Web Browser (Quick UI Testing)

Test the app in a browser for quick iteration:

```bash
# Start development server
npm start

# Press 'w' in Expo CLI, or:
npm run web
```

**Pros:**
- ✅ Fastest iteration
- ✅ Browser dev tools
- ✅ Easy debugging

**Cons:**
- ❌ Not native mobile experience
- ❌ Some React Native features may not work
- ❌ Performance differs significantly

**Note:** Use this mainly for UI tweaks and debugging, not final testing.

---

### 4. Replit Preview (When Imported to Replit)

When you import this project to Replit:

1. **Replit's Built-in Preview:**
   - Use Replit's web preview feature
   - Test mobile viewport using browser dev tools
   - Set viewport to iPhone size (375×667)

2. **Replit Mobile Emulator:**
   - Some Replit environments offer mobile emulators
   - Check Replit's mobile preview options

**Pros:**
- ✅ Works directly in Replit
- ✅ No local setup needed

**Cons:**
- ❌ Limited compared to native testing
- ❌ May not reflect actual iOS behavior

---

## Advanced Testing Methods

### 5. Development Build (Closer to Production)

Create a development build with all native modules:

```bash
# Install EAS CLI globally (if not already)
npm install -g eas-cli

# Login to Expo account
eas login

# Build development client for iOS
eas build --profile development --platform ios

# Install on device via TestFlight or direct install
```

**Prerequisites:**
- Expo account (free)
- Apple Developer account (for TestFlight)

**Pros:**
- ✅ Includes all native modules
- ✅ Closer to production experience
- ✅ Can install on physical device

**Cons:**
- ❌ Requires build time
- ❌ More complex setup

---

### 6. TestFlight (Production Testing)

Deploy to TestFlight for beta testing:

```bash
# Configure app.json with proper iOS settings
# (Already configured in this project)

# Build for TestFlight
eas build --profile production --platform ios

# Submit to App Store Connect
eas submit --platform ios

# Or manually upload via App Store Connect
```

**Prerequisites:**
- Apple Developer Program membership ($99/year)
- App Store Connect access
- App configured in App Store Connect

**Pros:**
- ✅ Real production environment
- ✅ Can share with testers
- ✅ Closest to App Store experience

**Cons:**
- ❌ Requires Apple Developer account
- ❌ Build and review time
- ❌ More complex process

---

## Testing Checklist

### Functional Testing

- [ ] **Onboarding Flow**
  - [ ] All 4 onboarding screens load correctly
  - [ ] Progress indicator updates properly
  - [ ] Form validation works (salary, state selection)
  - [ ] Can navigate back and forward
  - [ ] Data persists through navigation

- [ ] **Dashboard**
  - [ ] Take-home pay displays correctly
  - [ ] Greeting shows properly
  - [ ] Action buttons navigate to correct screens
  - [ ] Calculations match expected values (placeholder)

- [ ] **Tradeoff Cards**
  - [ ] Cards display with correct data
  - [ ] Can navigate between cards (Previous/Next)
  - [ ] Pros/cons list correctly
  - [ ] Monetary impact displays properly
  - [ ] Footer text shows

- [ ] **Paycheck Breakdown**
  - [ ] All sections display (Gross, Taxes, Benefits, Take-Home)
  - [ ] Values match dashboard estimates
  - [ ] Info text displays
  - [ ] Can navigate back

### UI/UX Testing

- [ ] **Mobile-First Design**
  - [ ] All screens fit on iPhone SE (375×667)
  - [ ] Touch targets are ≥44pt
  - [ ] Text is readable (≥16px base)
  - [ ] No horizontal scrolling

- [ ] **Navigation**
  - [ ] Smooth transitions between screens
  - [ ] Back navigation works correctly
  - [ ] No navigation errors
  - [ ] Route guards work (can't skip onboarding)

- [ ] **Styling**
  - [ ] Consistent color palette
  - [ ] Cards have proper shadows/spacing
  - [ ] Typography is consistent
  - [ ] Dark mode compatibility (if applicable)

### Device-Specific Testing

- [ ] **Different Screen Sizes**
  - [ ] iPhone SE (smallest)
  - [ ] iPhone 14 Pro (standard)
  - [ ] iPhone 15 Pro Max (largest)

- [ ] **Orientation**
  - [ ] Portrait only (as configured)
  - [ ] No layout breaks if rotated

- [ ] **Performance**
  - [ ] Fast refresh works
  - [ ] No lag during navigation
  - [ ] Smooth scrolling
  - [ ] Reasonable memory usage

---

## Troubleshooting

### Common Issues

#### "Unable to resolve module"
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm start -- --clear
```

#### "Metro bundler not starting"
```bash
# Kill any running Metro processes
killall node

# Start fresh
npm start -- --reset-cache
```

#### "Expo Go can't connect"
- Check that phone and computer are on same WiFi
- Try switching to Tunnel mode: `npx expo start --tunnel`
- Restart both Expo Go app and dev server

#### "iOS Simulator won't open"
```bash
# Open Simulator manually
open -a Simulator

# Then start Expo
npm start
# Press 'i' when prompted
```

#### "Build errors"
```bash
# Clear all caches
rm -rf node_modules
rm -rf .expo
npm install

# Rebuild
npm start -- --clear
```

---

## Testing on Replit

### Setup

1. Import repository to Replit
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm start
   ```

### Viewing in Replit

1. **Web Preview:**
   - Click "Open in new tab" on web preview
   - Use browser dev tools to set mobile viewport
   - Chrome DevTools: Toggle device toolbar (Cmd+Shift+M)

2. **Mobile Viewport Settings:**
   - Width: 375px (iPhone SE)
   - Height: 667px
   - Device pixel ratio: 2
   - User agent: iPhone

### Limitations in Replit

- Some React Native features may not work in web preview
- Native modules won't function
- Performance may differ
- Best for UI testing, not full functionality

---

## Recommended Testing Workflow

### Development Phase
1. **Start with Web Browser** - Quick UI tweaks
2. **Move to iOS Simulator** - Native testing and debugging
3. **Test on Real Device (Expo Go)** - Final UI/UX check

### Pre-Production
1. **Development Build** - Test native modules
2. **TestFlight** - Beta testing with real users

### Continuous Testing
- Test on multiple screen sizes during development
- Test navigation flows regularly
- Verify calculations with known test cases
- Check error handling

---

## Test Data

Use these test values for consistent testing:

```
Annual Salary: $75,000
Pay Frequency: Monthly
State: California
Living Situation: Living with Roommates
Major Expenses: Student Loans, Car Payment
Goals: Build Emergency Fund, Start Investing
```

Expected Results (placeholder calculations):
- Gross Pay (monthly): ~$6,250
- Take-Home (monthly): ~$4,400 (approximate, placeholder)

---

## Additional Resources

- [Expo Testing Guide](https://docs.expo.dev/develop/development-builds/introduction/)
- [React Native Testing](https://reactnative.dev/docs/testing-overview)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [TestFlight Guide](https://developer.apple.com/testflight/)
