// components/ExportOptions.tsx
import { useState } from 'react';

interface ExportOptionsProps {
  fid?: number;
}

export function ExportOptions({ fid }: ExportOptionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleExportClick = async () => {
    if (!fid) return;
    
    setIsLoading(true);
    setExportStatus('loading');
    setErrorMessage(null);
    
    try {
      // Call our export API
      const response = await fetch(`/api/export/${fid}?format=json`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Export failed');
      }
      
      const data = await response.json();
      
      // Store the export URL
      setExportUrl(data.url);
      setExportStatus('success');
    } catch (error) {
      console.error('Export error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to export data');
      setExportStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!fid) {
    return <div>FID not available. Please sign in again.</div>;
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
          Export your casts in JSON format
        </p>
      </div>
      
      <button
        onClick={handleExportClick}
        disabled={isLoading}
        className="btn-primary w-full"
      >
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : null}
        {isLoading ? 'Exporting...' : 'Go'}
      </button>
      
      {exportStatus === 'success' && exportUrl && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
            Export complete! Your data is ready.
          </p>
          <a 
            href={exportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            Download your casts
          </a>
        </div>
      )}
      {exportStatus === 'error' && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">
          {errorMessage || 'Error exporting data. Please try again.'}
        </p>
      )}
    </div>
  );
}