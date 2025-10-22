import React, { useState } from 'react';

interface GenerationFormProps {
  onGenerate: (prompt: string, style: string) => Promise<void>;
  isGenerating: boolean;
  onAbort: () => void;
  canAbort: boolean;
  restoredGeneration?: {
    id: number;
    prompt: string;
    style: string;
    image_url: string;
    created_at: string;
    status: string;
  } | null;
  onClearRestored: () => void;
  hasSelectedImage: boolean;
}

const STYLE_OPTIONS = [
  { value: 'realistic', label: 'Realistic' },
  { value: 'artistic', label: 'Artistic' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'modern', label: 'Modern' },
];

export function GenerationForm({ onGenerate, isGenerating, onAbort, canAbort, restoredGeneration, onClearRestored, hasSelectedImage }: GenerationFormProps): JSX.Element {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');

  React.useEffect(() => {
    if (restoredGeneration) {
      setPrompt(restoredGeneration.prompt);
      setStyle(restoredGeneration.style);
    }
  }, [restoredGeneration]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (prompt.trim()) {
      await onGenerate(prompt.trim(), style);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {restoredGeneration && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-blue-700 font-medium">
                Restored from history
              </span>
            </div>
            <button
              type="button"
              onClick={onClearRestored}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Clear
            </button>
          </div>
        </div>
      )}
      
      {restoredGeneration && !hasSelectedImage && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-yellow-700">
              Please upload an image to generate a new version
            </span>
          </div>
        </div>
      )}
      
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
          Prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to generate..."
          className="input-field h-24 resize-none"
          maxLength={500}
          disabled={isGenerating}
        />
        <p className="text-xs text-gray-500 mt-1">
          {prompt.length}/500 characters
        </p>
      </div>

      <div>
        <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-2">
          Style
        </label>
        <select
          id="style"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="input-field"
          disabled={isGenerating}
        >
          {STYLE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          className="btn-primary flex-1"
        >
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>
        
        {canAbort && (
          <button
            type="button"
            onClick={onAbort}
            className="btn-secondary"
          >
            Abort
          </button>
        )}
      </div>

      {isGenerating && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )}
    </form>
  );
}
