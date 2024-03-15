import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/supabase.types';

const createClient = () => createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default createClient;
