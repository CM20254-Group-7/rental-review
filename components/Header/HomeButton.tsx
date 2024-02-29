import Link from 'next/link';
import React from 'react';

const HomeButton: React.FC = () => (
  <div>
    <Link
      href='/'
      className='py-2 px-3 text-lg flex rounded-md no-underline bg-secondary/20 border hover:bg-secondary/30 hover:shadow-md hover:shadow-primary/30 transition-all text-accent font-semibold'
    >
      Rental Review
    </Link>
  </div>
);

export default HomeButton;
