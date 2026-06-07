import type { Metadata, Viewport } from 'next';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/lib/theme-context';
import ThemeCustomizer from '@/components/ThemeCustomizer';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#08080c',
};

export const metadata: Metadata = {
  title: {
    default: 'RoomsGPT | AI Home Renovation in Seconds',
    template: '%s | RoomsGPT',
  },
  description:
    'Transform any room with AI. Upload a photo, choose a style, and visualize your renovation instantly. Photorealistic renders in under 10 seconds powered by GPT-5.2.',
  keywords: [
    'AI interior design',
    'home renovation app',
    'RoomsGPT',
    'virtual renovation',
    'AI room redesign',
    'before after renovation',
    'virtual staging',
    'interior design AI',
  ],
  authors: [{ name: 'RoomsGPT' }],
  creator: 'RoomsGPT',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://roomsgpt.io',
    siteName: 'RoomsGPT',
    title: 'RoomsGPT | AI Home Renovation in Seconds',
    description:
      'Transform any room with AI. Upload a photo, choose a style, and visualize your renovation instantly.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'RoomsGPT - AI Home Renovation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RoomsGPT | AI Home Renovation in Seconds',
    description:
      'Transform any room with AI. Photorealistic renders in seconds.',
    images: ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  metadataBase: new URL('https://roomsgpt.io'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <ThemeProvider>
          <AuthProvider>
            <main id="main-content">{children}</main>
            <ThemeCustomizer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
