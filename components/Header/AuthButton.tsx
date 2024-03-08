import createClient from '@/utils/supabase/server';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { FC } from 'react';
import UserManagementButton from './UserManagementButton';

const AuthButton: FC = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) return <UserManagementButton email={user.email!} id={user.id!} />;

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
