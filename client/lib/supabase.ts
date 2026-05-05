import { createBrowserClient, createServerClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = typeof window !== 'undefined'
  ? createBrowserClient(supabaseUrl, supabaseKey)
  : createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() { return [] },
        setAll() {}
      }
    });
