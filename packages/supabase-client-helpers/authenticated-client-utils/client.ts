import { createBrowserClient } from '@supabase/ssr';
import { Database } from '../database.types';
import { SupabaseClient } from '@supabase/supabase-js';
import env from '@repo/environment-variables/supabase-client';

type a = Database['public'];

const createClient = (): SupabaseClient<
  Database,
  'public',
  Database['public']
> =>
  createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

export default createClient;
