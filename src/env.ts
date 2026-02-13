/**
 * Validates that all required environment variables are present
 * Throws an error if any required variables are missing
 */
export function validateEnv(): void {
  const required = [
    'VITE_API_BASE_URL',
    'VITE_WS_BASE_URL',
  ] as const;

  const missing: string[] = [];

  for (const key of required) {
    if (!import.meta.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.join('\n')}\n\n` +
      'Please ensure all required environment variables are set in your .env file.'
    );
  }
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
