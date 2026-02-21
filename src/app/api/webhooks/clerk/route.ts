import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/lib/emails'

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('Please add CLERK_WEBHOOK_SECRET to .env.local')
        } else {
            throw new Error('Please add CLERK_WEBHOOK_SECRET to .env.local')
        }
    }

    const headerPayload = await headers()
    const svix_id = headerPayload.get('svix-id')
    const svix_timestamp = headerPayload.get('svix-timestamp')
    const svix_signature = headerPayload.get('svix-signature')

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new NextResponse('Error occured -- no svix headers', {
            status: 400,
        })
    }

    const payload = await req.json()
    const body = JSON.stringify(payload)

    let evt: WebhookEvent

    if (WEBHOOK_SECRET) {
        const wh = new Webhook(WEBHOOK_SECRET)

        try {
            evt = wh.verify(body, {
                'svix-id': svix_id,
                'svix-timestamp': svix_timestamp,
                'svix-signature': svix_signature,
            }) as WebhookEvent
        } catch (err) {
            console.error('Error verifying webhook:', err)
            return new NextResponse('Error occured', {
                status: 400,
            })
        }
    } else {
        if (process.env.NODE_ENV === 'development') {
            evt = payload as WebhookEvent;
        } else {
            return new NextResponse('Error occured', { status: 400 });
        }
    }

    const { id } = evt.data
    const eventType = evt.type

    if (eventType === 'user.created') {
        const { email_addresses, first_name, last_name } = evt.data
        const primaryEmail = email_addresses?.find((email: any) => email.id === evt.data.primary_email_address_id)?.email_address || email_addresses?.[0]?.email_address || 'default@email.com';
        const nombre = [first_name, last_name].filter(Boolean).join(' ') || 'User';

        const { error } = await supabaseAdmin
            .from('profiles')
            .insert({
                clerk_user_id: id,
                email: primaryEmail,
                nombre: nombre,
            })

        if (error) {
            console.error('Error inserting profile in webhook', error);
            return new NextResponse('Error inserting profile', { status: 500 });
        }
        
        // Dispatch Welcome Email
        await sendWelcomeEmail(primaryEmail, nombre);
    }

    return new NextResponse('', { status: 200 })
}