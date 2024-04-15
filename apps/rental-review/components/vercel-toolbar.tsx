import React from 'react';
// import { VercelToolbar } from '@vercel/toolbar/next';
import { createServerSupabaseClient } from '@repo/supabase-client-helpers/server-only';

const { VercelToolbar } = await import('@vercel/toolbar/next');

const Toolbar: React.FC = async () => {
  const environment = process.env.VERCEL_ENV || 'development';
  const isProduction = environment === 'production';

  if (!isProduction) return <VercelToolbar />;

  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // TODO: Check if user is admin & show the toolbar if they are
  const userIsAdmin = false;

  if (userIsAdmin) return <VercelToolbar />;
  return null;
};

export default Toolbar;
