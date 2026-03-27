import { auth } from '@clerk/nextjs/server';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Buscar email del usuario en Supabase tabla profiles
  const { createClient } = await import('@supabase/supabase-js');
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

  const resend = new Resend(process.env.RESEND_API_KEY);
  
  await resend.emails.send({
    from: 'Aditor AI <noreply@aditor-ai.com>',
    to: profile.email,
    subject: '⚡ Completá tu configuración en Aditor AI',
    html: `
      <h2>Ya casi estás listo 🎉</h2>
      <p>Para empezar a usar Aditor AI necesitás conectar tu cuenta de Meta Ads.</p>
      <p>Este paso requiere hacerlo desde tu computadora:</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/conectar" 
         style="background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin:16px 0;">
        Conectar Meta Ads →
      </a>
      <p style="color:#666;font-size:12px;">O copiá este link en tu navegador de escritorio: ${process.env.NEXT_PUBLIC_APP_URL}/conectar</p>
    `
  });

  return NextResponse.json({ ok: true });
}
