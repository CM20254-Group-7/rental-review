'use client';

import React, { useState, useEffect, useRef } from 'react';

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
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible();

  return (
    <div className='relative'>
      <button
        type='button'
        className={`ml-5 py-2 px-3 text-sm flex flex-row bg-background hover:bg-secondary/10 border hover:shadow-sm hover:shadow-primary/20 transition-all text-accent justify-center items-center gap-2 ${isComponentVisible ? 'rounded-t-md' : 'rounded-md'}`}
        onClick={() => setIsComponentVisible(true)}
      >
        Help
      </button>

      {isComponentVisible && (
        <div
          ref={ref}
          className='z-10 absolute right-0 top-[100%] w-[60vw] text-sm flex flex-col bg-background border-x border-b hover:shadow-sm hover:shadow-primary/20 transition-all text-foreground justify-center items-center rounded-b-md rounded-t-md'
        >
          <div className='ml-2 mr-5 text-wrap'>
            <p className='mb-2'>
              Oh, you need help? Womp womp.
              Have you tried turning it off and on again?
            </p>
            <p className='mb-2 indent-8'>
              Well, if you&apos;re still here, then let&apos;s give you a little bit of orientation.
              To use this website&apos;s full functionality, you need to create an account. Otherwise,
              you&apos;ll only be able to read reviews and not upload any. When you do create an account,
              you&apos;ll be able to write reviews (even for properties not in our database yet), rate
              properties and landlords, or select to become a landlord and claim properties that you own.
            </p>
            <p className='mb-2 indent-8'>
              To find a property, click on the Properties button in the navigation bar up top, then search
              a property in the search bar on the left hand side of the screen. If you like, you can also
              search for a specific landlord to view their public profile along with all the properties that
              they own. If you can&apos;t find the property you&apos;re looking for, you can create a review
              for it regardless, adding it to our database in the process. Then, anyone can find it when
              they search it up! Pretty neat, huh? :)
            </p>
            <p>
              If you still have questions, have a look out our
              <a href='./QandA' className='font-bold'> Q and A </a>
              page!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Help;
