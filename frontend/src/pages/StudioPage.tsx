import { useState, useEffect, Suspense, lazy } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ImageUpload } from '../components/ImageUpload';
import { GenerationForm } from '../components/GenerationForm';
import { DarkModeToggle } from '../components/DarkModeToggle';
import { generationsApi } from '../services/api';
import toast from 'react-hot-toast';

const GenerationHistory = lazy(() => import('../components/GenerationHistory').then(module => ({ default: module.GenerationHistory })));

interface Generation {
  id: number;
  prompt: string;
  style: string;
  image_url: string;
  created_at: string;
  status: string;
}

export function StudioPage(): JSX.Element {
  const { user, logout } = useAuth();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [restoredGeneration, setRestoredGeneration] = useState<Generation | null>(null);
  const [latestGeneration, setLatestGeneration] = useState<Generation | null>(null);

  useEffect(() => {
    loadGenerations();
  }, []);

  const loadGenerations = async (): Promise<void> => {
    try {
      const response = await generationsApi.getGenerations(5);
      setGenerations(response.data.data);
    } catch {
      toast.error('Failed to load generation history');
    }
  };

  const handleGenerate = async (prompt: string, style: string): Promise<void> => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    const controller = new AbortController();
    setAbortController(controller);
    setIsGenerating(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('prompt', prompt);
      formData.append('style', style);

      const response = await generationsApi.createGeneration(formData, {
        signal: controller.signal
      });
      
      setLatestGeneration(response.data.data);
      toast.success('Image generated successfully!');
      setRetryCount(0);
      await loadGenerations();
    } catch (error: any) {
      if (error.name === 'AbortError') {
        toast('Generation cancelled');
        return;
      }

      if (error.response?.status === 503 && retryCount < 3) {
        const remainingRetries = 3 - retryCount;
        toast.error(`Model overloaded. Retrying... (${remainingRetries} attempts left)`);
        setRetryCount(prev => prev + 1);
        
        setTimeout(() => {
          if (!controller.signal.aborted) {
            handleGenerate(prompt, style);
          }
        }, 2000);
        return;
      }

      if (retryCount >= 3) {
        toast.error('Generation failed after 3 attempts. Please try again later.');
      } else {
        toast.error(error.response?.data?.message || 'Generation failed');
      }
    } finally {
      setIsGenerating(false);
      setAbortController(null);
    }
  };

  const handleAbort = (): void => {
    if (abortController) {
      abortController.abort();
    }
  };

  const handleRestoreGeneration = (generation: Generation): void => {
    setRestoredGeneration(generation);
    toast.success('Generation restored to workspace');
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
      
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Failed to download image:', error);
      toast.error('Failed to download image');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Studio</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">Welcome, {user?.email}</span>
              <DarkModeToggle />
              <button
                onClick={logout}
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
              <ImageUpload
                selectedImage={selectedImage}
                onImageSelect={setSelectedImage}
              />
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Generate</h2>
              <GenerationForm
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                onAbort={handleAbort}
                canAbort={!!abortController}
                restoredGeneration={restoredGeneration}
                onClearRestored={() => setRestoredGeneration(null)}
                hasSelectedImage={!!selectedImage}
              />
            </div>

            {latestGeneration && (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Latest Result</h2>
                  <button
                    onClick={() => handleDownload(latestGeneration)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Download</span>
                  </button>
                </div>
                <div className="space-y-3">
                  <img
                    src={latestGeneration.image_url}
                    alt={latestGeneration.prompt}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="text-sm text-gray-600">
                    <p><strong>Prompt:</strong> {latestGeneration.prompt}</p>
                    <p><strong>Style:</strong> {latestGeneration.style}</p>
                    <p><strong>Generated:</strong> {new Date(latestGeneration.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Recent Generations</h2>
              <Suspense fallback={
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                </div>
              }>
                <GenerationHistory
                  generations={generations}
                  onRestore={handleRestoreGeneration}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
