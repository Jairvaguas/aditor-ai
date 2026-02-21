import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { currentUser } from '@clerk/nextjs/server';

export async function POST() {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // Cancel subscription by setting is_subscribed to false and clearing subscription_id
        const { error } = await supabaseAdmin
            .from('profiles')
            .update({
                is_subscribed: false,
                subscription_id: null,
            })
            .eq('clerk_user_id', user.id);

        if (error) {
            console.error('Error canceling subscription in Supabase:', error);
            return NextResponse.json({ error: 'Error al cancelar la suscripción' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Suscripción cancelada correctamente' });

    } catch (error) {
        console.error('Error in cancel-subscription route:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
