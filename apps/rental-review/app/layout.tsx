import { GeistSans } from 'geist/font/sans';
import './globals.css';
import NavBar from '@/components/Header/NavBar';
import Footer from '@/components/Footer/Footer';
import { NextPage } from 'next';
import React, { Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Toolbar from '@/components/vercel-toolbar';
import Providers from '@/components/Providers';

export const metadata = {
  title: 'Rental Review',
  description:
    'A place for tenants and landlords to work towards better living.',
};

const Layout: NextPage<{
  children: React.ReactNode;
}> = ({ children }) => (
  <html lang='en' className={GeistSans.className}>
    <body className='bg-background text-foreground '>
      <Providers>
        <div className='flex min-h-screen flex-col items-center'>
          <NavBar />
          <div className='flex w-full flex-1 flex-col items-center'>
            {children}
          </div>
          <Footer />
        </div>

        <SpeedInsights />
        <Analytics />
        <Suspense>
          <Toolbar />
        </Suspense>
      </Providers>
    </body>
  </html>
);

export default Layout;
