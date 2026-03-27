'use server';

import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

export async function connectMetaAction(formData: FormData) {
  const userId = formData.get('userId') as string;
  
  if (!userId) {
    redirect('/login?redirect=/conectar');
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const stateToken = crypto.randomUUID();

  await supabase.from('meta_oauth_states').insert({
    state_token: stateToken,
    clerk_user_id: userId,
  });

  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/meta/callback`,
    state: stateToken,
    scope: 'ads_read,ads_management,business_management,pages_read_engagement',
    response_type: 'code',
  });

  redirect(`https://www.facebook.com/v19.0/dialog/oauth?${params}`);
}
