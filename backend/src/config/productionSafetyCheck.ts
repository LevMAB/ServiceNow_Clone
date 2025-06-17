/**
 * Production Safety Check
 * 
 * This module performs critical safety checks to prevent test code
 * from running in production environments.
 */

import { testConfig } from './testConfig';

/**
 * Performs comprehensive production safety checks
 * Throws error if any test code is detected in production
 */
export function performProductionSafetyCheck(): void {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (!isProduction) {
    return; // Skip checks in non-production environments
  }

  const errors: string[] = [];

  // Check for test mode flags
  if (process.env.TEST_MODE === 'true') {
    errors.push('TEST_MODE is enabled in production');
  }

  if (process.env.ENABLE_TEST_BYPASS === 'true') {
    errors.push('ENABLE_TEST_BYPASS is enabled in production');
  }

  // Check if test config is accidentally enabled
  if (testConfig.enabled) {
    errors.push('Test configuration is enabled in production');
  }

  // Check for test bypass functionality
  if (testConfig.adminBypass.enabled) {
    errors.push('Test admin bypass is enabled in production');
  }

  // If any errors found, prevent application startup
  if (errors.length > 0) {
    const errorMessage = `
🚨🚨🚨 CRITICAL SECURITY ERROR 🚨🚨🚨
Test code detected in production environment!

Errors found:
${errors.map(error => `- ${error}`).join('\n')}

IMMEDIATE ACTION REQUIRED:
1. Remove all test bypass code
2. Set NODE_ENV=production
3. Remove or set TEST_MODE=false
4. Remove or set ENABLE_TEST_BYPASS=false
5. Delete test configuration files

APPLICATION STARTUP BLOCKED FOR SECURITY
🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
    `;

    console.error(errorMessage);
    throw new Error('Production security check failed - test code detected');
  }
}

/**
 * Validates environment configuration for production readiness
 */
export function validateProductionEnvironment(): boolean {
  try {
    performProductionSafetyCheck();
    return true;
  } catch (error) {
    return false;
  }
}