// src/app/layout.tsx
"use client"

import Head from 'next/head';
import './globals.css'
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}

