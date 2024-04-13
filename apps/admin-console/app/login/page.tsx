import Image from 'next/image';
import { NextPage } from 'next';
import { redirect } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { tryLogin } from '@/lib/auth';

const login = async (formData: FormData) => {
  'use server';

  const inputPassword = formData.get('password');
  if (typeof inputPassword !== 'string') {
    return;
  }

  await tryLogin(inputPassword);
  redirect('/');
};

const LoginPage: NextPage = () => (
  <div className='w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]'>
    <div className='flex items-center justify-center py-12'>
      <div className='mx-auto grid w-[350px] gap-6'>
        <div className='grid gap-2 text-center'>
          <h1 className='text-3xl font-bold'>Rental Review Admin Console</h1>
          <p className='text-balance text-muted-foreground'>
            Please enter the admin password below to continue
          </p>
        </div>
        <form className='grid gap-4' action={login}>
          <div className='grid gap-2'>
            <div className='flex items-center'>
              <Label htmlFor='password' className='sr-only'>
                Password
              </Label>
            </div>
            <Input
              id='password'
              name='password'
              type='password'
              placeholder='Password'
              required
            />
          </div>
          <Button type='submit' className='w-full'>
            Login
          </Button>
        </form>
      </div>
    </div>
    <div className='bg-muted hidden lg:block'>
      <Image
        src='/placeholder.svg'
        alt='Image'
        width='1920'
        height='1080'
        className='h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
      />
    </div>
  </div>
);

export default LoginPage;
