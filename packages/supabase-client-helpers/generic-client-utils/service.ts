import { Database } from '@repo/supabase';
import {
  SupabaseClient,
  createClient as createSupabaseClient,
} from '@supabase/supabase-js';

// Ensure that any component that accesses the service client is only accessable on the server
import 'server-only';

const createClient = (): SupabaseClient<
  Database,
  'public',
  Database['public']
> =>
  createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );

export default createClient;
