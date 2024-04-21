import { createServerSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import { FC } from 'react';
import UserManagementButton from './UserManagementButton';

// Pre-fetch the initial auth state on the server, and pass to client to allow updating as state changes
const AuthButton: FC = async () => {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <UserManagementButton email={user?.email} />;
};

export default AuthButton;
