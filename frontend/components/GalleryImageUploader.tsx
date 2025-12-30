'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';

interface GalleryImageUploaderProps {
    onImageUpload: (imageUrl: string) => void;
    isLoading?: boolean;
}

export default function GalleryImageUploader({ onImageUpload, isLoading }: GalleryImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (files: FileList) => {
        const validFiles: File[] = [];

        // Validate all files first
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (!file.type.startsWith('image/')) {
                toast.error(`${file.name} is not an image file`);
                continue;
            }

            if (file.size > 10 * 1024 * 1024) {
                toast.error(`${file.name} exceeds 10MB limit`);
                continue;
            }

            validFiles.push(file);
        }

        if (validFiles.length === 0) return;

        setUploading(true);
        const uploadPromises = validFiles.map(async (file) => {
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

                return data.imageUrl;
            } catch (error: any) {
                console.error(`Upload error for ${file.name}:`, error);
                toast.error(`Failed to upload ${file.name}`);
                return null;
            }
        });

        try {
            const results = await Promise.all(uploadPromises);
            const successfulUploads = results.filter((url): url is string => url !== null);

            if (successfulUploads.length > 0) {
                toast.success(`${successfulUploads.length} image${successfulUploads.length > 1 ? 's' : ''} uploaded!`);
                successfulUploads.forEach(url => onImageUpload(url));
            }

            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error('Failed to upload images');
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
        if (files && files.length > 0) {
            await handleUpload(files);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            await handleUpload(files);
        }
    };

    return (
        <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-all cursor-pointer ${dragActive
                    ? 'border-[var(--brand-purple)] bg-purple-50 scale-105'
                    : 'border-gray-300 bg-gray-50 hover:border-[var(--brand-purple)] hover:bg-purple-50'
                } ${uploading || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                disabled={uploading || isLoading}
                className="hidden"
            />

            <label className="cursor-pointer block" onClick={() => fileInputRef.current?.click()}>
                <div className="flex flex-col items-center gap-2">
                    {uploading ? (
                        <>
                            <div className="animate-spin">
                                <svg className="w-6 h-6 text-[var(--brand-purple)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <p className="text-xs font-semibold text-[var(--brand-purple)]">Uploading...</p>
                        </>
                    ) : (
                        <>
                            <svg className="w-6 h-6 text-[var(--brand-purple)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <div>
                                <p className="text-xs font-bold text-[var(--brand-purple)]">Drop or click to upload</p>
                                <p className="text-xs text-gray-500">Select multiple files (PNG, JPG, GIF, max 10MB each)</p>
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
