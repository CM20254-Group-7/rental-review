'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

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

const Help: React.FC = () => {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible();

  return (
    <div className='relative'>
      <button
        type='button'
        className={`bg-background hover:bg-secondary/10 hover:shadow-primary/20 text-accent ml-5 flex flex-row items-center gap-2 border px-3 py-2 text-sm transition-all hover:shadow-sm ${isComponentVisible ? 'rounded-t-md' : 'rounded-md'}`}
        onClick={() => setIsComponentVisible(true)}
      >
        Help
      </button>

      {isComponentVisible && (
        <div
          ref={ref}
          className='bg-background border-primary hover:shadow-primary/20 text-foreground absolute right-0 top-[100%] z-10 flex w-[20vw] flex-col rounded-md border text-sm transition-all hover:shadow-sm'
        >
          <div className='p-4 text-center'>
            <p className='mb-2'>
              There are a few things you should know about this website before
              you start using it. They are located on the home page of the
              website.
            </p>
            <p className='mb-2'>
              If you are still unsure about something, feel free to visit the
              FAQ page for assistance
              <Link href='/FAQ' className='font-bold text-blue-500'>
                {' '}
                here
              </Link>
              .
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Help;
