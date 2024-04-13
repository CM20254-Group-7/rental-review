import Link from 'next/link';
import React from 'react';

const UserAccountButton: React.FC = () => (
  <div>
    <Link
      href='/account'
      className='bg-btn-background hover:bg-btn-background-hover flex rounded-md px-3 py-2 no-underline'
    >
      User Mangement
    </Link>
  </div>
);

export default UserAccountButton;
