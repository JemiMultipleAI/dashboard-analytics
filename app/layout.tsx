import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Unified Analytics - Connect GA4, Search Console & Google Ads',
  description: 'Unified Analytics brings together Google Analytics, Search Console, and Google Ads data into one powerful dashboard. Build custom views and gain marketing insights faster.',
  keywords: 'analytics dashboard, google analytics, search console, google ads, analytics platform, unified analytics',
  authors: [{ name: 'Unified Analytics' }],
  openGraph: {
    title: 'Unified Analytics - All Your Marketing Data in One Place',
    description: 'Connect Google Analytics, Search Console, and Google Ads in one powerful dashboard. Build custom views and gain insights faster.',
    type: 'website',
    images: ['https://lovable.dev/opengraph-image-p98pqg.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unified Analytics',
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

