# Future Integrations

This document outlines planned integrations for PocketPrism beyond the MVP.

## Capacitor

**Purpose**: Native iOS/Android capabilities and native plugin access

**Integration Points**:
- Replace or complement Expo for native iOS deployment
- Access native device features (camera, biometrics, etc.)
- Enable TestFlight and App Store deployment
- Use Capacitor plugins for enhanced functionality

**Structure Changes Needed**:
```
capacitor.config.ts          # Capacitor configuration
ios/                         # Native iOS project (generated)
android/                     # Native Android project (generated)
src/services/capacitor/      # Capacitor-specific service wrappers
```

**When to Integrate**:
- Before TestFlight submission
- When native features are needed (beyond Expo APIs)
- For App Store deployment

**Notes**:
- Can coexist with Expo initially (Expo dev client)
- Will require running `npx cap add ios` and `npx cap sync`
- Update build scripts in `package.json`

---

## WorkOS

**Purpose**: Authentication, SSO, user management

**Integration Points**:
- User authentication (email/password, social logins)
- Single Sign-On (SSO) for enterprise users
- User profile management
- Session management

**Structure Changes Needed**:
```
src/services/workos/
  ├── auth.ts              # WorkOS authentication service
  ├── sso.ts               # SSO configuration
  └── user.ts              # User profile management

src/context/
  └── AuthContext.tsx      # Authentication context (replaces/supplements UserContext)
```

**Current User Context**: 
- `UserContext.tsx` will be extended to integrate with WorkOS
- Local storage will sync with WorkOS user profiles
- Onboarding will be linked to user registration

**When to Integrate**:
- When authentication is required
- Before production launch
- When SSO is needed for enterprise customers

**Dependencies**:
```json
{
  "@workos-inc/node": "^x.x.x",
  "@workos-inc/authkit-react-native": "^x.x.x"
}
```

---

## Convex Database

**Purpose**: Real-time backend database and API

**Integration Points**:
- Replace Replit Database for production data storage
- Real-time data synchronization
- Server-side calculations and validations
- API endpoints for tradeoff generation

**Structure Changes Needed**:
```
convex/
  ├── schema.ts            # Convex schema definitions
  ├── user.ts              # User data mutations/queries
  ├── paycheck.ts          # Paycheck calculations
  ├── tradeoffs.ts         # Tradeoff generation
  └── _generated/          # Auto-generated Convex types

src/services/convex/
  ├── client.ts            # Convex client setup
  ├── hooks.ts             # Custom React hooks for Convex
  └── mutations.ts         # Mutation wrappers

src/hooks/
  ├── useUserData.ts       # Convex-backed user data hook
  └── useTradeoffs.ts      # Convex-backed tradeoffs hook
```

**Migration Path**:
1. Keep existing `localStorage` and `Replit DB` as fallbacks
2. Add Convex alongside current storage (feature flag)
3. Gradually migrate user data to Convex
4. Use Convex for real-time features (shared insights, etc.)

**When to Integrate**:
- When real-time sync is needed
- Before production launch
- When server-side calculations are required
- For collaborative features

**Dependencies**:
```json
{
  "convex": "^x.x.x",
  "@convex-dev/react-native": "^x.x.x"
}
```

---

## Integration Order & Strategy

### Phase 1: Authentication (WorkOS)
1. Integrate WorkOS for user authentication
2. Update UserContext to use WorkOS sessions
3. Migrate onboarding to authenticated flow
4. Test authentication flows

### Phase 2: Database (Convex)
1. Set up Convex project and schema
2. Create mutations/queries for user data
3. Migrate from local storage to Convex
4. Add real-time sync for user data

### Phase 3: Native (Capacitor)
1. Add Capacitor to project
2. Generate native iOS/Android projects
3. Configure native builds
4. Deploy to TestFlight/App Store

### Alternative: Parallel Development
- WorkOS and Convex can be integrated in parallel
- Capacitor should come after auth/database is stable
- Use feature flags to toggle between storage backends

---

## Architecture Considerations

### Service Layer Abstraction

Current structure allows easy swapping:
```typescript
// src/services/storage/
interface StorageService {
  saveUserData(data: UserData): Promise<void>;
  loadUserData(): Promise<UserData | null>;
}

// Implementations:
// - localStorage.ts (current)
// - convex.ts (future)
// - workos.ts (future, for user profiles)
```

### Context Strategy

```
AuthContext (WorkOS) 
  ↓
UserContext (extends AuthContext user data)
  ↓
OnboardingContext (temporary, saves to UserContext)
```

### Database Strategy

```
Development: AsyncStorage → Replit DB (optional)
Production: Convex Database
Fallback: LocalStorage (offline mode)
```

---

## Configuration Management

### Environment Variables

Create `.env.example`:
```
# WorkOS
WORKOS_CLIENT_ID=
WORKOS_API_KEY=

# Convex
CONVEX_DEPLOYMENT_URL=
NEXT_PUBLIC_CONVEX_URL=

# Capacitor
CAPACITOR_IOS_BUNDLE_ID=com.pocketprism.app
```

### Feature Flags

Use feature flags to gradually roll out integrations:
```typescript
// src/config/features.ts
export const features = {
  workosAuth: process.env.ENABLE_WORKOS === 'true',
  convexDatabase: process.env.ENABLE_CONVEX === 'true',
  capacitorNative: process.env.ENABLE_CAPACITOR === 'true',
};
```

---

## Testing Strategy

For each integration:
1. Create integration branch (`feature/workos-auth`)
2. Add integration behind feature flag
3. Test alongside existing functionality
4. Gradually migrate users/data
5. Remove old implementation after migration complete

---

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [WorkOS React Native SDK](https://workos.com/docs/user-management/react-native)
- [Convex React Native Guide](https://docs.convex.dev/client/react-native)
