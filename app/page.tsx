'use client';

import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/frame-sdk';
import { ExportOptions } from '@/components/ExportOptions';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<{ fid: number; username?: string; displayName?: string } | null>(null);

  useEffect(() => {
    const initApp = async () => {
      try {
        // Initialize the app and hide splash screen
        await sdk.actions.ready();
        
        // Access user information from context
        const context = await sdk.context;
        if (context?.user) {
          setUserData({
            fid: context.user.fid,
            username: context.user.username,
            displayName: context.user.displayName,
          });
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing app:', error);
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a1020] text-white">
        <div className="flex flex-col items-center">
          <div className="mb-4 flex space-x-2 justify-center">
            <div className="w-2 h-2 rounded-full bg-[#0057ff] animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-[#0057ff] animate-pulse delay-100"></div>
            <div className="w-2 h-2 rounded-full bg-[#0057ff] animate-pulse delay-200"></div>
          </div>
          <p className="text-sm text-gray-400 font-mono">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="container px-6 py-8 max-w-md mx-auto bg-[#0a1020] text-white min-h-screen">
      <div className="bg-[#121620] rounded-lg border border-[#2a3343] p-6 shadow-sm">
        <div className="flex items-center mb-6">
          <svg className="w-6 h-6 mr-2 text-[#0057ff]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <h1 className="text-xl font-medium tracking-tight text-blue-300 font-mono">Exporter by Quotient</h1>
        </div>
        {userData ? (
          <ExportOptions fid={userData.fid} />
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 font-mono">Unable to get your Farcaster information. Please try again.</p>
          </div>
        )}
      </div>
    </main>
  );
}