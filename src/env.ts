/**
 * Validates that all required environment variables are present
 * Throws an error if any required variables are missing
 * 
 * Note: Currently no environment variables are strictly required:
 * - VITE_API_BASE_URL and VITE_WS_BASE_URL have fallback values in config.ts
 * - Firebase configuration is checked in firebase.ts and gracefully handles missing config
 * 
 * This function is kept as a placeholder for future required environment variables.
 */
export function validateEnv(): void {
  // Currently no required environment variables
  // Add required variables here if needed in the future
}

/**
 * Gets a validated environment variable
 * @param key - The environment variable key
 * @returns The environment variable value
 */
export function getEnv(key: string): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

/**
 * Gets an optional environment variable with a default value
 * @param key - The environment variable key
 * @param defaultValue - The default value if not set
 * @returns The environment variable value or default
 */
export function getEnvOr(key: string, defaultValue: string): string {
  return import.meta.env[key] || defaultValue;
}

/**
 * Checks if the app is running in development mode
 */
export function isDevelopment(): boolean {
  return import.meta.env.DEV;
}

/**
 * Checks if the app is running in production mode
 */
export function isProduction(): boolean {
  return import.meta.env.PROD;
}
