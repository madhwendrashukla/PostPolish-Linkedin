import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'PostPolish – LinkedIn Post Formatter & Live Feed Preview',
  description:
    'Free, fast LinkedIn post editor and Unicode text formatter. Apply bold, italic, and bullet lists with live desktop and mobile feed preview and 1-click copy.',
  keywords: [
    'LinkedIn post formatter',
    'LinkedIn bold text generator',
    'LinkedIn preview tool',
    'LinkedIn formatting editor',
    'LinkedIn hook preview',
    'PostPolish',
  ],
  authors: [{ name: 'Madhwendra Shukla' }],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col selection:bg-[var(--accent-subtle)] selection:text-[var(--accent)]">
        {children}
      </body>
    </html>
  );
}
