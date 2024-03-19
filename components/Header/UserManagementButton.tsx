'use client';

import { UserCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import createClient from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

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

const UserManagementButton: React.FC<{ email: string, id: string }> = ({ email, id }) => {
  const { refresh } = useRouter();
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible();

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
            href={`/profiles/${id}`}
            className='py-2 px-4 border-b w-full text-right no-underline hover:bg-secondary/10'
          >
            Dashboard
          </Link>

          <button
            type='button'
            className='py-2 px-4 w-full text-right rounded-b-md no-underline hover:bg-secondary/10'
            onClick={async (e) => {
              e.preventDefault();

              const supabase = createClient();
              await supabase.auth.signOut();

              refresh();
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserManagementButton;
