'use server';

import createClient from '@/utils/supabase/server';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { FC } from 'react';

const GetInfo: FC = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className='flex items-center gap-4'>
      Email:
      {' '}
      {user.email}
    </div>
  ) : (
    <Link
      href='/login'
      className='py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover'
    >
      Login
    </Link>
  );
};

export default GetInfo;
