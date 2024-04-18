import React from 'react';
import { createServerSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import { get } from '@vercel/edge-config';
import env from '@repo/environment-variables/rental-review';

const { VercelToolbar } = await import('@vercel/toolbar/next');

const Toolbar: React.FC = async () => {
  const environment = env.VERCEL_ENV;
  const isProduction = environment === 'production';

  // Always show the toolbar in development & preview environments
  if (!isProduction) return <VercelToolbar />;

  // Show the toolbar to everyone if the "ToolbarAlwaysVisible" is set to true in the edge config
  const toolbarAlwaysVisible = await get('toolbarAlwaysVisible');
  if (toolbarAlwaysVisible) return <VercelToolbar />;

  // Finally, show the toolbar to logged in users who's email is listed in the "ToolbarUsers" edge config
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const toolbarUsers = await get('toolbarUsers');
  if (!Array.isArray(toolbarUsers) || !toolbarUsers.includes(user.email))
    return null;

  return <VercelToolbar />;
};

export default Toolbar;
