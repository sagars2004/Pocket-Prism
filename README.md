# PocketPrism

A mobile-first iOS app built with Expo/React Native + TypeScript that helps new graduates and early-career professionals understand their first paycheck.

## Overview

PocketPrism translates salary, taxes, and benefits into plain English and helps users make early financial decisions confidently. The app features interactive Tradeoff Cards comparing options like living alone vs. roommates, saving vs. spending, and loan repayment strategies.

## Features

- **Onboarding Flow**: Collects salary, pay frequency, state, living situation, and financial goals
- **Dashboard**: Shows take-home pay estimate with action buttons
- **Tradeoff Cards**: Interactive cards showing decision tradeoffs with pros/cons and monetary impact
- **Paycheck Breakdown**: Detailed breakdown of gross pay, taxes, benefits, and take-home pay

## Tech Stack

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State Management**: React Context API
- **Styling**: React Native StyleSheet with custom theme system

### Planned Integrations

See [docs/FUTURE_INTEGRATIONS.md](docs/FUTURE_INTEGRATIONS.md) for details on planned integrations:
- **Capacitor**: Native iOS/Android capabilities
- **WorkOS**: Authentication and SSO
- **Convex**: Real-time backend database

## Replit Integration

This project is designed to work with Replit tools:

- **Replit Database**: For user data persistence (stubbed for MVP)
- **Replit AI**: For future dynamic tradeoff generation (stubbed for MVP)
- **Replit Preview**: For mobile viewport testing
- **Replit Secrets**: For configuration management

## Getting Started

### Prerequisites

- Node.js (v20.15.1 or higher recommended)
- npm or yarn
- Expo CLI (optional, included with `npx`)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS simulator (Mac only, requires Xcode)
npm run ios

# Run on Android emulator
npm run android

# Run in web browser
npm run web
```

## Testing the App

See [docs/TESTING.md](docs/TESTING.md) for comprehensive testing guide.

### Quick Testing Options

1. **Expo Go (Easiest)** - Test on your iPhone:
   ```bash
   npm start
   # Scan QR code with Camera app (iOS) or Expo Go app (Android)
   ```

2. **iOS Simulator** (Mac only):
   ```bash
   npm run ios
   ```

3. **Web Browser** (Quick UI testing):
   ```bash
   npm run web
   ```

4. **Replit Preview** - When imported to Replit, use the web preview with mobile viewport settings (375×667 for iPhone SE).

### TestFlight (Production Testing)

For TestFlight deployment, see the [Testing Guide](docs/TESTING.md#6-testflight-production-testing).

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard/      # Dashboard screen components
│   ├── Onboarding/     # Onboarding flow screens
│   ├── PaycheckBreakdown/  # Paycheck breakdown components
│   ├── Tradeoffs/      # Tradeoff cards components
│   └── shared/         # Shared reusable components
├── context/            # React Context providers
├── navigation/         # Navigation configuration
├── services/           # Business logic and integrations
│   ├── calculations/   # Paycheck and tradeoff calculations
│   ├── replit/        # Replit integrations (DB, AI, config)
│   ├── storage/       # Local storage utilities
│   ├── convex/        # Convex database (planned)
│   ├── workos/        # WorkOS authentication (planned)
│   └── capacitor/     # Capacitor native plugins (planned)
├── theme/             # Design system (colors, typography, spacing)
├── types/             # TypeScript type definitions
└── utils/             # Utility functions (formatters, placeholders)
```

## Development Notes

### Placeholder Logic

Currently, the app uses placeholder calculations for:
- Tax calculations (simplified estimates)
- Benefit deductions (placeholder percentages)
- Tradeoff generation (static dummy data)

These are clearly marked in the code and ready for future implementation with real tax logic and AI-generated tradeoffs.

### iOS Configuration

The app is configured for iOS deployment:
- Bundle ID: `com.pocketprism.app`
- Portrait orientation only
- iPhone-focused (tablet support disabled)

### TestFlight Deployment

To prepare for TestFlight:

1. Update `app.json` with proper iOS configuration
2. Set up EAS Build (Expo Application Services)
3. Configure App Store Connect
4. Build and submit via EAS

## License

Private - All rights reserved
