import { Database } from '@repo/supabase';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const createClient = () =>
  createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

export default createClient;
