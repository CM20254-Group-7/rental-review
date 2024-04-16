import { Database } from '@repo/supabase';
import {
  SupabaseClient,
  createClient as createSupabaseClient,
} from '@supabase/supabase-js';

const createClient = (): SupabaseClient<
  Database,
  'public',
  Database['public']
> =>
  createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

export default createClient;
