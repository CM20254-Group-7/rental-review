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
    <div>
      <Link
        href={href}
        className={`py-1 px-2 flex rounded-b-md no-underline ${active ? 'border-b border-accent' : 'hover:border-b hover:border-accent/70'}`}
      >
        {text}
      </Link>
    </div>
  );
};

export default NavLink;
