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
        className={`py-2 px-3 text-sm flex flex-row bg-background hover:bg-secondary/10 border hover:shadow-sm hover:shadow-primary/20 transition-all text-accent justify-center items-center gap-2 ${isComponentVisible ? 'rounded-t-md' : 'rounded-md'}`}
        onClick={() => setIsComponentVisible(true)}
      >
        <p>{email}</p>
        <UserCircleIcon className='h-6 w-6' />
      </button>

      {isComponentVisible && (
        <div
          ref={ref}
          className='absolute top-[100%] w-full text-sm flex flex-col bg-background border-x border-b hover:shadow-sm hover:shadow-primary/20 transition-all text-foreground justify-center items-center rounded-b-md'
        >
          <Link
            href='/account'
            className='py-2 px-4 border-b w-full text-right no-underline hover:bg-secondary/10'
          >
            Manage Account
          </Link>

          <form action={signOut} className='contents'>
            <button
              type='submit'
              className='py-2 px-4 w-full text-right rounded-b-md no-underline hover:bg-secondary/10'
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
