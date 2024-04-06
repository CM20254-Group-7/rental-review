import { createServerSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import NavLink from '@/components/Header/NavLink';
import React from 'react';
import AuthButton from './AuthButton';
import HomeButton from './HomeButton';
import Help from './Help';

const NavBar: React.FC = async () => {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  let loggedIn = true;
  if (userError || !user) {
    loggedIn = false;
  }

  return (
    <nav className='w-full flex-none flex justify-center border-b shadow-md bg-primary/10 shadow-primary/10 h-16'>
      <div className='w-full max-w-[614px] md:max-w-[80%] flex items-center p-3 text-sm'>
        <HomeButton />
        <div className='flex-1 flex flex-row px-8 gap-4'>
          <NavLink text='Properties' href='/properties' />
          <NavLink text='Landlords' href='/profiles' />
          {loggedIn && <NavLink text='Dashboard' href='/dashboard' />}
          {/* Space for other links here */}
        </div>
        <AuthButton />
        <Help />
      </div>
    </nav>
  );
};

export default NavBar;
