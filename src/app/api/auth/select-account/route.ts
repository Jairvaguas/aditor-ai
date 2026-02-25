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

        // 2. Extract token from profiles (legacy code queried connected_accounts)
        const { data: profileData, error: tokenError } = await supabaseAdmin
            .from('profiles')
            .select('meta_access_token')
            .eq('clerk_user_id', clerkUserId)
            .single();

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
