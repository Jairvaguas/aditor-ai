import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const state = crypto.randomUUID();

    if (!process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || !process.env.NEXT_PUBLIC_APP_URL) {
        return NextResponse.json({ error: 'Missing environment variables' }, { status: 500 });
    }

    const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
        scope: 'ads_read,business_management',
        state: state,
        response_type: 'code',
    });

    const url = `https://www.facebook.com/v19.0/dialog/oauth?${params}`;

    const response = NextResponse.redirect(url);

    // Seguridad: State cookie para prevenir CSRF
    response.cookies.set('oauth_state', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 10 // 10 min
    });

    return response;
}
