// src/app/layout.tsx
import Sidebar from '../../components/sidebar'; // Adjust import path as needed
import { getServerSession } from "next-auth"; // Import getServerSession
import authConfig from '../../auth.config'; // Adjusted import path
import React from 'react';
import '../globals.css'

export const metadata = {
  title: 'Timperio',
  description: 'Generated by Next.js',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch the session on the server side
  const session = await getServerSession(authConfig);
  
  // Ensure session is defined and has the expected structure
  const userRole = session?.account?.role; // Extract the role

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          {/* Include the Sidebar here and pass the role prop */}
          <Sidebar role={userRole} />

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <main className="flex-1 pl-8 pr-8 bg-gray-100">
              {React.Children.map(children, child => 
                React.cloneElement(child as React.ReactElement<any>, { role: userRole })
              )}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
