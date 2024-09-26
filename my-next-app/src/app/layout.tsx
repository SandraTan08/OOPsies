import type { Metadata } from "next";
import localFont from "next/font/local";
import './style/globals.css';
import {
  LayoutGrid,
  Users,
  ShoppingCart,
  BarChart,
} from 'lucide-react';

import Link from 'next/link';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Timperio",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="hidden md:flex md:flex-shrink-0 bg-gray-800">
            <div className="flex flex-col w-64">
              <div className="flex items-center h-16 px-4 bg-gray-900">
                <h1 className="text-lg font-semibold text-white">Timperio CRM</h1>
              </div>
              <div className="flex flex-col flex-1 overflow-y-auto bg-gray-800">
                <nav className="flex-1 px-2 py-4 space-y-1">
                  {/* Navigation Links */}
                  <Link href="/" className="flex items-center px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-md group">
                      <LayoutGrid className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-300"  />
                      Dashboard
                  </Link>
                  <Link href="/customers" className="flex items-center px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white group">
                      <Users className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-300" />
                      Customers
                  </Link>
                  <Link href="/sales" className="flex items-center px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white group">
                      <ShoppingCart className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-300" />
                      Sales
                  </Link>
                  <Link href="/newsletter" className="flex items-center px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white group">
                      <ShoppingCart className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-300" />
                      Newsletter
                  </Link>
                  <Link href="/account" className="flex items-center px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white group"> 
                      <BarChart className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-300" />
                      Account
                  </Link>
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Here goes the rest of the page content */}
            <main className="flex-1 p-8 bg-gray-100">
              {children}
            </main>
          </div>

        </div>
      </body>
    </html>
  );
}
