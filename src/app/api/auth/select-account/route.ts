import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { sendMetaEvent } from '@/lib/meta-pixel';

export async function POST(request: Request) {
    try {
        const { userId: clerkUserId } = await auth();
        if (!clerkUserId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { adAccountId, accountName, currency = 'USD' } = body;

        if (!adAccountId) {
            return NextResponse.json({ error: 'Missing adAccountId' }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();

        // 1. Obtener perfil del usuario
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('meta_access_token, selected_ad_account_id, ad_accounts_count')
            .eq('clerk_user_id', clerkUserId)
            .single();

        if (profileError || !profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 500 });
        }

        const maxAccounts = profile.ad_accounts_count || 1;

        // 2. Contar cuentas ya vinculadas por este usuario
        const { count: currentCount } = await supabase
            .from('connected_accounts')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', clerkUserId)
            .eq('is_active', true);

        // 3. Verificar si esta cuenta ya está vinculada por este usuario
        const { data: existingAccount } = await supabase
            .from('connected_accounts')
            .select('id')
            .eq('user_id', clerkUserId)
            .eq('ad_account_id', adAccountId)
            .single();

        if (existingAccount) {
            // Ya la tiene vinculada, simplemente seleccionarla como activa
            await supabase
                .from('profiles')
                .update({ selected_ad_account_id: adAccountId, moneda: currency })
                .eq('clerk_user_id', clerkUserId);

            return NextResponse.json({ success: true, redirectUrl: '/dashboard' });
        }

        // 4. Verificar que no exceda el límite de cuentas
        if ((currentCount || 0) >= maxAccounts) {
            return NextResponse.json({ 
                error: 'account_limit_reached',
                message: `Tu plan permite ${maxAccounts} cuenta(s). Upgrade para agregar más.`,
                currentCount,
                maxAccounts
            }, { status: 403 });
        }

        // 5. Verificar que la cuenta no esté reclamada por otro usuario
        const { data: globalCheck } = await supabase
            .from('connected_accounts')
            .select('user_id')
            .eq('ad_account_id', adAccountId)
            .eq('is_active', true)
            .neq('user_id', clerkUserId)
            .limit(1);

        if (globalCheck && globalCheck.length > 0) {
            return NextResponse.json({ error: 'account_already_in_use' }, { status: 403 });
        }

        // 6. Insertar nueva cuenta vinculada
        const { error: insertError } = await supabase
            .from('connected_accounts')
            .insert({
                user_id: clerkUserId,
                ad_account_id: adAccountId,
                account_name: accountName || `Cuenta ${adAccountId}`,
                currency: currency,
                is_active: true
            });

        if (insertError) {
            console.error('Error inserting connected account:', insertError);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        // 7. Actualizar selected_ad_account_id en profiles (cuenta activa en el dashboard)
        await supabase
            .from('profiles')
            .update({ 
                selected_ad_account_id: adAccountId,
                moneda: currency
            })
            .eq('clerk_user_id', clerkUserId);


        // Enviar evento StartTrial a Meta
        await sendMetaEvent({
            eventName: 'StartTrial',
            eventSourceUrl: 'https://www.aditor-ai.com/conectar/cuentas',
            userData: {
                externalId: clerkUserId,
            },
            customData: {
                contentName: `Ad Account ${adAccountId}`,
            },
        });

        return NextResponse.json({ success: true, redirectUrl: '/dashboard' });

    } catch (error: any) {
        console.error('Error in select-account API:', error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
