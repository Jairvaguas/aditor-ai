import { NextResponse } from 'next/server';
import { preapproval } from '@/lib/mercadopago';
import { getSupabaseAdmin } from '@/lib/supabase';
import { sendSubscriptionActiveEmail } from '@/lib/emails';

export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        const topic = url.searchParams.get('topic');
        const dataId = url.searchParams.get('data.id');

        const body = await req.json().catch(() => ({}));

        const id = body?.data?.id || dataId;
        const type = body?.type || topic;

        if (id && (type === 'subscription_preapproval' || body.action === 'created' || body.action === 'updated')) {
            const subscription = await preapproval.get({ id });

            const { status, external_reference, reason, next_payment_date } = subscription;

            if (external_reference) { 
                let is_subscribed = false;
                if (status === 'authorized') {
                    is_subscribed = true;
                } else if (status === 'cancelled' || status === 'paused') {
                    is_subscribed = false;
                }
                
                // Get pre-existing data
                const { data: profile } = await getSupabaseAdmin()
                    .from('profiles')
                    .select('ad_accounts_count, email, is_subscribed')
                    .eq('clerk_user_id', external_reference)
                    .single();

                await getSupabaseAdmin()
                    .from('profiles')
                    .update({
                        is_subscribed,
                        subscription_id: id,
                    })
                    .eq('clerk_user_id', external_reference);
                    
                // Send email ONLY upon fresh subscription active transition
                if (status === 'authorized' && profile && !profile.is_subscribed) {
                    const accountsLimit = profile.ad_accounts_count || 1;
                    const nextPaymentTs = next_payment_date ? Math.floor(new Date(next_payment_date).getTime() / 1000) : undefined;
                    
                    await sendSubscriptionActiveEmail(
                       profile.email,
                       reason || "Aditor AI Pro",
                       accountsLimit,
                       nextPaymentTs
                    );
                }
            }
        }

        return new NextResponse('OK', { status: 200 });
    } catch (error) {
        console.error('Webhook processing error:', error);
        return new NextResponse('Webhook Received with Error', { status: 200 });
    }
}