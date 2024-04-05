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

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Rental Review',
  description: 'A place for tenants and landlords to work towards better living.',
};

const Layout: NextPage<{
  children: React.ReactNode;
}> = ({
  children,
}) => (
  <html lang='en' className={GeistSans.className}>
    <body className='bg-background text-foreground'>
      <main className='min-h-screen flex flex-col items-center'>
        <Providers>
          <NavBar />
          {children}
          <Footer />
        </Providers>
      </main>

      <SpeedInsights />
      <Analytics />
      <Suspense>
        <Toolbar />
      </Suspense>
    </body>
  </html>
);

export default Layout;
