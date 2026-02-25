import { supabaseAdmin } from './supabase';

export async function checkSubscription(userId: string): Promise<boolean> {
    if (!userId) return false;

    try {
        const { data, error } = await supabaseAdmin
            .from('profiles')
            .select('is_subscribed, trial_ends_at, plan')
            .eq('clerk_user_id', userId)
            .single();

        if (error || !data) {
            console.error('Error fetching subscription status:', error);
            // Si el perfil no existe todavía (demora del webhook de Clerk),
            // se asume usuario nuevo en periodo de prueba de 7 días.
            return true;
        }

        if (data.is_subscribed) {
            return true;
        }

        if (data.plan === 'trial') {
            return true;
        }

        if (data.trial_ends_at) {
            const trialEndsAt = new Date(data.trial_ends_at).getTime();
            const now = new Date().getTime();
            if (trialEndsAt > now) {
                return true;
            }
        }

        return false;
    } catch (error) {
        console.error('Error verifying subscription in checkSubscription:', error);
        return false;
    }
}
