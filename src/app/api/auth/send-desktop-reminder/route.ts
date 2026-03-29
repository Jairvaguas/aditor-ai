import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendDesktopReminderEmail } from '@/lib/emails';

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: profile } = await supabase
    .from('profiles')
    .select('email')
    .eq('clerk_user_id', userId)
    .single();

  if (!profile?.email) return NextResponse.json({ ok: false });

  await sendDesktopReminderEmail(profile.email);
  return NextResponse.json({ ok: true });
}
