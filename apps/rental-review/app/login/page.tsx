import { NextPage } from 'next';
import { SignInForm, SignUpForm } from './forms';
import RedirectMessage from './redirectMessage';

const LoginPage: NextPage<{
  searchParams?: {
    redirect?: string;
    message?: string;
  };
}> = ({ searchParams }) => {
  const redirectTo = searchParams?.redirect;

  return (
    <main className='relative flex flex-1 place-items-center justify-center py-10 md:py-16'>
      <RedirectMessage />

      <div className='grid w-fit grid-cols-1 gap-16 [@media(min-width:996px)]:grid-cols-2 [@media(min-width:996px)]:gap-24'>
        <SignInForm redirectTo={redirectTo} />
        <SignUpForm redirectTo={redirectTo} />
      </div>
    </main>
  );
};

export default LoginPage;
