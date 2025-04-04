import { useState } from 'react';

interface ExportOptionsProps {
  fid?: number;
}

export function ExportOptions({ fid }: ExportOptionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [exportFormat] = useState<'json'>('json');
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
      const response = await fetch(`/api/export/${fid}?format=${exportFormat}`);
      
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
        <p className="text-sm text-gray-400 font-mono mb-2">
          Export your casts in JSON format
        </p>
        <p className="text-sm text-gray-300 font-mono">
          Your FID: <span className="text-blue-300">{fid}</span>
        </p>
      </div>
      
      <button
        onClick={handleExportClick}
        disabled={isLoading}
        className="bg-[#0057ff] hover:bg-[#0066ff] transition-colors text-white font-medium py-2 px-4 rounded-md text-sm uppercase tracking-wider font-mono w-full flex items-center justify-center"
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
        <div className="mt-4 p-3 bg-[#121620] rounded border border-[#2a3343] text-gray-100">
          <p className="text-sm text-blue-300 mb-2 font-medium">
            Export complete! Your data is ready.
          </p>
          <a 
            href={exportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-400 hover:underline flex items-center"
          >
            <span>Download your casts</span>
            <svg className="w-3 h-3 ml-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
          </a>
        </div>
      )}
      
      {exportStatus === 'error' && (
        <p className="mt-3 text-sm text-red-400">
          {errorMessage || 'Error exporting data. Please try again.'}
        </p>
      )}
    </div>
  );
}