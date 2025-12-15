/**
 * Cloudinary Image Upload Utility
 * 
 * Handles direct client-side uploads to Cloudinary with validation
 */

export interface UploadResult {
    url: string;
    publicId: string;
}

const MAX_IMAGES = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Validate image files
 */
export function validateImages(files: File[]): { valid: boolean; error?: string } {
    if (files.length === 0) {
        return { valid: false, error: 'No images selected' };
    }

    if (files.length > MAX_IMAGES) {
        return { valid: false, error: `Maximum ${MAX_IMAGES} images allowed` };
    }

    for (const file of files) {
        if (!ALLOWED_TYPES.includes(file.type)) {
            return {
                valid: false,
                error: `Invalid file type: ${file.name}. Only JPEG, PNG, and WebP allowed.`,
            };
        }

        if (file.size > MAX_FILE_SIZE) {
            return {
                valid: false,
                error: `File too large: ${file.name}. Maximum size is 5MB.`,
            };
        }
    }

    return { valid: true };
}

/**
 * Upload images to Cloudinary
 */
export async function uploadImages(files: File[]): Promise<UploadResult[]> {
    // Validate files
    const validation = validateImages(files);
    if (!validation.valid) {
        throw new Error(validation.error);
    }

    // Get upload signature from backend
    const signatureResponse = await fetch('/api/upload/signature', {
        method: 'POST',
    });

    if (!signatureResponse.ok) {
        throw new Error('Failed to get upload signature');
    }

    const { signature, timestamp, cloudName, apiKey, folder } = await signatureResponse.json();

    // Upload each file to Cloudinary
    const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('signature', signature);
        formData.append('timestamp', timestamp.toString());
        formData.append('api_key', apiKey);
        formData.append('folder', folder);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Failed to upload ${file.name}`);
        }

        const data = await response.json();
        return {
            url: data.secure_url,
            publicId: data.public_id,
        };
    });

    const results = await Promise.all(uploadPromises);
    return results;
}

/**
 * Delete image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<void> {
    // Note: Actual deletion requires server-side implementation
    // For now, this is a placeholder
    console.log('Delete image:', publicId);
}

/**
 * Get optimized image URL with transformations
 */
export function getOptimizedImageUrl(
    url: string,
    options?: {
        width?: number;
        height?: number;
        quality?: number;
        format?: 'auto' | 'webp' | 'jpg' | 'png';
    }
): string {
    const { width, height, quality = 80, format = 'auto' } = options || {};

    // Extract public ID from Cloudinary URL
    const urlParts = url.split('/upload/');
    if (urlParts.length !== 2) return url;

    const [base, path] = urlParts;
    const transformations = [];

    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    transformations.push(`q_${quality}`);
    transformations.push(`f_${format}`);

    return `${base}/upload/${transformations.join(',')}/${path}`;
}
