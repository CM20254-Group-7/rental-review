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
      className='hover:bg-primary/20 hover:shadow-primary/20 text-accent flex rounded-md border px-3 py-2 text-lg no-underline transition-all hover:shadow-sm'
    >
      Login / Signup
    </Link>
  );
};

export default AuthButton;
