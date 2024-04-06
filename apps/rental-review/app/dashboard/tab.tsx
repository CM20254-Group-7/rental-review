// Based on https://github.com/vercel/app-playground/blob/d210f84a7331d35da4d385f17c160a3d6a68dbff/ui/tab.tsx

'use client';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

type Item = {
  text: string;
  slug?: string;
  segment?: string;
};

const Tab = ({ path, item }: { path: string; item: Item }) => {
  const segment = useSelectedLayoutSegment();

  const href = item.slug ? `${path}/${item.slug}` : path;
  const isActive =
    (!item.slug && segment === null) ||
    segment === item.segment ||
    // Nested pages e.g. `/layouts/electronics`
    segment === item.slug;

  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-1 text-sm font-medium border border-foreground/40 ${
        isActive ? 'bg-primary' : 'bg-primary/30 hover:bg-primary/50'
      }`}
    >
      {item.text}
    </Link>
  );
};

export default Tab;
