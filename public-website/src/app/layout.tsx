import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Providers } from '@/components/providers';
import { CustomCursor } from '@/components/custom-cursor';

export const metadata: Metadata = {
  title: 'Kallakurichi District Chess Association | KDCA',
  description: 'Official website of Kallakurichi District Chess Association - Nurturing Chess Champions in Tamil Nadu, India.',
  keywords: ['chess', 'KDCA', 'Kallakurichi', 'Tamil Nadu', 'chess association', 'tournaments'],
  openGraph: {
    title: 'Kallakurichi District Chess Association',
    description: 'Nurturing Chess Champions',
    url: 'https://kallaichess.com',
    siteName: 'KDCA',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Providers>
          <CustomCursor />
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
