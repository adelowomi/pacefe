import { useState, useEffect } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label,
  placeholder = "Click to upload an image",
  error,
  disabled = false,
  className = ""
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);

  useEffect(() => {
    setPreviewUrl(value || null);
  }, [value]);

  const uploadcarePublicKey = import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY;

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!uploadcarePublicKey) {
      console.error('Uploadcare public key not configured');
      return;
    }

    setIsUploading(true);

    try {
      // Create FormData for Uploadcare upload
      const formData = new FormData();
      formData.append('UPLOADCARE_PUB_KEY', uploadcarePublicKey);
      formData.append('file', file);

      // Upload to Uploadcare
      const response = await fetch('https://upload.uploadcare.com/base/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      const imageUrl = `https://ucarecdn.com/${result.file}/`;
      
      setPreviewUrl(imageUrl);
      onChange(imageUrl);
    } catch (error) {
      console.error('Upload error:', error);
      // You might want to show a toast notification here
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onChange(null);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          <ImageIcon className="h-4 w-4 inline mr-1" />
          {label}
        </label>
      )}
      
      <div className="space-y-3">
        {/* Preview */}
        {previewUrl && (
          <div className="relative inline-block">
            <img
              src={previewUrl}
              alt="Preview"
              className="h-20 w-20 rounded-lg object-cover border border-border"
            />
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        )}

        {/* Upload Button */}
        {!previewUrl && (
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={disabled || isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <div className={`
              w-full px-3 py-8 border-2 border-dashed rounded-lg text-center transition-colors
              ${error ? 'border-red-500' : 'border-border hover:border-primary'}
              ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-accent/50'}
            `}>
              {isUploading ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{placeholder}</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Replace Button */}
        {previewUrl && !disabled && (
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={disabled || isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <button
              type="button"
              disabled={disabled || isUploading}
              className="w-full px-3 py-2 border border-input rounded-md text-sm font-medium text-muted-foreground bg-muted hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUploading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  <span>Uploading...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Replace Image</span>
                </div>
              )}
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {/* Uploadcare Attribution */}
        {!uploadcarePublicKey && (
          <p className="text-xs text-muted-foreground">
            Please configure VITE_UPLOADCARE_PUBLIC_KEY in your environment variables
          </p>
        )}
      </div>
    </div>
  );
}
