import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { preapproval } from '@/lib/mercadopago';
import { getSupabaseAdmin } from '@/lib/supabase';

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
        await getSupabaseAdmin()
            .from('profiles')
            .update({ ad_accounts_count: accountsCount })
            .eq('clerk_user_id', userId);

        let estimatedCop = 185000;
        let usdPrice = 47;
        if (accountsCount === 1) usdPrice = 47;
        else if (accountsCount === 2) usdPrice = 62;
        else if (accountsCount === 3) usdPrice = 77;
        else if (accountsCount === 4) usdPrice = 92;
        else if (accountsCount === 5) usdPrice = 107;
        else if (accountsCount === 10) usdPrice = 157; // 6-10 package
        else if (accountsCount === 15) usdPrice = 197; // 11-15 package
        else if (accountsCount === 16) usdPrice = 0;   // 16+ package (contact)
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
