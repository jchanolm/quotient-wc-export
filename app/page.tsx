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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="container">
      <div className="card">
        <h1 className="text-center">Warpcast Data Exporter</h1>
        
        {userData ? (
          <>
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-lg">Welcome, {userData.displayName || userData.username || `FID: ${userData.fid}`}!</p>
            </div>
            <ExportOptions fid={userData.fid} />
          </>
        ) : (
          <div className="text-center">
            <p className="mb-4">Unable to get your Farcaster information. Please try again later.</p>
          </div>
        )}
      </div>
    </main>
  );
}