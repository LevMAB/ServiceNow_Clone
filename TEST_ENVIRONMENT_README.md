# ⚠️ TEST ENVIRONMENT CONFIGURATION ⚠️

## CRITICAL WARNING
This configuration contains **TEMPORARY** test-only authentication bypass functionality that **MUST BE REMOVED** before production deployment.

## Test Admin Access

### Credentials (TEST ONLY)
- **Email**: `test-admin@localhost.dev`
- **Password**: `TEST_ONLY_BYPASS_2025`
- **Role**: Admin (full access)

### Environment Variables Required
```bash
NODE_ENV=development
TEST_MODE=true
ENABLE_TEST_BYPASS=true
```

## Security Features

### 1. Environment Validation
- Only works in `development` environment
- Requires explicit `TEST_MODE=true` flag
- Requires explicit `ENABLE_TEST_BYPASS=true` flag

### 2. Expiration Protection
- **Expires**: February 1, 2025
- Automatically disables after expiration
- Logs expiration warnings

### 3. Production Safety
- Production safety check prevents startup if test code detected
- Multiple validation layers
- Comprehensive error logging

### 4. Usage Logging
All test bypass usage is logged with:
- Timestamp
- Action performed
- Environment details
- Security warnings

## Files Created/Modified

### New Files (REMOVE BEFORE PRODUCTION)
- `backend/src/config/testConfig.ts` - **DELETE THIS FILE**
- `backend/src/config/productionSafetyCheck.ts` - Keep for safety
- `TEST_ENVIRONMENT_README.md` - **DELETE THIS FILE**

### Modified Files
- `backend/src/routes/authRoutes.ts` - Remove test bypass code
- `backend/src/middleware/auth.ts` - Remove test bypass code
- `backend/src/index.ts` - Remove test warnings
- `backend/.env.example` - Remove test variables

## REMOVAL CHECKLIST (BEFORE PRODUCTION)

### 1. Delete Files
- [ ] Delete `backend/src/config/testConfig.ts`
- [ ] Delete `TEST_ENVIRONMENT_README.md`

### 2. Clean Code
- [ ] Remove test bypass imports from `authRoutes.ts`
- [ ] Remove test bypass logic from `authRoutes.ts`
- [ ] Remove test bypass imports from `auth.ts`
- [ ] Remove test bypass logic from `auth.ts`
- [ ] Remove test warnings from `index.ts`

### 3. Environment Variables
- [ ] Set `NODE_ENV=production`
- [ ] Remove `TEST_MODE` variable
- [ ] Remove `ENABLE_TEST_BYPASS` variable

### 4. Verification
- [ ] Run production safety check
- [ ] Verify no test code remains
- [ ] Test production build
- [ ] Confirm no test warnings in logs

## Usage Instructions

### 1. Enable Test Environment
```bash
# In backend/.env
NODE_ENV=development
TEST_MODE=true
ENABLE_TEST_BYPASS=true
```

### 2. Start Application
```bash
npm run dev
```

### 3. Login with Test Admin
- Navigate to login page
- Use test credentials above
- Full admin access granted

### 4. Monitor Logs
Watch console for test bypass usage logs and warnings.

## Security Audit Trail

All test bypass usage is logged for security auditing:
- Login attempts
- Token generation
- Middleware bypass
- Route access

## REMEMBER: REMOVE BEFORE PRODUCTION! 🚨