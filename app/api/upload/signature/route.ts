import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";

/**
 * POST /api/upload/signature
 * Generate a signature for secure Cloudinary uploads
 */
export async function POST() {
  try {
    // Get user ID from Clerk auth (more reliable than getCurrentUser for API routes)
    const { userId } = await auth();

    if (!userId) {
      console.warn("Upload signature request without authentication");
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // Verify Cloudinary credentials are set
    if (
      !process.env.CLOUDINARY_API_SECRET ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_CLOUD_NAME
    ) {
      console.error("Missing Cloudinary environment variables", {
        hasSecret: !!process.env.CLOUDINARY_API_SECRET,
        hasKey: !!process.env.CLOUDINARY_API_KEY,
        hasCloud: !!process.env.CLOUDINARY_CLOUD_NAME,
      });
      return NextResponse.json(
        {
          error: "Server configuration error. Cloudinary credentials not set.",
        },
        { status: 500 }
      );
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = "platera/recipes";

    // Generate signature for upload
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error generating upload signature:", {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        error:
          "Failed to generate upload signature. Please refresh and try again.",
        details:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
