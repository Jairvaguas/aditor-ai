import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Definir rutas públicas
const isPublicRoute = createRouteMatcher([
  '/',
  '/conectar(.*)',
  '/teaser(.*)',
  '/registro(.*)',
  '/subscribe(.*)',
  '/privacidad(.*)',
  '/terminos(.*)',
  '/eliminar-datos(.*)',
  '/api/meta/callback(.*)',
  '/api/payments/create-subscription(.*)',
  '/api/payments/webhook(.*)',
  '/api/payments/test-webhook(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};