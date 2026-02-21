import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { preapproval } from '@/lib/mercadopago';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const email = user.emailAddresses[0]?.emailAddress || 'test@test.com';

        const bodyText = await req.text();
        let accountsCount = 1;
        if (bodyText) {
            try {
                const bodyJson = JSON.parse(bodyText);
                if (bodyJson.accountsCount) {
                    accountsCount = parseInt(bodyJson.accountsCount) || 1;
                }
            } catch (e) {
                console.error("Error parsing body:", e);
            }
        }

        // Update user profile with the requested ad accounts count
        await supabaseAdmin
            .from('profiles')
            .update({ ad_accounts_count: accountsCount })
            .eq('clerk_user_id', userId);

        let estimatedCop = 185000;
        const usdPrice = 47 + ((accountsCount - 1) * 15);
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

        const response = await preapproval.create({
            body: {
                reason: 'Aditor AI - Plan Mensual',
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

        return NextResponse.json({ init_point: response.init_point });
    } catch (error) {
        console.error('Error creating subscription:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
