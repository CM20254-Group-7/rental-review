import { Database } from '../database.types';
import {
  SupabaseClient,
  createClient as createSupabaseClient,
} from '@supabase/supabase-js';
import env from '@repo/environment-variables/supabase-client';

const createClient = (): SupabaseClient<
  Database,
  'public',
  Database['public']
> =>
  createSupabaseClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

export default createClient;
