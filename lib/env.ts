/**
 * Environment Variable Validation
 * 
 * This module validates that all required environment variables are present
 * and properly configured before the application starts.
 * 
 * IMPORTANT: Never commit .env files to version control!
 */

type EnvVar = {
    key: string;
    required: boolean;
    description: string;
};

const requiredEnvVars: EnvVar[] = [
    {
        key: 'DATABASE_URL',
        required: true,
        description: 'PostgreSQL database connection string',
    },
    {
        key: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
        required: true,
        description: 'Clerk publishable key for client-side auth',
    },
    {
        key: 'CLERK_SECRET_KEY',
        required: true,
        description: 'Clerk secret key for server-side auth',
    },
    {
        key: 'CLOUDINARY_CLOUD_NAME',
        required: true,
        description: 'Cloudinary cloud name for image storage',
    },
    {
        key: 'CLOUDINARY_API_KEY',
        required: true,
        description: 'Cloudinary API key',
    },
    {
        key: 'CLOUDINARY_API_SECRET',
        required: true,
        description: 'Cloudinary API secret',
    },
];

const optionalEnvVars: EnvVar[] = [
    {
        key: 'NEXT_PUBLIC_CLERK_SIGN_IN_URL',
        required: false,
        description: 'Custom sign-in URL (defaults to /sign-in)',
    },
    {
        key: 'NEXT_PUBLIC_CLERK_SIGN_UP_URL',
        required: false,
        description: 'Custom sign-up URL (defaults to /sign-up)',
    },
    {
        key: 'NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL',
        required: false,
        description: 'Redirect URL after sign-in (defaults to /dashboard)',
    },
    {
        key: 'NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL',
        required: false,
        description: 'Redirect URL after sign-up (defaults to /dashboard)',
    },
    {
        key: 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
        required: false,
        description: 'Cloudinary cloud name for client-side usage',
    },
];

/**
 * Validates that all required environment variables are set
 * @throws {Error} If any required environment variable is missing
 */
export function validateEnv(): void {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required variables
    requiredEnvVars.forEach(({ key, description }) => {
        const value = process.env[key];

        if (!value || value.trim() === '') {
            errors.push(`❌ ${key} is missing (${description})`);
        } else if (isPlaceholder(value)) {
            errors.push(
                `❌ ${key} contains a placeholder value. Please set a real value in .env`
            );
        }
    });

    // Check optional variables
    optionalEnvVars.forEach(({ key, description }) => {
        const value = process.env[key];

        if (!value || value.trim() === '') {
            warnings.push(`⚠️  ${key} is not set (${description})`);
        }
    });

    // Report errors
    if (errors.length > 0) {
        console.error('\n🚨 Environment Variable Validation Failed:\n');
        errors.forEach((error) => console.error(error));
        console.error(
            '\n💡 Copy .env.example to .env and fill in the required values.\n'
        );
        throw new Error('Missing required environment variables');
    }

    // Report warnings
    if (warnings.length > 0 && process.env.NODE_ENV !== 'production') {
        console.warn('\n⚠️  Optional environment variables not set:\n');
        warnings.forEach((warning) => console.warn(warning));
        console.warn('');
    }

    // Success message
    if (process.env.NODE_ENV !== 'production') {
        console.log('✅ Environment variables validated successfully\n');
    }
}

/**
 * Checks if a value appears to be a placeholder
 */
function isPlaceholder(value: string): boolean {
    const placeholders = [
        'your_',
        'xxxxx',
        'pk_test_...',
        'sk_test_...',
        'user:password@localhost',
    ];

    return placeholders.some((placeholder) =>
        value.toLowerCase().includes(placeholder.toLowerCase())
    );
}

/**
 * Gets an environment variable with runtime validation
 * Use this for critical values that should never be undefined
 */
export function getRequiredEnv(key: string): string {
    const value = process.env[key];

    if (!value || value.trim() === '') {
        throw new Error(
            `Required environment variable ${key} is not set. Check your .env file.`
        );
    }

    return value;
}

/**
 * Gets an optional environment variable with a fallback
 */
export function getOptionalEnv(key: string, fallback: string = ''): string {
    return process.env[key] || fallback;
}

// Auto-validate on import (only in Node.js environment, not during build)
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'test') {
    try {
        validateEnv();
    } catch (error) {
        // In development, log the error but don't crash the app
        if (process.env.NODE_ENV === 'development') {
            console.warn('\n⚠️  Environment validation failed, but continuing in development mode\n');
        } else {
            // In production, re-throw the error
            throw error;
        }
    }
}
