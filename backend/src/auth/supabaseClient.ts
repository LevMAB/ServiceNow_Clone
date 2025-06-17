import dotenv from 'dotenv';

dotenv.config();

// ⚠️ MOCK DATABASE INTEGRATION - REMOVE BEFORE PRODUCTION ⚠️
// This allows switching between real Supabase and an in-memory mock database for testing.
const USE_MOCK_DB = process.env.USE_MOCK_DB === 'true';

let supabaseClient: any;

if (USE_MOCK_DB) {
  console.warn('🔧 --- Using MOCK Supabase Client for Testing ---');
  console.warn('⚠️  All data is stored in memory and will reset on server restart');
  console.warn('⚠️  REMOVE mock database integration before production deployment');
  const { mockSupabase } = require('../mock-db/mockSupabaseClient'); // Use require to avoid TS issues with conditional import
  supabaseClient = mockSupabase;
} else {
  console.log('🔗 --- Using REAL Supabase Client ---');
  const { createClient } = require('@supabase/supabase-js'); // Use require
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase credentials');
  }
  supabaseClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export const supabase = supabaseClient;