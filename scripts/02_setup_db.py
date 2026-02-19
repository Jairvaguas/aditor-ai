import os

def write_file(path, content):
    dirname = os.path.dirname(path)
    if dirname:
        os.makedirs(dirname, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"Creado/Actualizado: {path}")

def setup_database_auth():
    # 1. Configurar .env.local
    env_content = """
NEXT_PUBLIC_SUPABASE_URL=https://qwqjmlurhzsttbpitddb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZnVuLWNhbGYtOS5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_hClMc3NwQly2yrtmMP6wdKyQRPuqRQjxu6qzmDAXj9
ANTHROPIC_API_KEY=
META_APP_ID=
META_APP_SECRET=
NEXT_PUBLIC_APP_URL=http://localhost:3000
"""
    write_file(".env.local", env_content)

    # 2. Generar Schema SQL
    schema_sql = """
-- Tabla: profiles
create table if not exists profiles (
  id uuid default gen_random_uuid() primary key,
  clerk_user_id text unique not null,
  email text not null,
  nombre text,
  pais text default 'AR',
  moneda text default 'USD',
  plan text default 'trial',
  trial_start timestamp with time zone default now(),
  trial_end timestamp with time zone default (now() + interval '7 days'),
  stripe_customer_id text,
  created_at timestamp with time zone default now()
);

-- Tabla: connected_accounts
create table if not exists connected_accounts (
  id uuid default gen_random_uuid() primary key,
  user_id text not null references profiles(clerk_user_id) on delete cascade,
  ad_account_id text unique not null,
  facebook_user_id text not null,
  access_token text not null,
  account_name text,
  currency text default 'USD',
  created_at timestamp with time zone default now()
);

-- Tabla: auditorias
create table if not exists auditorias (
  id uuid default gen_random_uuid() primary key,
  user_id text not null references profiles(clerk_user_id) on delete cascade,
  ad_account_id text not null,
  tipo text not null check (tipo in ('manual', 'automatica', 'teaser')),
  score integer,
  hallazgos_count integer,
  xml_raw text,
  parsed_data jsonb,
  periodo_inicio date,
  periodo_fin date,
  created_at timestamp with time zone default now()
);

-- Tabla: audit_logs
create table if not exists audit_logs (
  id uuid default gen_random_uuid() primary key,
  user_id text,
  ad_account_id text,
  evento text not null,
  detalle jsonb,
  created_at timestamp with time zone default now()
);
"""
    write_file("supabase/schema.sql", schema_sql)

    # 3. Generar Middleware de Clerk
    middleware_ts = """
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Definir rutas públicas
const isPublicRoute = createRouteMatcher([
  '/',
  '/conectar',
  '/teaser',
  '/registro',
  '/api/meta/callback'
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
"""
    write_file("src/middleware.ts", middleware_ts)

    print("\n--- INSTRUCCIONES MANUALES ---")
    print("1. Abre .env.local y completa las claves faltantes (ANON_KEY, SERVICE_ROLE_KEY).")
    print("2. Ve a tu Dashboard de Supabase -> SQL Editor.")
    print("3. Copia el contenido de supabase/schema.sql y ejecútalo.")

if __name__ == "__main__":
    setup_database_auth()
