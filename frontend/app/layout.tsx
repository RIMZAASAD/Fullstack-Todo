import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/auth-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Planit | Premium Todo Management',
  description: 'A beautiful, fast, and secure way to manage your tasks.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-900 text-slate-50`}>
        <AuthProvider>
          <div className="min-h-screen relative overflow-hidden bg-slate-900">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}