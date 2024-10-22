import type { Metadata } from "next";
import localFont from "next/font/local";
import '../globals.css'; // Ensure this is correctly referenced
import Sidebar from '../../components/sidebar'; // Import the Sidebar component
import { getServerSession } from "next-auth"; // Import getServerSession
import authConfig from '../../auth.config'; // Adjusted import path

const geistSans = localFont({
  src: "../fonts/GeistVF.woff", // Updated path
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff", // Updated path
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Timperio",
  description: "Generated by create next app",
};

// Export the layout as a server component
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch the session on the server side
  const session = await getServerSession(authConfig);
  
  // Ensure session is defined and has the expected structure
  const userRole = session?.account?.role;

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <Sidebar role={userRole} /> {/* Pass the role prop to Sidebar */}

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <main className="flex-1 p-8 bg-gray-100">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
