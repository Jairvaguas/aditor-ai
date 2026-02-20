import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { preapproval } from '@/lib/mercadopago';

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const email = user.emailAddresses[0]?.emailAddress || 'test@test.com';

        const response = await preapproval.create({
            body: {
                reason: 'Aditor AI - Plan Mensual',
                auto_recurring: {
                    frequency: 1,
                    frequency_type: 'months',
                    transaction_amount: 185000,
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
