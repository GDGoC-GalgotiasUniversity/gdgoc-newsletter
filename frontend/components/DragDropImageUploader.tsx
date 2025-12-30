'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';

interface DragDropImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
  isLoading?: boolean;
}

export default function DragDropImageUploader({ onImageUpload, isLoading }: DragDropImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
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

      toast.success('Image uploaded to Cloudinary!');
      onImageUpload(data.imageUrl);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      await handleUpload(files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      await handleUpload(files[0]);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`relative border-3 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
        dragActive
          ? 'border-[var(--brand-purple)] bg-[var(--paper-accent)] scale-105'
          : 'border-gray-300 bg-gray-50 hover:border-[var(--brand-purple)] hover:bg-[var(--paper-accent)]'
      } ${uploading || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading || isLoading}
        className="hidden"
      />

      <label className="cursor-pointer block" onClick={() => fileInputRef.current?.click()}>
        <div className="flex flex-col items-center gap-3">
          {uploading ? (
            <>
              <div className="animate-spin">
                <svg className="w-10 h-10 text-[var(--brand-purple)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <p className="font-semibold text-[var(--brand-purple)]">Uploading to Cloudinary...</p>
            </>
          ) : (
            <>
              <svg className="w-12 h-12 text-[var(--brand-purple)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div>
                <p className="font-bold text-[var(--brand-purple)] text-lg">Drop image here or click to upload</p>
                <p className="text-sm text-gray-600 mt-1">PNG, JPG, GIF up to 10MB</p>
              </div>
            </>
          )}
        </div>
      </label>

      {dragActive && (
        <div className="absolute inset-0 bg-[var(--brand-purple)]/10 rounded-lg pointer-events-none" />
      )}
    </div>
  );
}
