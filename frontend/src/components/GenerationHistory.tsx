interface Generation {
  id: number;
  prompt: string;
  style: string;
  image_url: string;
  created_at: string;
  status: string;
}

interface GenerationHistoryProps {
  generations: Generation[];
  onRestore: (generation: Generation) => void;
}

export function GenerationHistory({ generations, onRestore }: GenerationHistoryProps): JSX.Element {
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleDownload = async (generation: Generation): Promise<void> => {
    try {
      const response = await fetch(generation.image_url);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const timestamp = new Date(generation.created_at).toISOString().split('T')[0];
      const filename = `ai-studio-${generation.style}-${timestamp}-${generation.id}.png`;
      link.download = filename;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  if (generations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No generations yet</p>
        <p className="text-sm">Create your first generation to see it here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="generation-history">
      {generations.map((generation) => (
        <div
          key={generation.id}
          data-testid="generation-item"
          className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
        >
          <div className="flex space-x-3">
            <div className="relative group">
              <img
                src={generation.image_url}
                alt={generation.prompt}
                className="w-16 h-16 object-cover rounded cursor-pointer"
                onClick={() => onRestore(generation)}
              />
              <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 rounded-full">
                ✓
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded transition-all duration-200 flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(generation);
                  }}
                  className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 rounded-full p-1 hover:bg-gray-100 transition-all duration-200"
                  title="Download image"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p 
                className="text-sm font-medium text-gray-900 truncate cursor-pointer hover:text-blue-600"
                onClick={() => onRestore(generation)}
              >
                {generation.prompt}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {generation.style}
              </p>
              <p className="text-xs text-gray-400">
                {formatTimestamp(generation.created_at)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
