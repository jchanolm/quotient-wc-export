import { useState } from 'react';

interface ExportOptionsProps {
  fid?: number;
}

export function ExportOptions({ fid }: ExportOptionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // In a real app, these would be generated by your backend
  const getDownloadUrls = () => {
    // These would be actual API endpoints that generate data for the specific FID
    return {
      csvUrl: `/api/export/${fid}/csv`,
      jsonUrl: `/api/export/${fid}/json`,
    };
  };

  const handleExportClick = async (format: 'csv' | 'json') => {
    if (!fid) return;
    
    setIsLoading(true);
    setExportStatus('loading');
    
    try {
      // In a production app, this would make an API call to start the export process
      // For demo purposes, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get the relevant URL
      const { csvUrl, jsonUrl } = getDownloadUrls();
      const url = format === 'csv' ? csvUrl : jsonUrl;
      
      // Trigger download - in a real app the backend would handle file generation
      window.open(url, '_blank');
      
      setExportStatus('success');
    } catch (error) {
      console.error(`Error exporting ${format}:`, error);
      setExportStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!fid) {
    return <div>FID not available. Please sign in again.</div>;
  }

  return (
    <div className="w-full p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Export Your Data</h2>
      
      <p className="mb-4 text-gray-700">
        Choose a format to export your Warpcast data for analysis:
      </p>
      
      <div className="flex flex-col space-y-3">
        <button
          onClick={() => handleExportClick('csv')}
          disabled={isLoading}
          className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {isLoading && exportStatus === 'loading' ? (
            <span className="animate-spin mr-2">⭮</span>
          ) : (
            <span className="mr-2">📊</span>
          )}
          Export as CSV
        </button>
        
        <button
          onClick={() => handleExportClick('json')}
          disabled={isLoading}
          className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {isLoading && exportStatus === 'loading' ? (
            <span className="animate-spin mr-2">⭮</span>
          ) : (
            <span className="mr-2">📄</span>
          )}
          Export as JSON
        </button>
      </div>
      
      {exportStatus === 'success' && (
        <p className="mt-4 text-green-600">
          Export successful! Check your downloads folder.
        </p>
      )}
      
      {exportStatus === 'error' && (
        <p className="mt-4 text-red-600">
          There was an error exporting your data. Please try again.
        </p>
      )}
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-lg font-medium mb-2">What's Included</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Your public casts and replies</li>
          <li>Following/follower relationships</li>
          <li>Reactions (likes, recasts)</li>
          <li>Profile information</li>
        </ul>
        <p className="mt-4 text-sm text-gray-500">
          Note: Only public data visible on the Farcaster network is included.
        </p>
      </div>
    </div>
  );
}