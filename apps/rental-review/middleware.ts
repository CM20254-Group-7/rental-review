import { NextResponse, type NextRequest } from 'next/server';
import createClient from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // if user is on login page, & is already logged in, redirect to dashboard (or the redirict param if it exists)
  if (request.nextUrl.pathname === '/login') {
    const { supabase } = createClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const redirectTo = new URL(request.nextUrl.searchParams.get('redirect') || '/dashboard', request.url);

      return NextResponse.redirect(redirectTo);
    }
  }

  // if user is on a page that requires authentication, and is not logged in, redirect to login (with the current page as the redirect param)
  if (
    request.nextUrl.pathname.startsWith('/dashboard') // all dashboard pages
    || request.nextUrl.pathname.startsWith('/account') // all account pages
    || request.nextUrl.pathname.match(/^\/properties\/[a-zA-Z0-9-]+\/claim/)// all properties claim pages
    || request.nextUrl.pathname.match(/^\/properties\/[a-zA-Z0-9-]+\/review/) // existing propert review page
    || request.nextUrl.pathname === '/reviews/create' // rnew property review page
  ) {
    const { supabase } = createClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const redirectTo = new URL(`/login?redirect=${request.nextUrl.pathname}&message=${'You must be logged in to access this page.'}`, request.url);

      return NextResponse.redirect(redirectTo);
    }
  }

  return response;
}
