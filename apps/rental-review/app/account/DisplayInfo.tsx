'use server';

import { createServerSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import Link from 'next/link';
import { FC } from 'react';

const GetInfo: FC = async () => {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className='flex items-center gap-4'>
      Email:
      {user.email}
    </div>
  ) : (
    <Link
      href='/login'
      className='bg-btn-background hover:bg-btn-background-hover flex rounded-md px-3 py-2 no-underline'
    >
      Login
    </Link>
  );
};

export default GetInfo;
