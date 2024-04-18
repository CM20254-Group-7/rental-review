import { Database } from '@repo/supabase';
import {
  SupabaseClient,
  createClient as createSupabaseClient,
} from '@supabase/supabase-js';
import env from '@repo/environment-variables/supabase-client';

// Ensure that any component that accesses the service client is only accessable on the server
import 'server-only';

const createClient = (): SupabaseClient<
  Database,
  'public',
  Database['public']
> =>
  createSupabaseClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.SUPABASE_SERVICE_KEY!,
  );

export default createClient;
