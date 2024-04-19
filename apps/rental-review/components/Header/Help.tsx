'use client';

import React from 'react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../dropdown';
import { Button } from '../ClientTremor';

const Help: React.FC = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='secondary' className='rounded-full'>
          <p>Help</p>
          <span className='sr-only'>Toggle help menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-background min-w-full p-0' asChild>
        <div className='bg-background flex w-3/5 max-w-md flex-col p-4 text-center'>
          <p className='mb-2'>
            There are a few things you should know about this website before you
            start using it. They are located on the home page of the website.
          </p>
          <p className='mb-2'>
            If you are still unsure about something, feel free to visit the FAQ
            page for assistance
            <Link href='/FAQ' className='font-bold text-blue-500'>
              {' '}
              here
            </Link>
            .
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Help;
