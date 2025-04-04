import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Exporter by Quotient',
  description: 'Export your Farcaster Casts in CSV or JSON format',
  other: {
    'fc:frame': '{"version":"next","imageUrl":"https://fc-casts-exporter.usequotient.xyz/icon.png","aspectRatio":"3:2","button":{"title":"Export Data","action":{"type":"launch_frame","name":"Farcaster Exporter","url":"https://fc-casts-exporter.usequotient.xyz","splashImageUrl":"https://farcaster.usequotient.xyz/icon.png","splashBackgroundColor":"#000"}}}'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0a1020] text-white`}>
        <div className="fixed top-4 left-6 z-10">
          <img src="/icon.png" alt="Quotient Icon" className="h-8 w-auto" />
        </div>
        {children}
      </body>
    </html>
  );
}