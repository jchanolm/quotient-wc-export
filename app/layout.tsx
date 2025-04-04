import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Exporter by Quotient',
  description: 'Export your Farcaster Casts in CSV or JSON format',
  other: {
    'fc:frame': '{"version":"next","imageUrl":"https://quotient-wc-export.vercel.app/icon.png","aspectRatio":"3:2","button":{"title":"Export Casts","action":{"type":"launch_frame","name":"Export Casts by Quotient, Powered by Neynar","url":"https://quotient-wc-export.vercel.app/","splashImageUrl":"https://quotient-wc-export.vercel.app/icon.png"}}}'
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