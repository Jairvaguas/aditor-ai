import { getSupabaseAdmin } from './supabase';

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
        const { data: accountData, error: accountError } = await getSupabaseAdmin()
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
        const { data: profileData, error: profileError } = await getSupabaseAdmin()
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
    console.log("Variables check:", { appId: !!process.env.NEXT_PUBLIC_FACEBOOK_APP_ID, secret: !!process.env.FACEBOOK_APP_SECRET });

    const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
        client_secret: process.env.FACEBOOK_APP_SECRET!,
        redirect_uri: `https://www.aditor-ai.com/api/meta/callback`,
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
    const accountId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`;

    // Paso 1: Obtener datos de campaña con objetivo, presupuesto y estado
    const campaignsRes = await fetch(
        `${BASE_URL}/${accountId}/campaigns?fields=id,name,status,objective,buying_type,daily_budget,lifetime_budget,bid_strategy,configured_status,effective_status&limit=50&access_token=${accessToken}`
    );
    const campaignsData = await campaignsRes.json();
    if (campaignsData.error) throw new Error(campaignsData.error.message);

    const campaigns = campaignsData.data || [];

    // Paso 2: Obtener adsets para conocer optimization_goal y destination_type
    const adsetsRes = await fetch(
        `${BASE_URL}/${accountId}/adsets?fields=id,name,campaign_id,optimization_goal,destination_type,targeting,daily_budget,lifetime_budget,bid_amount,status&limit=100&access_token=${accessToken}`
    );
    const adsetsData = await adsetsRes.json();
    const adsets = adsetsData.data || [];

    // Agrupar adsets por campaign_id
    const adsetsByCampaign: Record<string, any[]> = {};
    for (const adset of adsets) {
        const cid = adset.campaign_id;
        if (!adsetsByCampaign[cid]) adsetsByCampaign[cid] = [];
        adsetsByCampaign[cid].push({
            name: adset.name,
            optimization_goal: adset.optimization_goal,
            destination_type: adset.destination_type,
            daily_budget: adset.daily_budget,
            lifetime_budget: adset.lifetime_budget,
            bid_amount: adset.bid_amount,
            status: adset.status,
        });
    }

    // Paso 3: Obtener insights con todas las métricas relevantes
    const insightsRes = await fetch(
        `${BASE_URL}/${accountId}/insights?fields=campaign_id,campaign_name,spend,impressions,clicks,reach,ctr,cpm,cpc,frequency,actions,action_values,cost_per_action_type,conversions,conversion_values,objective&date_preset=last_30d&level=campaign&limit=50&access_token=${accessToken}`
    );
    const insightsData = await insightsRes.json();
    const insights = insightsData.data || [];

    // Indexar insights por campaign_id
    const insightsByCampaign: Record<string, any> = {};
    for (const insight of insights) {
        insightsByCampaign[insight.campaign_id] = insight;
    }

    // Paso 4: Combinar todo
    return campaigns.map((c: any) => {
        const insight = insightsByCampaign[c.id] || {};
        const campaignAdsets = adsetsByCampaign[c.id] || [];

        // Determinar el destination_type principal (el más común entre adsets)
        const destinations = campaignAdsets.map((a: any) => a.destination_type).filter(Boolean);
        const primaryDestination = destinations.length > 0
            ? destinations.sort((a: string, b: string) =>
                destinations.filter((v: string) => v === a).length - destinations.filter((v: string) => v === b).length
              ).pop()
            : 'UNKNOWN';

        // Determinar optimization_goal principal
        const optimizations = campaignAdsets.map((a: any) => a.optimization_goal).filter(Boolean);
        const primaryOptimization = optimizations.length > 0
            ? optimizations.sort((a: string, b: string) =>
                optimizations.filter((v: string) => v === a).length - optimizations.filter((v: string) => v === b).length
              ).pop()
            : 'UNKNOWN';

        // Extraer purchase/lead values para calcular ROAS
        const actionValues = insight.action_values || [];
        const purchaseValue = actionValues.find((a: any) => a.action_type === 'purchase')?.value || 0;
        const leadValue = actionValues.find((a: any) => a.action_type === 'lead')?.value || 0;

        const actions = insight.actions || [];
        const purchases = actions.find((a: any) => a.action_type === 'purchase')?.value || 0;
        const leads = actions.find((a: any) => a.action_type === 'lead')?.value || 0;
        const addToCart = actions.find((a: any) => a.action_type === 'add_to_cart')?.value || 0;
        const initiateCheckout = actions.find((a: any) => a.action_type === 'initiate_checkout')?.value || 0;
        const linkClicks = actions.find((a: any) => a.action_type === 'link_click')?.value || 0;
        const landingPageViews = actions.find((a: any) => a.action_type === 'landing_page_view')?.value || 0;
        const messagingConversations = actions.find((a: any) => 
            a.action_type === 'onsite_conversion.messaging_conversation_started_7d' || 
            a.action_type === 'messaging_conversation_started_7d'
        )?.value || 0;
        const completeRegistrations = actions.find((a: any) => a.action_type === 'complete_registration')?.value || 0;

        const follows = actions.find((a: any) => 
            a.action_type === 'follow' || 
            a.action_type === 'page_engagement' ||
            a.action_type === 'like'
        )?.value || 0;

        const costPerFollower = spend > 0 && follows > 0 ? (spend / parseInt(follows)).toFixed(2) : null;


        const spend = parseFloat(insight.spend || '0');
        const roas = spend > 0 && purchaseValue > 0 ? (parseFloat(purchaseValue) / spend).toFixed(2) : null;
        const costPerLead = spend > 0 && leads > 0 ? (spend / parseInt(leads)).toFixed(2) : null;
        const costPerMessage = spend > 0 && messagingConversations > 0 ? (spend / parseInt(messagingConversations)).toFixed(2) : null;

        return {
            campaign_id: c.id,
            campaign_name: c.name,
            status: c.status,
            effective_status: c.effective_status,
            objective: c.objective,
            buying_type: c.buying_type,
            daily_budget: c.daily_budget,
            lifetime_budget: c.lifetime_budget,
            bid_strategy: c.bid_strategy,
            destination_type: primaryDestination,
            optimization_goal: primaryOptimization,
            adsets_count: campaignAdsets.length,
            spend: insight.spend || '0',
            impressions: insight.impressions || '0',
            clicks: insight.clicks || '0',
            reach: insight.reach || '0',
            ctr: insight.ctr || '0',
            cpm: insight.cpm || '0',
            cpc: insight.cpc || '0',
            frequency: insight.frequency || '0',
            purchases,
            purchase_value: purchaseValue,
            roas,
            leads,
            cost_per_lead: costPerLead,
            add_to_cart: addToCart,
            initiate_checkout: initiateCheckout,
            link_clicks: linkClicks,
            landing_page_views: landingPageViews,
            messaging_conversations: messagingConversations,
            cost_per_message: costPerMessage,
            complete_registrations: completeRegistrations,
            follows,
            cost_per_follower: costPerFollower,
            actions: insight.actions || [],
        };
    });
}
