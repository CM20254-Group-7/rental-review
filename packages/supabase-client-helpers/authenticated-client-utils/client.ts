import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@repo/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

type a = Database['public'];

const createClient = (): SupabaseClient<
  Database,
  'public',
  Database['public']
> =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

export default createClient;
