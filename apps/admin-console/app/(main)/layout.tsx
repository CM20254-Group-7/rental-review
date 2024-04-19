import Link from 'next/link';
import React, { PropsWithChildren } from 'react';
import {
  ArrowTrendingUpIcon,
  Bars3Icon,
  BookOpenIcon,
  BugAntIcon,
  HomeIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import env from '@repo/environment-variables/admin-console';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ModeToggle from '@/components/ui/dark-mode-toggle';
import NavLink from './NavLink';

export type IconType = React.ForwardRefExoticComponent<
  Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
    title?: string | undefined;
    titleId?: string | undefined;
  } & React.RefAttributes<SVGSVGElement>
>;

const iconClassName = (variant: 'large' | 'small-popover') => {
  if (variant === 'large') return 'h-4 w-4';
  // otherwise it's small-popover
  return 'h-5 w-5';
};

const NavLinkContents: React.FC<{
  Icon: IconType;
  content: React.ReactNode;
  mode?: 'large' | 'small-popover';
}> = ({ Icon, content, mode = 'large' }) => (
  <>
    <Icon className={iconClassName(mode)} />
    {content}
  </>
);

const navLinks: {
  content: React.ReactNode;
  href: string;
  Icon: IconType;
  selected?: boolean;
}[] = [
  {
    content: 'Dashboard',
    href: '/',
    Icon: ArrowTrendingUpIcon,
  },
  {
    content: 'Moderation',
    href: '/moderation',
    Icon: BookOpenIcon,
  },
  {
    content: 'Users',
    href: '/users',
    Icon: UsersIcon,
  },
  {
    content: 'Features',
    href: '/features',
    Icon: BugAntIcon,
  },
];

const TitleIcon = HomeIcon;
const title = 'Rental Review Admin';

const PublicSiteCard: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Back to Rental Review</CardTitle>
      <CardDescription>
        Done with the admin console? Go back to the main site.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Button size='sm' className='w-full'>
        <Link href={env.NEXT_PUBLIC_PUBLIC_SITE_URL!}>Public Site</Link>
      </Button>
    </CardContent>
  </Card>
);

const Dashboard: React.FC<PropsWithChildren> = ({ children }) => (
  <div className='grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] '>
    <div className='bg-muted/40 hidden border-r md:block'>
      <div className='flex h-full max-h-screen flex-col gap-2'>
        <div className='flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6'>
          <Link href='/' className='flex items-center gap-2 font-semibold'>
            <TitleIcon className='h-6 w-6' />
            <span>{title}</span>
          </Link>
        </div>
        <div className='flex-1'>
          <nav className='grid items-start px-2 text-sm font-medium lg:px-4'>
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href} mode='large'>
                <NavLinkContents
                  Icon={link.Icon}
                  content={link.content}
                  mode='large'
                />
              </NavLink>
            ))}
          </nav>
        </div>
        <div className='mt-auto p-4'>
          <PublicSiteCard />
        </div>
      </div>
    </div>
    <div className='flex flex-col md:max-h-screen'>
      <header className='bg-muted/40 flex h-14 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6'>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              className='shrink-0 md:hidden'
            >
              <Bars3Icon className='h-5 w-5' />
              <span className='sr-only'>Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='flex flex-col '>
            <nav className='grid gap-2 text-lg font-medium'>
              <Link
                href='/'
                className='flex items-center gap-2 text-lg font-semibold'
              >
                <TitleIcon className='h-6 w-6' />
                <span className='sr-only'>{title}</span>
              </Link>
              {navLinks.map((link) => (
                <NavLink key={link.href} href={link.href} mode='small-popover'>
                  <NavLinkContents
                    Icon={link.Icon}
                    content={link.content}
                    mode='small-popover'
                  />
                </NavLink>
              ))}
            </nav>
            <div className='mt-auto'>
              <PublicSiteCard />
            </div>
          </SheetContent>
        </Sheet>
        <div className='w-full flex-1'>{/* Header Content Here */}</div>
        <ModeToggle />
      </header>
      {children}
    </div>
  </div>
);

export default Dashboard;
