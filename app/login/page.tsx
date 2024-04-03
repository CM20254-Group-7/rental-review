import { NextPage } from 'next';
import { SignInForm, SignUpForm } from './forms';
import RedirectMessage from './redirectMessage';

const LoginPage: NextPage<{
  searchParams?: {
    redirect?: string,
    message?: string,
  }
}> = ({ searchParams }) => {
  const redirectTo = searchParams?.redirect;

  return (
    <div className='relative flex-1 flex justify-center place-items-center gap-8 pt-24 pb-8'>
      <RedirectMessage />

      <div className='grid grid-cols-1 [@media(min-width:996px)]:grid-cols-2 gap-8 w-full'>
        <SignInForm redirectTo={redirectTo} />
        <SignUpForm redirectTo={redirectTo} />
      </div>
    </div>
  );
};

export default LoginPage;
