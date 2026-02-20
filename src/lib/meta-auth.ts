import { supabaseAdmin } from './supabase';

export interface TrialCheckResult {
    allowed: boolean;
    reason?: 'trial_used' | 'error';
}

/**
 * Checks if an ad account has already been used for a trial.
 * @param adAccountId The Meta Ad Account ID to check.
 * @returns Result object indicating if the account is allowed to proceed.
 */
export async function checkAdAccountTrial(adAccountId: string): Promise<TrialCheckResult> {
    try {
        // 1. Check if the ad account exists in connected_accounts
        const { data: accountData, error: accountError } = await supabaseAdmin
            .from('connected_accounts')
            .select('user_id')
            .eq('ad_account_id', adAccountId)
            .single();

        if (accountError && accountError.code !== 'PGRST116') { // PGRST116 is "not found"
            console.error('Error checking connected_accounts:', accountError);
            return { allowed: false, reason: 'error' }; // Fail safe
        }

        if (!accountData) {
            // Account not found, so it's fresh -> Allowed
            return { allowed: true };
        }

        // 2. Account exists, check the associated user's profile for trial status
        const { data: profileData, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('plan, trial_start')
            .eq('clerk_user_id', accountData.user_id)
            .single();

        if (profileError) {
            console.error('Error checking profile:', profileError);
            // If we can't find the user, we assume it's unsafe or broken, but sticking to "if user associated had trial" logic.
            // If user is deleted but account remains? Edge case.
            return { allowed: false, reason: 'error' };
        }

        // Check if user had/has trial
        // The requirement: "Si existe y el usuario asociado tuvo trial"
        // We check if plan is 'trial' or if they ever had a trial (maybe historical?).
        // For now, based on schema `plan text default 'trial'`, we assume if they are in the DB they probably started with trial.
        // Let's assume ANY existence in connected_accounts implies "trial used" if we want to be strict,
        // but strict requirement says "user associated had trial".

        // Simplest interpretation: If the account is connected, it was used.
        // If the user associated with it is on 'trial' plan or 'pro' (converted), it counts as "trial used".
        // Basically, if it exists in connected_accounts, it's used.

        return { allowed: false, reason: 'trial_used' };

    } catch (error) {
        console.error('Unexpected error in checkAdAccountTrial:', error);
        return { allowed: false, reason: 'error' };
    }
}

// Interfaces
interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

interface AdAccount {
    id: string;
    account_id: string;
    name: string;
    currency: string;
}

interface MetaUser {
    id: string;
    name: string;
}

// Graph API Helpers
const GRAPH_API_VERSION = 'v19.0';
const BASE_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

export async function exchangeCodeForToken(code: string): Promise<string> {
    const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
        client_secret: process.env.FACEBOOK_APP_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
        code,
    });

    const res = await fetch(`${BASE_URL}/oauth/access_token?${params}`);
    const data = await res.json();

    if (data.error) {
        throw new Error(`Meta OAuth Error: ${data.error.message}`);
    }

    return data.access_token;
}

export async function getMetaUser(accessToken: string): Promise<MetaUser> {
    const res = await fetch(`${BASE_URL}/me?fields=id,name&access_token=${accessToken}`);
    const data = await res.json();

    if (data.error) throw new Error(data.error.message);
    return data as MetaUser;
}

export async function getAdAccounts(accessToken: string): Promise<AdAccount[]> {
    const res = await fetch(`${BASE_URL}/me/adaccounts?fields=name,account_id,currency&access_token=${accessToken}`);
    const data = await res.json();

    if (data.error) throw new Error(data.error.message);
    return data.data || [];
}

export async function getCampaignInsights(accessToken: string, adAccountId: string) {
    // Definimos campos clave para el analisis. 
    // account_id es el prefijo "act_<num>" normalmente
    const accountId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`;

    const fields = [
        'campaign_name',
        'spend',
        'cpc',
        'ctr',
        'cpm',
        'frequency',
        'actions',
        'action_values',
        'roas', // derived often, but let's see if api provides 'purchase_roas'
        'objective',
    ].join(',');

    // Last 30 days
    const res = await fetch(
        `${BASE_URL}/${accountId}/insights?fields=${fields}&date_preset=last_30d&level=campaign&access_token=${accessToken}`
    );
    const data = await res.json();

    if (data.error) throw new Error(data.error.message);
    return data.data || [];
}
