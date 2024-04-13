import Link from 'next/link';
import React from 'react';

const HomeButton: React.FC = () => (
  <div>
    <Link
      href='/'
      className='bg-secondary/20 hover:bg-secondary/30 hover:shadow-primary/30 text-accent flex rounded-md border px-3 py-2 text-lg font-semibold no-underline transition-all hover:shadow-md'
    >
      Rental Review
    </Link>
  </div>
);

export default HomeButton;
