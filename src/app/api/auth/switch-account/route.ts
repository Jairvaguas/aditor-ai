import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const { userId: clerkUserId } = await auth();
        if (!clerkUserId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { adAccountId } = await request.json();
        if (!adAccountId) {
            return NextResponse.json({ error: 'Missing adAccountId' }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();

        // Verificar que la cuenta pertenece al usuario
        const { data: account } = await supabase
            .from('connected_accounts')
            .select('id, currency')
            .eq('user_id', clerkUserId)
            .eq('ad_account_id', adAccountId)
            .eq('is_active', true)
            .single();

        if (!account) {
            return NextResponse.json({ error: 'Account not found or not yours' }, { status: 404 });
        }

        // Actualizar la cuenta seleccionada en el perfil
        await supabase
            .from('profiles')
            .update({ 
                selected_ad_account_id: adAccountId,
                moneda: account.currency || 'USD'
            })
            .eq('clerk_user_id', clerkUserId);

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Error switching account:', error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
