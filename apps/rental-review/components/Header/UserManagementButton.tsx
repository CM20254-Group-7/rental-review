'use client';

import { UserCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import signOut from './actions';

// define hook to handle click outside of component
const useComponentVisible = () => {
  const [isComponentVisible, setIsComponentVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Element)) {
      setIsComponentVisible(!isComponentVisible);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, !isComponentVisible);

    return () => {
      document.removeEventListener(
        'click',
        handleClickOutside,
        !isComponentVisible,
      );
    };
  });

  return { ref, isComponentVisible, setIsComponentVisible };
};

const UserManagementButton: React.FC<{ email: string }> = ({ email }) => {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible();

  return (
    <div className='relative'>
      <button
        type='button'
        className={`bg-background hover:bg-secondary/10 hover:shadow-primary/20 text-accent flex flex-row items-center justify-center gap-2 border px-3 py-2 text-sm transition-all hover:shadow-sm ${isComponentVisible ? 'rounded-t-md' : 'rounded-md'}`}
        onClick={() => setIsComponentVisible(true)}
      >
        <p>{email}</p>
        <UserCircleIcon className='h-6 w-6' />
      </button>

      {isComponentVisible && (
        <div
          ref={ref}
          className='bg-background hover:shadow-primary/20 text-foreground absolute top-[100%] flex w-full flex-col items-center justify-center rounded-b-md border-x border-b text-sm transition-all hover:shadow-sm'
        >
          <Link
            href='/account'
            className='hover:bg-secondary/10 w-full border-b px-4 py-2 text-right no-underline'
          >
            Manage Account
          </Link>

          <form action={signOut} className='contents'>
            <button
              type='submit'
              className='hover:bg-secondary/10 w-full rounded-b-md px-4 py-2 text-right no-underline'
            >
              Logout
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserManagementButton;
