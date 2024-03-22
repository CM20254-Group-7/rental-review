import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DarkModeToggle from './DarkModeToggle';

const links = [
  {
    label: 'Privacy Policy',
    href: '/privacy-policy',
  },
  {
    label: 'Terms of Service',
    href: '/terms-of-service',
  },
  {
    label: 'Contact Us',
    href: '/contact',
  },
];

const Footer: React.FC = () => (
  <footer className='w-screen flex flex-row border-t border-t-foreground/10'>
    <div className='flex-1 w-5 flex items-center p-5'>
      <Link href='https://github.com/CM20254-Group-7/rental-review'>
        <Image
          className='dark:hidden'
          src='/github-mark.svg'
          alt='Logo'
          width={40}
          height={40}
        />
        <Image
          className='hidden dark:block'
          src='/github-mark-white.svg'
          alt='Logo'
          width={40}
          height={40}
        />
      </Link>
    </div>
    <div className='flex-auto p-8 flex flex-col justify-center text-center text-xs gap-2'>
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className='hover:underline'
        >
          {link.label}
        </Link>
      ))}
      <DarkModeToggle />
    </div>
    <div className='flex-1 w-5' />
  </footer>
);

export default Footer;
