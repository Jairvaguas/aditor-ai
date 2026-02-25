import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  '/',
  '/conectar(.*)',
  '/teaser(.*)',
  '/login(.*)',
  '/registro(.*)',
  '/subscribe(.*)',
  '/privacidad(.*)',
  '/terminos(.*)',
  '/eliminar-datos(.*)',
  '/conectar/cuentas(.*)',
  '/api/meta/callback(.*)',
  '/api/payments/create-subscription(.*)',
  '/api/payments/webhook(.*)',
  '/api/payments/test-webhook(.*)',
  '/api/admin(.*)',
  '/admin/login(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  if (req.nextUrl.pathname.startsWith('/admin') && !req.nextUrl.pathname.startsWith('/admin/login')) {
      const adminSession = req.cookies.get('admin_session')?.value;
      if (adminSession !== 'true') {
          return NextResponse.redirect(new URL('/admin/login', req.url));
      }
      return NextResponse.next();
  }
  
  if (!req.nextUrl.pathname.startsWith('/admin') && !isPublicRoute(req)) {
      await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};