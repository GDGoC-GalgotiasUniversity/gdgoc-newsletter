'use client';

import { useState } from 'react';
import { toast } from 'sonner';

interface ImageLinkGeneratorProps {
  isLoading?: boolean;
}

export default function ImageLinkGenerator({ isLoading }: ImageLinkGeneratorProps) {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

      setImageUrl(data.imageUrl);
      toast.success('Image uploaded! Link is ready to copy.');
      
      // Reset input
      e.target.value = '';
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = () => {
    if (imageUrl) {
      navigator.clipboard.writeText(imageUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4 p-6 bg-white border-2 border-[var(--brand-purple)] rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-[var(--brand-purple)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <h3 className="font-bold text-[var(--brand-purple)]">Image Link Generator</h3>
      </div>

      <p className="text-sm text-[var(--ink-gray)]">
        Upload an image to get a direct link. Perfect for adding images to your newsletter content.
      </p>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
        <label className="cursor-pointer block">
          <div className="flex flex-col items-center gap-2">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <div>
              <p className="font-semibold text-gray-700">Click to upload image</p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
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

      {uploading && (
        <div className="flex items-center justify-center gap-2 p-4 bg-blue-50 rounded-lg">
          <div className="animate-spin">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <span className="text-sm text-blue-600 font-medium">Uploading...</span>
        </div>
      )}

      {imageUrl && (
        <div className="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm font-semibold text-green-800">✓ Image uploaded successfully!</p>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={imageUrl}
              readOnly
              className="flex-1 px-3 py-2 bg-white border border-green-300 rounded text-sm font-mono text-gray-700"
            />
            <button
              type="button"
              onClick={copyToClipboard}
              className={`px-4 py-2 rounded font-semibold text-sm transition-colors ${
                copied
                  ? 'bg-green-600 text-white'
                  : 'bg-[var(--brand-purple)] text-white hover:bg-[var(--ink-black)]'
              }`}
            >
              {copied ? '✓ Copied' : 'Copy Link'}
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-green-200">
            <p className="text-xs text-green-700 mb-2">Preview:</p>
            <img src={imageUrl} alt="Uploaded" className="w-full h-32 object-cover rounded border border-green-300" />
          </div>
        </div>
      )}
    </div>
  );
}
