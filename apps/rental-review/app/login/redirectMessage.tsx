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
    <div className='absolute top-14 bg-primary/40 rounded-lg p-4 flex flex-row gap-2 items-center justify-between'>
      <p>{message}</p>
      <button type='button' onClick={removeMessage} className='' id='close-message'>
        <XMarkIcon className='w-5 h-5' />
      </button>
    </div>
  );
};

export default RedirectMessage;
