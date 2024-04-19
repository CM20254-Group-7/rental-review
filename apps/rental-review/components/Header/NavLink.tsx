'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const NavLink: React.FC<{
  text: string;
  href: string;
}> = ({ text, href }) => {
  const pathName = usePathname();
  const [active, setActive] = useState(pathName === href);

  useEffect(() => {
    setActive(pathName === href);
  }, [href, pathName]);

  return (
    <Link
      href={href}
      className={`flex w-fit rounded-b-md px-2 py-1 no-underline ${active ? 'border-accent border-b' : 'hover:border-accent/70 hover:border-b'}`}
    >
      {text}
    </Link>
  );
};

export default NavLink;
