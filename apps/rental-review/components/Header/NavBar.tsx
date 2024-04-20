import { Menu } from 'lucide-react';
import { FC } from 'react';
import { createServerSupabaseClient } from '@repo/supabase-client-helpers/server-only';
import { Sheet, SheetContent, SheetTrigger } from '@/components/sheet';
import { Button } from '@/components/ClientTremor';
import HomeButton from './HomeButton';
import NavLink from './NavLink';
import AuthButton from './AuthButton';
import Help from './Help';

const NavBar: FC = async () => {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  let loggedIn = true;
  if (userError || !user) {
    loggedIn = false;
  }
  return (
    <header className='bg-background sticky top-0 z-30 h-16 w-screen'>
      <div className='bg-primary/10 grid h-full w-full grid-cols-3 grid-rows-1 items-center gap-4 border-b px-4 md:grid-cols-1 md:px-6'>
        <nav className='hidden w-full flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
          <HomeButton />
          <NavLink text='Properties' href='/properties' />
          <NavLink text='Landlords' href='/profiles' />
          {loggedIn && <NavLink text='Dashboard' href='/dashboard' />}
          <div className='flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4'>
            <AuthButton />
            <Help />
            {/* <form className='ml-auto flex-1 sm:flex-initial'>
            <div className='relative'>
              <Search className='text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4' />
              <Input
                type='text'
                placeholder='Search products...'
                className='pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]'
              />
            </div>
          </form>
          `<DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='secondary' className='rounded-full'>
                <CircleUser className='h-5 w-5' />
                <span className='sr-only'>Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
          </div>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant='secondary' className='w-fit shrink-0 md:hidden'>
              <Menu className='h-5 w-5' />
              <span className='sr-only'>Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side='left'
            className='flex w-screen flex-col justify-between'
          >
            <nav className='grid place-items-center gap-6 text-lg font-medium'>
              <HomeButton />
              <NavLink text='Properties' href='/properties' />
              <NavLink text='Landlords' href='/profiles' />
              {loggedIn && <NavLink text='Dashboard' href='/dashboard' />}
            </nav>
            <div className='grid place-items-center gap-6 py-6 text-lg font-medium'>
              <AuthButton />
              <Help />
            </div>
          </SheetContent>
        </Sheet>
        <div className='flex flex-1 justify-center md:hidden'>
          <HomeButton />
        </div>
      </div>
    </header>
  );
};

export default NavBar;
