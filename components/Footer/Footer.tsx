import React from 'react';
import DarkModeToggle from './DarkModeToggle';

const Footer: React.FC = () => (
  <footer className='w-full border-t border-t-foreground/10 p-8 flex flex-col justify-center text-center text-xs'>
    <p>This is the footer.</p>
    <p>It will be holding all of our terms and conditions links and the usual footer stuff.</p>
    <DarkModeToggle />
  </footer>
);

export default Footer;
