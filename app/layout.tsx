import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Warpcast Data Exporter',
  description: 'Export your Warpcast data for analysis in CSV or JSON format',
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
            imageUrl: 'https://your-domain.com/og-image.png', // Replace with your actual OG image URL
            button: {
              title: 'Export Your Data',
              action: {
                type: 'launch_frame',
                url: 'https://your-domain.com/', // Replace with your actual domain
                name: 'Warpcast Data Exporter',
                splashImageUrl: 'https://your-domain.com/splash.png', // Replace with your splash image URL
                splashBackgroundColor: '#f5f0ec'
              }
            }
          })}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}