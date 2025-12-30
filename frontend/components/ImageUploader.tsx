'use client';

import { useState } from 'react';
import { toast } from 'sonner';

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
  isLoading?: boolean;
}

export default function ImageUploader({ onImageUpload, isLoading }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be less than 10MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary via backend
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/cloudinary-upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Upload failed');
      }

      toast.success('Image uploaded successfully!');
      onImageUpload(data.imageUrl);
      setPreview(null);
      
      // Reset input
      e.target.value = '';
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload image');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-[var(--brand-purple)] rounded-lg p-6 text-center hover:bg-[var(--paper-accent)] transition-colors">
        <label className="cursor-pointer block">
          <div className="flex flex-col items-center gap-2">
            <svg className="w-8 h-8 text-[var(--brand-purple)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="font-semibold text-[var(--brand-purple)]">Click to upload cover image</p>
              <p className="text-sm text-[var(--ink-gray)]">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading || isLoading}
            className="hidden"
          />
        </label>
      </div>

      {preview && (
        <div className="relative">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-48 object-cover rounded-lg border border-[var(--brand-purple)]"
          />
          <p className="text-xs text-[var(--ink-gray)] mt-2">
            {uploading ? 'Uploading...' : 'Image ready to upload'}
          </p>
        </div>
      )}

      <div className="text-xs text-[var(--ink-gray)] bg-[var(--paper-accent)] p-3 rounded">
        <p className="font-semibold mb-1">💡 Tip:</p>
        <p>Upload a high-quality image for your newsletter cover. Recommended size: 1200x630px</p>
      </div>
    </div>
  );
}
