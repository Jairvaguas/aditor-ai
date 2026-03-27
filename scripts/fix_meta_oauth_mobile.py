import os
from pathlib import Path

def patch_init_route():
    os.makedirs(r"src\app\api\auth\meta-connect-init", exist_ok=True)
    file_path = r"src\app\api\auth\meta-connect-init\route.ts"
    
    content = r'''import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = getSupabaseAdmin();

  const stateToken = crypto.randomUUID();

  const { error } = await supabase.from('meta_oauth_states').insert({
    state_token: stateToken,
    clerk_user_id: userId,
  });

  if (error) {
    console.error("DB Insert error meta_oauth_states:", error);
    return NextResponse.json({ error: 'Error guardando estado' }, { status: 500 });
  }

  // Check the redirect URI matching facebook auth rules
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/meta/callback`;

  const params = new URLSearchParams({
    client_id: process.env.META_APP_ID || process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
    redirect_uri: redirectUri,
    state: stateToken,
    scope: 'ads_read,ads_management,business_management,pages_read_engagement',
    response_type: 'code',
  });

  const redirectUrl = `https://www.facebook.com/v19.0/dialog/oauth?${params}`;
  return NextResponse.json({ redirectUrl });
}
'''
    Path(file_path).write_text(content, encoding="utf-8")
    print(f"File {file_path} created successfully.")


def patch_callback():
    file_path = Path(r"src\app\api\meta\callback\route.ts")
    content = file_path.read_text(encoding="utf-8")
    
    old_target = r'''        // Obtenemos user de Clerk actual
        const clerkUserId = state; // We receive Clerk userId from Meta 'state' param

        if (!clerkUserId) {'''
        
    new_target = r'''        // Buscar el state en Supabase para recuperar el clerkUserId real
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

        if (!clerkUserId) {'''
        
    if old_target in content:
        content = content.replace(old_target, new_target)
        file_path.write_text(content, encoding="utf-8")
        print("Callback route updated successfully.")
    else:
        print("Could not find Target block in Callback route.")


def patch_frontend():
    file_path = Path(r"src\app\conectar\page.tsx")
    content = file_path.read_text(encoding="utf-8")
    
    # 1. Imports
    if 'import { useEffect, useState } from "react";' not in content:
        content = content.replace('import { useEffect } from "react";', 'import { useEffect, useState } from "react";')
        
    # 2. Main Logic
    old_logic = "export default function ConnectPage() {\n  const { userId, isLoaded } = useAuth();"
    new_logic = r'''export default function ConnectPage() {
  const { userId, isLoaded } = useAuth();
  const [loading, setLoading] = useState(false);

  const isInAppBrowser = () => {
    if (typeof window === 'undefined') return false;
    const ua = navigator.userAgent || navigator.vendor;
    return /FBAN|FBAV|Instagram|FB_IAB|FB4A|FBIOS|Twitter|Line\/|musical_ly/i.test(ua);
  };

  const handleConnectMeta = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/meta-connect-init', { method: 'POST' });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      window.location.href = data.redirectUrl;
    } catch (err) {
      console.error('Error iniciando conexión Meta:', err);
      setLoading(false);
    }
  };'''
    if "handleConnectMeta" not in content:
        content = content.replace(old_logic, new_logic)

    # 3. Button and Banner
    old_button_block = r'''          {/* Facebook Button */}
          <button
            onClick={() => {
              window.location.href = '/api/auth/facebook';
            }}
            className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-[16px] py-[14px] rounded-[14px] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ boxShadow: '0 6px 20px rgba(24,119,242,0.35)' }}
          >
            {/* Facebook "f" icon */}
            <span className="font-bold text-[20px] leading-none mb-0.5">f</span>
            {t("connectBtn")}
          </button>'''

    new_button_block = r'''          {isInAppBrowser() && (
            <div className="bg-yellow-100/10 border border-yellow-500/50 text-yellow-200 text-sm px-4 py-3 rounded-xl mb-6 text-left shadow-lg">
              ⚠️ <strong>Navegador In-App Detectado:</strong><br/>
              Para conectar tu cuenta de Meta sin errores, necesitamos que uses Safari o Chrome directamente.<br/><br/>
              ↳ Toca los 3 puntos (···) y selecciona <strong>"Abrir en navegador externo"</strong>.
            </div>
          )}

          {/* Facebook Button */}
          <button
            onClick={handleConnectMeta}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white font-bold text-[16px] py-[14px] rounded-[14px] transition-all transform ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#166fe5] hover:scale-[1.02] active:scale-[0.98]'}`}
            style={{ boxShadow: '0 6px 20px rgba(24,119,242,0.35)' }}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                 <span className="font-bold text-[20px] leading-none mb-0.5">f</span>
                 {t("connectBtn")}
              </>
            )}
          </button>'''

    if old_button_block in content:
        content = content.replace(old_button_block, new_button_block)
        print("Frontend route updated successfully.")
    else:
        print("Could not find Button block in Frontend route.")
        
    file_path.write_text(content, encoding="utf-8")

if __name__ == "__main__":
    patch_init_route()
    patch_callback()
    patch_frontend()
