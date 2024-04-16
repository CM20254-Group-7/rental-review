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
    href: 'mailto:help.rentalreview@gmail.com',
  },
];

const Footer: React.FC = () => (
  <footer className='border-t-foreground/10 flex w-screen flex-row border-t'>
    <div className='flex w-5 flex-1 items-center p-5'>
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
    <div className='flex flex-auto flex-col justify-center gap-2 p-8 text-center text-xs'>
      {links.map((link) => (
        <Link key={link.label} href={link.href} className='hover:underline'>
          {link.label}
        </Link>
      ))}
      <DarkModeToggle />
    </div>
    <div className='w-5 flex-1' />
  </footer>
);

export default Footer;
