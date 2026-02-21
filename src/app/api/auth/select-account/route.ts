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
        const { adAccountId } = body;

        if (!adAccountId) {
            return NextResponse.json({ error: 'Missing adAccountId' }, { status: 400 });
        }

        // 1. Save selected account to profiles
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({ selected_ad_account_id: adAccountId })
            .eq('clerk_user_id', clerkUserId);

        if (profileError) {
            console.error('Error updating selected ad account:', profileError);
            return NextResponse.json({ error: 'Database error storing selection' }, { status: 500 });
        }

        // 2. We need the access token for this user to fetch campaigns
        const { data: connectedAccount, error: accountError } = await supabaseAdmin
            .from('connected_accounts')
            .select('access_token, currency')
            .eq('user_id', clerkUserId)
            .single(); // we assume they have a token

        if (accountError || !connectedAccount) {
            console.error('Error fetching connected account:', accountError);
            return NextResponse.json({ error: 'Token not found for user' }, { status: 500 });
        }

        const { access_token: accessToken, currency } = connectedAccount;

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
