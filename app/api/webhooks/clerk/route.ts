import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { syncUserFromClerk, deleteUserFromDatabase } from '@/lib/auth';
import { NextResponse } from 'next/server';

/**
 * Clerk Webhook Handler
 * 
 * Syncs user data between Clerk and our database
 * 
 * Events handled:
 * - user.created: Create user in database
 * - user.updated: Update user in database
 * - user.deleted: Delete user from database
 * 
 * Setup in Clerk Dashboard:
 * 1. Go to Webhooks
 * 2. Add endpoint: https://yourdomain.com/api/webhooks/clerk
 * 3. Subscribe to: user.created, user.updated, user.deleted
 * 4. Copy signing secret to CLERK_WEBHOOK_SECRET in .env
 */
export async function POST(req: Request) {
    // Get webhook secret from environment
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error('CLERK_WEBHOOK_SECRET is not set');
    }

    // Get headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    // If missing headers, return error
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Missing svix headers', { status: 400 });
    }

    // Get body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create new Svix instance with secret
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify webhook signature
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error('Webhook verification failed:', err);
        return new Response('Webhook verification failed', { status: 400 });
    }

    // Handle the webhook
    const eventType = evt.type;

    try {
        switch (eventType) {
            case 'user.created':
            case 'user.updated':
                // Sync user to database
                await syncUserFromClerk(evt.data);
                console.log(`✅ User ${eventType}:`, evt.data.id);
                break;

            case 'user.deleted':
                // Delete user from database
                if (evt.data.id) {
                    await deleteUserFromDatabase(evt.data.id);
                    console.log(`✅ User deleted:`, evt.data.id);
                }
                break;

            default:
                console.log(`Unhandled webhook event: ${eventType}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(`Error handling ${eventType}:`, error);
        return new Response('Webhook handler failed', { status: 500 });
    }
}
