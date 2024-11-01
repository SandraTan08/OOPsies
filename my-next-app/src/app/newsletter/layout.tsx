import Sidebar from '../../components/sidebar'; // Adjust the import path as needed
import { getServerSession } from "next-auth"; // Import getServerSession
import authConfig from '../../auth.config'; // Adjusted import path
import '../globals.css'

export const metadata = {
  title: 'Next.js',
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
            <main className="flex-1 p-8 bg-gray-100">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
