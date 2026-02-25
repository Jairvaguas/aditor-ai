import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getCampaignInsights } from '@/lib/meta-auth';
import { generateAudit } from '@/lib/audit';

export async function POST(request: Request) {
    try {
        const { userId: clerkUserId } = await auth();
        if (!clerkUserId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { adAccountId, currency = 'USD' } = body;

        if (!adAccountId) {
            return NextResponse.json({ error: 'Missing adAccountId' }, { status: 400 });
        }

        // 0. Extract current profile to check lock status (Limit = 1)
        const { data: currentProfile, error: profileFetchError } = await supabaseAdmin
            .from('profiles')
            .select('meta_access_token, selected_ad_account_id, ad_accounts_count')
            .eq('clerk_user_id', clerkUserId)
            .single();

        if (profileFetchError || !currentProfile) {
            console.error('Error fetching profile for lock check:', profileFetchError);
            return NextResponse.json({ error: 'Profile not found' }, { status: 500 });
        }

        const currentLockedAccount = currentProfile.selected_ad_account_id;
        const limitCount = currentProfile.ad_accounts_count || 1;

        // If limit is 1 and already locked to a different account, block it.
        if (limitCount <= 1 && currentLockedAccount && currentLockedAccount !== adAccountId) {
            console.warn(`User ${clerkUserId} attempted to change locked account. Rejected.`);
            return NextResponse.json({ error: 'already_locked' }, { status: 403 });
        }

        // 0.5. Check Global Uniqueness - Is this account claimed by someone else?
        const { data: globalCheck, error: globalCheckError } = await supabaseAdmin
            .from('profiles')
            .select('clerk_user_id')
            .eq('selected_ad_account_id', adAccountId)
            .neq('clerk_user_id', clerkUserId)
            .limit(1);

        if (globalCheckError) {
            console.error('DEBUG - Error de BD en verificación de unicidad global:', globalCheckError);
            return NextResponse.json({ error: 'Database check failed' }, { status: 500 });
        }

        if (globalCheck && globalCheck.length > 0) {
            console.warn(`DEBUG - Bloqueo por Conflicto de Usuario (Fraude): Account ${adAccountId} ya pertenece a ${globalCheck[0].clerk_user_id}. Intento por ${clerkUserId}`);
            return NextResponse.json({ error: 'account_already_in_use' }, { status: 403 });
        }
        
        // Re-vinculación/Éxito: Si todo está en orden y ya le pertenece a este mismo usuario, se permite continuar sin generar error.

        // 1. Save selected account to profiles via UPSERT for safety and log thoroughly
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({ 
                clerk_user_id: clerkUserId, 
                selected_ad_account_id: adAccountId,
                email: 'pending@aditor-ai.com',
                nombre: 'Usuario Meta'
            }, { onConflict: 'clerk_user_id' });

        if (profileError) {
            console.error('DEBUG - Fallo al guardar cuenta seleccionada:', profileError);
            return NextResponse.json({ error: 'Database error storing selection' }, { status: 500 });
        }

        // 2. We already extracted token in step 0, reuse it.
        const tokenError = null;
        const profileData = currentProfile;

        if (tokenError || !profileData || !profileData.meta_access_token) {
            console.error('Error fetching meta token from profiles:', tokenError);
            return NextResponse.json({ error: 'Token not found for user' }, { status: 500 });
        }

        const accessToken = profileData.meta_access_token;

        // 3. Fetch campaigns for the selected account
        const campaigns = await getCampaignInsights(accessToken, adAccountId);

        if (!campaigns || campaigns.length === 0) {
            return NextResponse.json({ error: 'no_campaign_data' }, { status: 400 });
        }

        // 4. Generate audit
        const auditResult = await generateAudit(campaigns, clerkUserId, currency);

        return NextResponse.json({
            success: true,
            auditId: auditResult.id
        });

    } catch (error: any) {
        console.error('Error in select-account API:', error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
