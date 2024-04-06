import { createHash } from 'crypto';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

// match all routes other than the always allowed pages
export const config = {
  matcher: [
      '/((?!api|_next/static|_next/image|favicon.ico|placeholder.png).*)',
  ],
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // get the password hash from the cookie
  const cookieStore = cookies();
  const passwordHash = cookieStore.get('rental-review-admin')?.value;
  const loggedIn = passwordHash === process.env.ADMIN_PASSWORD_HASH;

  // if user is on login page, & is already logged in, redirect to home (or the redirict param if it exists)
  if (request.nextUrl.pathname === '/login') {
    if (loggedIn) {
      const redirectTo = new URL(request.nextUrl.searchParams.get('redirect') || '/', request.url);

      return NextResponse.redirect(redirectTo);
    }
    return response;
  }

  if (!loggedIn) {
    const redirectTo = new URL(`/login?redirect=${request.nextUrl.pathname}`, request.url);

    return NextResponse.redirect(redirectTo);
  }

  return response;
}
