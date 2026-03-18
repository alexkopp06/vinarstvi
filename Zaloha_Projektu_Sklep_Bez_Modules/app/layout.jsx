import { Cinzel, DM_Sans } from 'next/font/google';
import SmoothScroll from '@/components/SmoothScroll';

import './globals.css';

const cinzel = Cinzel({
  subsets:  ['latin'],
  weight:   ['400', '500', '600', '700'],
  variable: '--font-cinzel',
  display:  'swap',
  preload:  true,
});

const dmSans = DM_Sans({
  subsets:  ['latin'],
  weight:   ['300', '400', '500'],
  style:    ['normal', 'italic'],
  variable: '--font-dm-sans',
  display:  'swap',
  preload:  true,
});

export const metadata = {
  metadataBase: new URL('https://sklepudvoraku.cz'),
  title: {
    default:  'Sklep u Dvořáků | Moravské víno z Hustopečí',
    template: '%s — Sklep u Dvořáků',
  },
  description:
    'Rodinný vinný sklep v Hustopečích na jižní Moravě. Poctivá moravská vína ' +
    'z vlastní vinice — degustace, přímý prodej, vinné zážitky.',
  keywords: ['moravské víno', 'vinný sklep', 'Hustopeče', 'degustace', 'Sklep u Dvořáků', 'rodinné víno'],
  authors:  [{ name: 'Sklep u Dvořáků' }],
  creator:  'Sklep u Dvořáků',
  openGraph: {
    type: 'website', locale: 'cs_CZ', url: 'https://sklepudvoraku.cz',
    siteName: 'Sklep u Dvořáků',
    title: 'Sklep u Dvořáků | Moravské víno z Hustopečí',
    description: 'Rodinný vinný sklep v Hustopečích. Degustace, přímý prodej, poctivá moravská vína.',
  },
  twitter: { card: 'summary_large_image', title: 'Sklep u Dvořáků | Moravské víno z Hustopečí' },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: '#1A1A1A',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="cs" className={`${cinzel.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="noise-overlay">
        <SmoothScroll>
          
            
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}