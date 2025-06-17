import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// ⚠️ COMMENTED OUT FOR TESTING - UNCOMMENT FOR PRODUCTION ⚠️
// if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
//   throw new Error('Missing Supabase credentials');
// }

// Check if we should use mock database
const useMockDB = process.env.USE_MOCK_DB === 'true';

if (useMockDB) {
  console.warn('🔧 --- Using MOCK Supabase Client for Testing ---');
  console.warn('⚠️  Set USE_MOCK_DB=false in production!');
  
  // Import and export mock client
  const { mockSupabaseClient } = require('../mock-db/mockSupabaseClient');
  module.exports = { supabase: mockSupabaseClient };
} else {
  // Use real Supabase client
  console.log('🔗 Using Real Supabase Client');
  
  // ⚠️ COMMENTED OUT FOR TESTING - UNCOMMENT FOR PRODUCTION ⚠️
  // Temporarily use placeholder values for testing
  const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';
  
  export const supabase = createClient(supabaseUrl, supabaseKey);
}