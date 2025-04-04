import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Farcaster Casts Exporter by Quotient',
  description: 'Export your Farcaster Casts in JSON format',
  other: {
    'fc:frame': JSON.stringify({
      version: 'vNext',
      imageUrl: 'https://quotient-wc-export.vercel.app/icon.png',
      postUrl: 'https://quotient-wc-export.vercel.app/api/frame',
      buttons: [
        {
          label: 'Export Casts'
        }
      ],
      ogTitle: 'Farcaster Casts Exporter',
      ogDescription: 'Export your Farcaster Casts with one click'
    })
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Add CORS headers */}
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; connect-src *; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" />
        <meta httpEquiv="Access-Control-Allow-Origin" content="*" />
        <meta httpEquiv="Access-Control-Allow-Methods" content="GET, POST, OPTIONS" />
        <meta httpEquiv="Access-Control-Allow-Headers" content="Content-Type, Authorization" />
      </head>
      <body className={`${inter.className} bg-[#0a1020] text-white`}>
        <div className="fixed top-4 left-6 z-10">
          <img src="/icon.png" alt="Quotient Icon" className="h-8 w-auto" />
        </div>
        {children}
      </body>
    </html>
  );
}