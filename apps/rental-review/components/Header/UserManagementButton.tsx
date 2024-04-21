'use client';

import { UserCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
// import signOut from './actions';
import { createClientSupabaseClient } from '@repo/supabase-client-helpers';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../dropdown';
import { Button } from '../ClientTremor';

const UserManagementButton: React.FC<{ email: string | undefined }> = ({
  email: initialEmail,
}) => {
  const { refresh } = useRouter();
  const supabase = createClientSupabaseClient();
  const [email, setEmail] = useState(initialEmail);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setEmail(session?.user?.email);
      // refresh on sign out to reassert if page should be visible
      if (event === 'SIGNED_OUT' || event === 'SIGNED_IN') {
        refresh();
      }
    });

    return subscription.unsubscribe;
  }, [refresh, supabase]);

  if (!email)
    return (
      <Link
        href='/login'
        className='hover:bg-primary/20 hover:shadow-primary/20 text-accent flex rounded-md border px-3 py-2 text-lg no-underline transition-all hover:shadow-sm'
      >
        Login / Signup
      </Link>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='secondary' className='rounded-full'>
          <div className='text-accent mid:gap-2 flex flex-row items-center'>
            <p className='mid:flex md:hidden'>{email}</p>
            <UserCircleIcon className='h-6 w-6' />
            {/* <CircleUser className='h-5 w-5' /> */}
          </div>
          <span className='sr-only'>Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-background min-w-full p-0' asChild>
        <DropdownMenuGroup>
          {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
          {/* <DropdownMenuSeparator /> */}
          <DropdownMenuItem asChild>
            <Link
              href='/account'
              className='focus:bg-secondary/10 w-full border-b px-4 py-2 text-right no-underline'
            >
              Manage Account
            </Link>
          </DropdownMenuItem>
          {/* <DropdownMenuSeparator /> */}
          <DropdownMenuItem asChild>
            <button
              onClick={signOut}
              type='button'
              className='focus:bg-secondary/10 flex w-full justify-end border-b px-4 py-2 text-right no-underline'
            >
              Logout
            </button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserManagementButton;
