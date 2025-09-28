/**
 * Environment Variables Configuration
 * 
 * This module provides type-safe access to all environment variables used throughout the application.
 * It ensures all required environment variables are present and properly typed.
 */

interface EnvironmentVariables {
  // Database Configuration
  DATABASE_URL: string;
  
  // NextAuth Configuration
  NEXTAUTH_SECRET: string;
  
  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  
  // GitHub OAuth Configuration  
  GITHUB_ID: string;
  GITHUB_SECRET: string;
  
  // Node Environment
  NODE_ENV: 'development' | 'production' | 'test';
}

/**
 * Validates and returns environment variables with proper typing
 * Throws an error if any required environment variable is missing
 */
function getEnvVars(): EnvironmentVariables {
  const requiredEnvVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET', 
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GITHUB_ID',
    'GITHUB_SECRET'
  ] as const;

  // Check for missing required environment variables
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please ensure all required environment variables are set in your .env file.'
    );
  }

  return {
    DATABASE_URL: process.env.DATABASE_URL!,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
    GITHUB_ID: process.env.GITHUB_ID!,
    GITHUB_SECRET: process.env.GITHUB_SECRET!,
    NODE_ENV: (process.env.NODE_ENV as EnvironmentVariables['NODE_ENV']) || 'development'
  };
}

/**
 * Type-safe environment variables object
 * Use this instead of accessing process.env directly
 */
export const env = getEnvVars();

/**
 * Environment variable categories for better organization
 */
export const envCategories = {
  database: {
    DATABASE_URL: env.DATABASE_URL
  },
  auth: {
    NEXTAUTH_SECRET: env.NEXTAUTH_SECRET
  },
  oauth: {
    google: {
      GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET
    },
    github: {
      GITHUB_ID: env.GITHUB_ID,
      GITHUB_SECRET: env.GITHUB_SECRET
    }
  },
  app: {
    NODE_ENV: env.NODE_ENV
  }
} as const;

/**
 * Utility to check if we're in development environment
 */
export const isDevelopment = env.NODE_ENV === 'development';

/**
 * Utility to check if we're in production environment  
 */
export const isProduction = env.NODE_ENV === 'production';

/**
 * Export the type for use in other files
 */
export type { EnvironmentVariables };