import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://replace-me-with-your-project.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'replace_me_with_your_anon_key';

export const supabase = createClient(supabaseUrl, supabaseKey);
