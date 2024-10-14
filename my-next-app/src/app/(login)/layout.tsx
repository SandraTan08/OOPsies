import '../globals.css';

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex justify-center items-center min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}