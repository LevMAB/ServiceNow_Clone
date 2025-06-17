/**
 * ⚠️  CRITICAL WARNING: TEST ENVIRONMENT CONFIGURATION ONLY ⚠️
 * 
 * This file contains TEMPORARY test-only authentication bypass functionality.
 * 
 * 🚨 SECURITY NOTICE:
 * - This bypass is ONLY for development/testing purposes
 * - MUST be removed before production deployment
 * - Contains hardcoded credentials for testing only
 * - All usage is logged for security auditing
 * 
 * REMOVAL PROCESS:
 * 1. Delete this entire file before production build
 * 2. Remove all imports of this file from other modules
 * 3. Remove TEST_MODE environment variable from production config
 * 4. Verify no test bypass code remains in production bundle
 * 
 * EXPIRATION: This bypass expires on 2025-02-01
 */

import { createHash } from 'crypto';

// Test environment configuration
export interface TestConfig {
  enabled: boolean;
  expirationDate: Date;
  adminBypass: {
    enabled: boolean;
    testToken: string;
    testUserId: string;
    testEmail: string;
  };
}

// ⚠️ HARDCODED TEST CREDENTIALS - REMOVE BEFORE PRODUCTION ⚠️
const TEST_ADMIN_EMAIL = 'test-admin@localhost.dev';
const TEST_ADMIN_PASSWORD = 'TEST_ONLY_BYPASS_2025';
const TEST_EXPIRATION = new Date('2025-02-01T00:00:00Z');

/**
 * ⚠️ WARNING: TEST-ONLY CONFIGURATION ⚠️
 * This configuration enables authentication bypass for testing purposes only.
 * MUST BE DISABLED IN PRODUCTION ENVIRONMENTS.
 */
export const testConfig: TestConfig = {
  enabled: process.env.NODE_ENV === 'development' && process.env.TEST_MODE === 'true',
  expirationDate: TEST_EXPIRATION,
  adminBypass: {
    enabled: process.env.NODE_ENV === 'development' && process.env.ENABLE_TEST_BYPASS === 'true',
    testToken: createHash('sha256').update(TEST_ADMIN_PASSWORD).digest('hex'),
    testUserId: 'test-admin-bypass-uuid',
    testEmail: TEST_ADMIN_EMAIL
  }
};

/**
 * Validates that test environment is properly configured and not expired
 * @returns {boolean} True if test environment is valid and not expired
 */
export function validateTestEnvironment(): boolean {
  // ⚠️ PRODUCTION SAFETY CHECK ⚠️
  if (process.env.NODE_ENV === 'production') {
    console.error('🚨 CRITICAL SECURITY ERROR: Test bypass attempted in production environment!');
    return false;
  }

  // Check if test mode is explicitly enabled
  if (!testConfig.enabled) {
    return false;
  }

  // Check expiration date
  const now = new Date();
  if (now > testConfig.expirationDate) {
    console.error('🚨 TEST BYPASS EXPIRED: Remove test bypass code immediately!');
    return false;
  }

  return true;
}

/**
 * ⚠️ TEST-ONLY FUNCTION ⚠️
 * Logs all test bypass usage for security auditing
 */
export function logTestBypassUsage(action: string, details: any = {}): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    action,
    environment: process.env.NODE_ENV,
    testMode: process.env.TEST_MODE,
    bypassEnabled: process.env.ENABLE_TEST_BYPASS,
    details,
    warning: '⚠️ TEST BYPASS USAGE - REMOVE BEFORE PRODUCTION ⚠️'
  };

  console.warn('🔓 TEST BYPASS USED:', JSON.stringify(logEntry, null, 2));
  
  // In a real application, you might want to write this to a separate log file
  // or send to a monitoring service for security auditing
}

/**
 * ⚠️ TEST-ONLY FUNCTION ⚠️
 * Checks if a request is using the test admin bypass
 */
export function isTestAdminBypass(email: string, password: string): boolean {
  if (!validateTestEnvironment() || !testConfig.adminBypass.enabled) {
    return false;
  }

  const isTestAdmin = email === testConfig.adminBypass.testEmail;
  const isValidPassword = createHash('sha256').update(password).digest('hex') === testConfig.adminBypass.testToken;

  if (isTestAdmin && isValidPassword) {
    logTestBypassUsage('TEST_ADMIN_LOGIN', { email });
    return true;
  }

  return false;
}

/**
 * ⚠️ TEST-ONLY FUNCTION ⚠️
 * Gets test admin user data for bypass authentication
 */
export function getTestAdminUser() {
  if (!validateTestEnvironment()) {
    throw new Error('Test environment not available');
  }

  return {
    id: testConfig.adminBypass.testUserId,
    email: testConfig.adminBypass.testEmail,
    role: 'admin'
  };
}

// ⚠️ STARTUP WARNING ⚠️
if (testConfig.enabled) {
  console.warn(`
🚨🚨🚨 TEST ENVIRONMENT ACTIVE 🚨🚨🚨
⚠️  Test bypass is ENABLED
⚠️  Expires: ${TEST_EXPIRATION.toISOString()}
⚠️  REMOVE before production deployment
⚠️  Test admin: ${TEST_ADMIN_EMAIL}
🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
  `);
}