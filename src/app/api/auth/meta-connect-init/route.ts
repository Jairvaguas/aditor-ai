import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(req: Request) {
  const { userId } = await auth();
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
    client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
    redirect_uri: redirectUri,
    state: stateToken,
    scope: 'ads_read,ads_management,business_management,pages_read_engagement',
    response_type: 'code',
  });

  const redirectUrl = `https://www.facebook.com/v19.0/dialog/oauth?${params}`;
  return NextResponse.json({ redirectUrl });
}
