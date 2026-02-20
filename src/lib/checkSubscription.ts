import { supabaseAdmin } from './supabase';

export async function checkSubscription(userId: string): Promise<boolean> {
    if (!userId) return false;

    try {
        const { data, error } = await supabaseAdmin
            .from('profiles')
            .select('is_subscribed, trial_ends_at')
            .eq('clerk_user_id', userId)
            .single();

        if (error || !data) {
            console.error('Error fetching subscription status:', error);
            // Si estamos en desarrollo y no encuentra al usuario, retornamos true para no bloquear el dashboard
            if (process.env.NODE_ENV === 'development') {
                return true;
            }
            return false;
        }

        if (data.is_subscribed) {
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
