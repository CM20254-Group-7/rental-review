import React from 'react';
import { VercelToolbar } from '@vercel/toolbar/next';
import { cookies } from 'next/headers';
import createClient from '@/utils/supabase/server';

const Toolbar: React.FC = async () => {
  const environment = process.env.VERCEL_ENV || 'development';
  const isProduction = environment === 'production';

  if (!isProduction) return <VercelToolbar />;

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // TODO: Check if user is admin & show the toolbar if they are
  const userIsAdmin = false;

  if (userIsAdmin) return <VercelToolbar />;
  return null;
};

export default Toolbar;
