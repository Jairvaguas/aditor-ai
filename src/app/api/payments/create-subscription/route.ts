import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { preapproval } from '@/lib/mercadopago';
import { getSupabaseAdmin } from '@/lib/supabase';
import { sendMetaEvent } from '@/lib/meta-pixel';

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const email = user.emailAddresses[0]?.emailAddress || 'test@test.com';

        let planType = 'basic';
        let extraAccounts = 0;

        const bodyText = await req.text();
        if (bodyText) {
            try {
                const bodyJson = JSON.parse(bodyText);
                planType = bodyJson.planType || 'basic';
                extraAccounts = parseInt(bodyJson.extraAccounts) || 0;
            } catch (e) {
                console.error("Error parsing body:", e);
            }
        }

        // Calcular precio en USD
        const basePrice = planType === 'pro' ? 39 : 24;
        const additionalCost = extraAccounts * 15;
        const usdPrice = basePrice + additionalCost;
        const totalAccounts = 1 + extraAccounts;

        // Actualizar perfil con plan y cantidad de cuentas
        await getSupabaseAdmin()
            .from('profiles')
            .update({ 
                ad_accounts_count: totalAccounts,
                plan: planType
            })
            .eq('clerk_user_id', userId);

        // Convertir a COP
        let estimatedCop = Math.round(usdPrice * 4200);
        try {
            const copRes = await fetch("https://api.exchangerate-api.com/v4/latest/USD", { next: { revalidate: 3600 } });
            if (copRes.ok) {
                const data = await copRes.json();
                if (data && data.rates && data.rates.COP) {
                    estimatedCop = Math.round(usdPrice * data.rates.COP);
                }
            }
        } catch (e) {
            console.error("Error fetching exchange rate:", e);
        }

        const planLabel = planType === 'pro' ? 'Pro' : 'Básico';

        const response = await preapproval.create({
            body: {
                reason: `Aditor AI - Plan ${planLabel} (${totalAccounts} cuenta${totalAccounts > 1 ? 's' : ''})`,
                auto_recurring: {
                    frequency: 1,
                    frequency_type: 'months',
                    transaction_amount: estimatedCop,
                    currency_id: 'COP',
                    free_trial: {
                        frequency: 7,
                        frequency_type: 'days'
                    }
                },
                back_url: `${appUrl}/dashboard`,
                payer_email: email,
                external_reference: userId,
                status: 'pending',
            } as any
        });

        // Enviar evento InitiateCheckout a Meta
        await sendMetaEvent({
            eventName: 'InitiateCheckout',
            eventSourceUrl: 'https://www.aditor-ai.com/subscribe',
            userData: {
                externalId: userId,
            },
            customData: {
                value: usdPrice,
                currency: 'USD',
                contentName: `Plan ${planLabel} - ${totalAccounts} cuenta${totalAccounts > 1 ? 's' : ''}`,
            },
        });

        return NextResponse.json({ init_point: response.init_point });
    } catch (error) {
        console.error('Error creating subscription:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
