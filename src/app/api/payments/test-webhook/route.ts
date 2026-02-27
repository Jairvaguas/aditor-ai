import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(req: Request) {
    // Solo permitir en desarrollo
    if (process.env.NODE_ENV === 'production') {
        return new NextResponse('Not Found', { status: 404 });
    }

    try {
        const url = new URL(req.url);
        const userId = url.searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'Falta el parámetro userId' }, { status: 400 });
        }

        // Simular que Mercado Pago nos envió un status 'authorized'
        const mockSubscriptionId = `test_sub_${Date.now()}`;

        // 1. Revisar si el usuario existe en profiles
        const { data: profile } = await getSupabaseAdmin()
            .from('profiles')
            .select('id')
            .eq('clerk_user_id', userId)
            .single();

        if (!profile) {
            // No existe, crearlo con datos base
            await getSupabaseAdmin()
                .from('profiles')
                .insert({
                    clerk_user_id: userId,
                    email: `test_${userId}@test.com`,
                    nombre: 'Usuario de Prueba',
                    is_subscribed: false
                });
        }

        // 2. Actualizar Supabase (ya sea que existía o se acaba de crear)
        const { data, error } = await getSupabaseAdmin()
            .from('profiles')
            .update({
                is_subscribed: true,
                subscription_id: mockSubscriptionId,
            })
            .eq('clerk_user_id', userId)
            .select();

        if (error) {
            console.error('Error actualizando Supabase:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Webhook simulado con éxito. Usuario suscrito.',
            updated_data: data
        });

    } catch (error: any) {
        console.error('Error en test-webhook:', error);
        return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
    }
}
