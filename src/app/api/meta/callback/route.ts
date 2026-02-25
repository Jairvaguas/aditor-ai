
import { NextResponse } from 'next/server';
import { exchangeCodeForToken, getAdAccounts, getCampaignInsights, getMetaUser } from '@/lib/meta-auth';
import { generateAudit } from '@/lib/audit';
import { supabaseAdmin } from '@/lib/supabase';
import { clerkClient } from '@clerk/nextjs/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    console.log('=== META CALLBACK ===');
    console.log('code:', searchParams.get('code'));
    console.log('state:', searchParams.get('state'));
    console.log('error:', searchParams.get('error'));

    // 1. Validar request
    if (error) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar?error=auth_denied`);
    }

    if (!code || !state) {
        console.error('Missing params:', { code, state });
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar?error=missing_params`);
    }

    // TODO: Validar state cookie (simplificado para MVP, pero recomendado)

    try {
        // Obtenemos user de Clerk actual
        const clerkUserId = state; // We receive Clerk userId from Meta 'state' param

        if (!clerkUserId) {
            // Si no tiene sesion, redirigimos a login, y luego a conectar
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?redirect=/conectar`);
        }

        // 2. Intercambio de Token
        const accessToken = await exchangeCodeForToken(code);

        // --- DUPLICATE PROFILE CLEANUP LOGIC ---
        let userEmail = 'pending@aditor-ai.com';
        let userName = 'Usuario Meta';
        try {
            const client = typeof clerkClient === 'function' ? await clerkClient() : clerkClient;
            const user = await client.users.getUser(clerkUserId);
            if (user && user.emailAddresses && user.emailAddresses.length > 0) {
                userEmail = user.emailAddresses[0].emailAddress;
            }
            if (user && (user.firstName || user.lastName)) {
                userName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
            }
            
            console.log(`DEBUG - Email real obtenido de Clerk: ${userEmail}`);
            
            if (userEmail !== 'pending@aditor-ai.com') {
                const { data: existingProfile } = await supabaseAdmin
                    .from('profiles')
                    .select('id, clerk_user_id')
                    .eq('email', userEmail)
                    .neq('clerk_user_id', clerkUserId)
                    .single();
                    
                if (existingProfile) {
                    console.log(`DEBUG - Resolviendo duplicado: Actualizando clerk_user_id de ${existingProfile.clerk_user_id} a ${clerkUserId} para el email ${userEmail}`);
                    await supabaseAdmin
                        .from('profiles')
                        .update({ clerk_user_id: clerkUserId })
                        .eq('id', existingProfile.id);
                }
            }
        } catch (e: any) {
            console.error("Warning: Could not fetch or cleanup user from Clerk:", e.message || e);
        }
        // ---------------------------------------

        // --- DYNAMIC GEOLOCATION LOGIC ---
        const ipCountry = request.headers.get('x-vercel-ip-country');
        let pais = 'CO';
        let moneda = 'COP';

        if (ipCountry === 'MX') {
            pais = 'MX';
            moneda = 'MXN';
        } else if (ipCountry === 'ES') {
            pais = 'ES';
            moneda = 'EUR';
        }

        console.log(`DEBUG - Usuario detectado en: ${ipCountry || 'Desconocido/Local'} - Asignando pais: ${pais}, moneda: ${moneda}`);
        // ---------------------------------

        // 3. Guardar Token en Supabase (tabla profiles)
        console.log("DEBUG - Intentando UPSERT de token para clerkUserId:", clerkUserId);
        const { data: updatedRecords, error: dbError } = await supabaseAdmin
            .from('profiles')
            .upsert({ 
                clerk_user_id: clerkUserId, 
                meta_access_token: accessToken,
                email: userEmail,
                nombre: userName,
                pais: pais,
                moneda: moneda
            }, { onConflict: 'clerk_user_id' })
            .select();
            
        if (dbError) {
            console.error("DEBUG - Fallo en UPSERT de token:", { 
                message: dbError.message, 
                details: dbError.details, 
                hint: dbError.hint,
                code: dbError.code
            });
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar?error=db_error`);
        }
            
        if (!updatedRecords || updatedRecords.length === 0) {
            console.error("CRITICAL DB ERROR: El UPSERT falló silenciosamente devolviendo cero filas para clerk_user_id:", clerkUserId);
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar?error=db_upsert_failed`);
        }

        // 6. Redirigir a Selección de Cuentas si se autentico y guardo todo bien.
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar/cuentas`);

    } catch (err: any) {
        console.error('Callback Error:', err);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar?error=callback_exception&details=${encodeURIComponent(err.message || 'unknown')}`);
    }
}
