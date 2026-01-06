// Supabase client configuration
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// In test environment, use mock if credentials not provided
if (!supabaseUrl || !supabaseKey) {
  if (process.env.NODE_ENV === 'test') {
    console.warn('Using mock Supabase client for tests');
    module.exports = {
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: (data) => ({
          select: () => ({
            single: () => Promise.resolve({ data: data, error: null })
          })
        }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null }),
        eq: function() { return this; },
        single: () => Promise.resolve({ data: null, error: null })
      })
    };
  } else {
    throw new Error('Missing Supabase environment variables. Please set SUPABASE_URL and SUPABASE_ANON_KEY in .env file');
  }
} else {
  const supabase = createClient(supabaseUrl, supabaseKey);
  module.exports = supabase;
}

