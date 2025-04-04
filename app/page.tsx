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
        if (sdk.context?.user) {
          setUserData({
            fid: sdk.context.user.fid,
            username: sdk.context.user.username,
            displayName: sdk.context.user.displayName,
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
      <div className="flex h-screen items-center justify-center">
        <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <main className="container">
      <div className="card">
        <div className="flex items-center mb-6">
          <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <h1>Exporter - Built by Quotient, Powered by Neynar</h1>
        </div>        
        {userData ? (
          <ExportOptions fid={userData.fid} />
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-slate-500">Unable to get your casts. Please try again or dc @ruminations</p>
          </div>
        )}
      </div>
    </main>
  );
}