'use client';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { Button } from '@tremor/react';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

const BackButton: FC = () => {
  const { back } = useRouter();
  return (
    <Button variant='light' onClick={back}>
      <div className='flex flex-row items-center gap-2'>
        <ArrowLeftIcon className='h-4 w-4' />
        <p>Back</p>
      </div>
    </Button>
  );
};

export default BackButton;
