'use client';

import { UserCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import React from 'react';
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

const UserManagementButton: React.FC<{ email: string }> = ({ email }) => {
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  const signOut = async () => {
    await supabase.auth.signOut();

    router.push('/login');
  };

  supabase.auth.onAuthStateChange(() => {
    router.refresh();
  });

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
