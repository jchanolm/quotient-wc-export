import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Exporter by Quotient',
  description: 'Export your Farcaster Casts in JSON format',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Farcaster Frame Meta Tag for embed sharing */}
        <meta
          name="fc:frame"
          content={JSON.stringify({
            version: 'next',
            imageUrl: 'https://your-domain.com/og-image.png', // Replace with actual OG image URL
            button: {
              title: 'Export Your Casts',
              action: {
                type: 'launch_frame',
                url: 'https://your-domain.com/', // Replace with actual domain
                name: 'Exporter by Quotient',
                splashImageUrl: 'https://your-domain.com/splash.png', // Replace with splash image URL
                splashBackgroundColor: '#FFFFFF'
              }
            }
          })}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}