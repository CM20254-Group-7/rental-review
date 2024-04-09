'use client';

import React from 'react';
import { NextUIProvider } from '@nextui-org/system';

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <NextUIProvider className='contents'>{children}</NextUIProvider>
);

export default Providers;
