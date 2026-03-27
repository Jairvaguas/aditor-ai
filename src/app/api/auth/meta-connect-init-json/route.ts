import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const userId = req.headers.get('x-clerk-user-id');
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const stateToken = crypto.randomUUID();

  const { error } = await supabase.from('meta_oauth_states').insert({
    state_token: stateToken,
    clerk_user_id: userId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/meta/callback`,
    state: stateToken,
    scope: 'ads_read,ads_management,business_management,pages_read_engagement',
    response_type: 'code',
  });

  const redirectUrl = `https://www.facebook.com/v19.0/dialog/oauth?${params}`;
  return NextResponse.json({ redirectUrl });
}
