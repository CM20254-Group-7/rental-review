import Link from 'next/link'
import { SignInForm, SignUpForm } from './forms'
import { NextPage } from 'next'

const LoginPage: NextPage = ({searchParams}: {searchParams?: {redirect?: string}}) => {
  const redirectTo = searchParams?.redirect

  return (
    <div className="relative flex-1 flex px-8 justify-center place-items-center gap-8 pt-24 pb-8">
      {redirectTo && <Link
        href={redirectTo}
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{' '}
        Back
      </Link>}

      <div className="grid grid-cols-1 [@media(min-width:996px)]:grid-cols-2 gap-8 w-full">
        <SignInForm redirectTo={redirectTo}/>
        <SignUpForm redirectTo={redirectTo}/>
      </div>   
    </div>
  )
}

export default LoginPage;