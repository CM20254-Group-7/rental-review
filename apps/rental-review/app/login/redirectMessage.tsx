'use client';

import { XMarkIcon } from '@heroicons/react/24/solid';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';

const RedirectMessage: FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const [message, setMessage] = useState(searchParams.get('message'));
  useEffect(() => {
    setMessage(searchParams.get('message'));
  }, [searchParams]);

  const removeMessage = () => {
    const newSeachParams = new URLSearchParams(searchParams);
    newSeachParams.delete('message');
    replace(`${pathname}?${newSeachParams.toString()}`);
  };

  if (!message) return null;

  return (
    <div className='bg-primary/40 absolute top-14 flex flex-row items-center justify-between gap-2 rounded-lg p-4'>
      <p>{message}</p>
      <button
        type='button'
        onClick={removeMessage}
        className=''
        id='close-message'
      >
        <XMarkIcon className='h-5 w-5' />
      </button>
    </div>
  );
};

export default RedirectMessage;
