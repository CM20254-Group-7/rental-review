'use server';

import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@repo/supabase-client-helpers/server-only';

const signOut = async () => {
  const supabase = createServerSupabaseClient();

  await supabase.auth.signOut();
  redirect('/login');
};

export default signOut;
