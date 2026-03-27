
import { NextResponse } from 'next/server';
import { exchangeCodeForToken, getAdAccounts, getCampaignInsights, getMetaUser } from '@/lib/meta-auth';
import { generateAudit } from '@/lib/audit';
import { getSupabaseAdmin } from '@/lib/supabase';
import { clerkClient } from '@clerk/nextjs/server';
import { sendMetaEvent } from '@/lib/meta-pixel';

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
        // Buscar el state en Supabase para recuperar el clerkUserId real
        const { data: oauthState, error: stateError } = await getSupabaseAdmin()
          .from('meta_oauth_states')
          .select('clerk_user_id, used, expires_at')
          .eq('state_token', state)
          .single();

        if (stateError || !oauthState) {
          console.error("State invalido o DB error:", stateError);
          return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar?error=invalid_state`);
        }

        if (oauthState.used) {
          return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar?error=state_already_used`);
        }

        if (new Date(oauthState.expires_at) < new Date()) {
          return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar?error=state_expired`);
        }

        // Marcar como usado para evitar replay attacks
        await getSupabaseAdmin()
          .from('meta_oauth_states')
          .update({ used: true })
          .eq('state_token', state);

        const clerkUserId = oauthState.clerk_user_id;

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
                const { data: existingProfile } = await getSupabaseAdmin()
                    .from('profiles')
                    .select('id, clerk_user_id')
                    .eq('email', userEmail)
                    .neq('clerk_user_id', clerkUserId)
                    .single();
                    
                if (existingProfile) {
                    console.log(`DEBUG - Resolviendo duplicado: Actualizando clerk_user_id de ${existingProfile.clerk_user_id} a ${clerkUserId} para el email ${userEmail}`);
                    await getSupabaseAdmin()
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
        const { data: updatedRecords, error: dbError } = await getSupabaseAdmin()
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

                // Enviar evento CompleteRegistration a Meta
        await sendMetaEvent({
            eventName: 'CompleteRegistration',
            eventSourceUrl: 'https://www.aditor-ai.com/conectar',
            userData: {
                externalId: clerkUserId,
            },
            customData: {
                contentName: 'Meta Ads Connection',
            },
        });

// 6. Redirigir a Selección de Cuentas si se autentico y guardo todo bien.
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar/cuentas`);

    } catch (err: any) {
        console.error('Callback Error:', err);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar?error=callback_exception&details=${encodeURIComponent(err.message || 'unknown')}`);
    }
}
