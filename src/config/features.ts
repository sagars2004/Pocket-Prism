/**
 * Feature Flags Configuration
 * 
 * Control which features/integrations are enabled via environment variables.
 * This allows gradual rollout of new integrations.
 */

export const features = {
  /**
   * Enable WorkOS authentication
   * Set ENABLE_WORKOS=true in environment
   */
  workosAuth: process.env.ENABLE_WORKOS === 'true' || false,

  /**
   * Enable Convex database
   * Set ENABLE_CONVEX=true in environment
   */
  convexDatabase: process.env.ENABLE_CONVEX === 'true' || false,

  /**
   * Enable Capacitor native features
   * Set ENABLE_CAPACITOR=true in environment
   */
  capacitorNative: process.env.ENABLE_CAPACITOR === 'true' || false,

  /**
   * Enable Replit integrations (DB, AI, etc.)
   * Set ENABLE_REPLIT=true in environment
   */
  replitIntegration: process.env.ENABLE_REPLIT === 'true' || true, // Default enabled for MVP
};

/**
 * Get the active storage provider based on feature flags
 */
export function getActiveStorageProvider(): 'localStorage' | 'convex' | 'workos' | 'replit' {
  if (features.convexDatabase) {
    return 'convex';
  }
  if (features.workosAuth) {
    return 'workos';
  }
  if (features.replitIntegration) {
    return 'replit';
  }
  return 'localStorage';
}
