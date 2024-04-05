import { createServerSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import Link from 'next/link';
import { FC } from 'react';
import UserManagementButton from './UserManagementButton';

const AuthButton: FC = async () => {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) return <UserManagementButton email={user.email!} />;

  return (
    <Link
      href='/login'
      className='py-2 px-3 text-lg flex rounded-md no-underline hover:bg-primary/20 border hover:shadow-sm hover:shadow-primary/20 transition-all text-accent'
    >
      Login / Signup
    </Link>
  );
};

export default AuthButton;
