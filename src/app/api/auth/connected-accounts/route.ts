import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
    try {
        const { userId: clerkUserId } = await auth();
        if (!clerkUserId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = getSupabaseAdmin();

        const { data: accounts, error } = await supabase
            .from('connected_accounts')
            .select('ad_account_id, account_name, currency, connected_at')
            .eq('user_id', clerkUserId)
            .eq('is_active', true)
            .order('connected_at', { ascending: true });

        if (error) {
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('selected_ad_account_id, ad_accounts_count')
            .eq('clerk_user_id', clerkUserId)
            .single();

        return NextResponse.json({
            accounts: accounts || [],
            selectedAccountId: profile?.selected_ad_account_id,
            maxAccounts: profile?.ad_accounts_count || 1
        });

    } catch (error: any) {
        console.error('Error fetching connected accounts:', error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
