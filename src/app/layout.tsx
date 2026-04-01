import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { MolstarErrorSuppressor } from '@/components/MolstarErrorSuppressor';
import { Sidebar } from '@/components/layout/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '澳龙生物 · 兽用免疫学知识图谱',
  description: 'Auleon Biologicals Veterinary Immunology Knowledge Graph — 6 interactive learning modules',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <MolstarErrorSuppressor />
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto p-6 lg:p-8">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
