import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getCurrentUser } from '@/lib/auth';

/**
 * POST /api/upload/signature
 * Generate a signature for secure Cloudinary uploads
 */
export async function POST() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const timestamp = Math.round(new Date().getTime() / 1000);
        const folder = 'platera/recipes';

        // Generate signature for upload
        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp,
                folder,
                upload_preset: 'platera_recipes',
            },
            process.env.CLOUDINARY_API_SECRET!
        );

        return NextResponse.json({
            signature,
            timestamp,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
            folder,
        });
    } catch (error) {
        console.error('Error generating upload signature:', error);
        return NextResponse.json({ error: 'Failed to generate signature' }, { status: 500 });
    }
}
