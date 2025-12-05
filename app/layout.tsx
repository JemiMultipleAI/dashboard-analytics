import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Unified Marketing Hub - Connect GA4, Search Console & Google Ads',
  description: 'Unified Marketing Hub brings together Google Analytics, Search Console, and Google Ads data into one powerful dashboard. Build custom views and gain marketing insights faster.',
  keywords: 'marketing dashboard, google analytics, search console, google ads, analytics platform, marketing hub',
  authors: [{ name: 'Unified Marketing Hub' }],
  openGraph: {
    title: 'Unified Marketing Hub - All Your Marketing Data in One Place',
    description: 'Connect Google Analytics, Search Console, and Google Ads in one powerful dashboard. Build custom views and gain insights faster.',
    type: 'website',
    images: ['https://lovable.dev/opengraph-image-p98pqg.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unified Marketing Hub',
    description: 'Connect GA4, Search Console & Google Ads in one dashboard',
    images: ['https://lovable.dev/opengraph-image-p98pqg.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

