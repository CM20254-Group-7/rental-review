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
    <nav className='bg-primary/10 shadow-primary/10 flex h-16 w-full flex-none justify-center border-b shadow-md'>
      <div className='flex w-full max-w-[614px] items-center p-3 text-sm md:max-w-[80%]'>
        <HomeButton />
        <div className='flex flex-1 flex-row gap-4 px-8'>
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
