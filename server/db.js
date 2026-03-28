const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn("⚠️ WARNING: Missing SUPABASE_URL or SUPABASE_ANON_KEY in server environment.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
