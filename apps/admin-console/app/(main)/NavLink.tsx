'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { PropsWithChildren } from 'react';

// the type of the heroicons-react icons, allows them to be passed as props

const linkClassName = (
  selected: boolean,
  variant: 'large' | 'small-popover',
) => {
  if (variant === 'large') {
    if (!selected) {
      return 'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary';
    }
    return 'flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary';
  }
  // otherwise it's small-popover
  if (!selected) {
    return 'mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground';
  }
  return 'mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground';
};

const NavLink: React.FC<
  PropsWithChildren<{
    href: string;
    mode?: 'large' | 'small-popover';
  }>
> = ({ children, href = false, mode = 'large' }) => {
  const pathname = usePathname();
  // if pathname is exactly the same as href, or starts with href and is not the root, then it's selected
  const selected =
    pathname === href || (pathname.startsWith(href) && href !== '/');

  return (
    <Link href={href} className={linkClassName(selected, mode)}>
      {children}
    </Link>
  );
};

export default NavLink;
