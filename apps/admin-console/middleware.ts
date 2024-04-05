import { createHash } from 'crypto';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

// temp hash = createHash("sha256").update("saltyPwd" + 'password123').digest("hex")
// should be replaced with a better password and put in env vars or edge config
const correctPasswordHash = "cac432b30ae9eed8c2d56bc56362735d6119636391540959957bc79b26b40bdb"

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
  const loggedIn = passwordHash === correctPasswordHash;

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
