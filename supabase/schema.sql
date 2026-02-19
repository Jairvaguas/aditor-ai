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