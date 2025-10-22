import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';

interface ImageUploadProps {
  selectedImage: File | null;
  onImageSelect: (file: File | null) => void;
}

export function ImageUpload({ selectedImage, onImageSelect }: ImageUploadProps): JSX.Element {
  const [isCompressing, setIsCompressing] = useState(false);

  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/jpeg',
      quality: 0.8,
    };
    
    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Image compression failed:', error);
      return file;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      setIsCompressing(true);
      try {
        const compressedFile = await compressImage(file);
        onImageSelect(compressedFile);
      } catch (error) {
        console.error('Failed to process image:', error);
        onImageSelect(file);
      } finally {
        setIsCompressing(false);
      }
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024,
  });

  const removeImage = (): void => {
    onImageSelect(null);
  };

  return (
    <div className="space-y-4">
      {isCompressing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-blue-700">Compressing image...</span>
          </div>
        </div>
      )}
      
      {selectedImage ? (
        <div className="relative">
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected"
            className="w-full h-64 object-cover rounded-lg"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
            aria-label="Remove image"
          >
            ×
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          data-testid="image-upload"
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${isCompressing ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <input {...getInputProps()} disabled={isCompressing} />
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-sm text-gray-600">
              {isDragActive
                ? 'Drop the image here'
                : 'Drag & drop an image here, or click to select'}
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG up to 10MB (will be resized to max 1920px)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
