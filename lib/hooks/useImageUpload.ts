'use client';

import { useState } from 'react';
import { uploadImages, validateImages, type UploadResult } from '@/lib/upload';

/**
 * React Hook for Image Uploads
 * 
 * Usage:
 * const { uploadedImages, isUploading, error, handleUpload } = useImageUpload();
 */
export function useImageUpload() {
    const [uploadedImages, setUploadedImages] = useState<UploadResult[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpload = async (files: File[]) => {
        setError(null);
        setIsUploading(true);

        try {
            // Validate files
            const validation = validateImages(files);
            if (!validation.valid) {
                setError(validation.error || 'Invalid files');
                setIsUploading(false);
                return;
            }

            // Upload to Cloudinary
            const results = await uploadImages(files);
            setUploadedImages((prev) => [...prev, ...results]);
            setIsUploading(false);
            return results;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
            setIsUploading(false);
            return null;
        }
    };

    const removeImage = (index: number) => {
        setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    };

    const clearImages = () => {
        setUploadedImages([]);
        setError(null);
    };

    return {
        uploadedImages,
        isUploading,
        error,
        handleUpload,
        removeImage,
        clearImages,
    };
}
