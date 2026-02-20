import { NextResponse } from 'next/server';
import { preapproval } from '@/lib/mercadopago';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        const topic = url.searchParams.get('topic');
        const dataId = url.searchParams.get('data.id');

        const body = await req.json().catch(() => ({}));

        // MP puede mandar notificación por querystring o por body
        const id = body?.data?.id || dataId;
        const type = body?.type || topic;

        if (id && (type === 'subscription_preapproval' || body.action === 'created' || body.action === 'updated')) {
            const subscription = await preapproval.get({ id });

            const { status, external_reference } = subscription;

            if (external_reference) { // external_reference es el userId de Clerk
                let is_subscribed = false;
                if (status === 'authorized') {
                    is_subscribed = true;
                } else if (status === 'cancelled' || status === 'paused') {
                    is_subscribed = false;
                }

                await supabaseAdmin
                    .from('profiles')
                    .update({
                        is_subscribed,
                        subscription_id: id,
                    })
                    .eq('clerk_user_id', external_reference);
            }
        }

        return new NextResponse('OK', { status: 200 });
    } catch (error) {
        console.error('Webhook processing error:', error);
        // Para MP siempre retornamos 200 así no reintenta infinitamente si hay un error nuestro
        return new NextResponse('Webhook Received with Error', { status: 200 });
    }
}
