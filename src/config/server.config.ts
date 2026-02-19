/**
 * Server-only configuration
 * Contains sensitive information and secrets
 * NEVER import this in client components
 */

export const SERVER_CONFIG = {
    // Environment
    nodeEnv: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
} as const;

