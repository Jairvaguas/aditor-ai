import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        if (
            username === process.env.ADMIN_USER &&
            password === process.env.ADMIN_PASSWORD
        ) {
            const response = NextResponse.json({ success: true });
            response.cookies.set({
                name: 'admin_session',
                value: 'true',
                httpOnly: true,
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 1 semana
            });
            return response;
        }

        return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    } catch (e) {
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}