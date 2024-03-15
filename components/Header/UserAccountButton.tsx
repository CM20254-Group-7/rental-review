import Link from 'next/link';
import React from 'react';

const UserAccountButton: React.FC = () => (
  <div>
    <Link
      href='/account'
      className='py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover'
    >
      User Mangement
    </Link>
  </div>
);

export default UserAccountButton;
