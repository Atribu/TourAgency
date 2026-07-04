-- book to tour PostgreSQL starter schema
-- This schema mirrors the current demo-store entities and keeps JSONB fields
-- for multilingual content so TR/EN/DE/RU data can move without reshaping.

create extension if not exists "pgcrypto";

create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  site_name text not null,
  logo_mark text not null,
  phone text not null,
  whatsapp text not null,
  email text not null,
  jolly_url text not null,
  tursab_certificate text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  role text not null,
  active boolean not null default true,
  password_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists tours (
  id uuid primary key default gen_random_uuid(),
  slugs jsonb not null,
  title jsonb not null,
  summary jsonb not null,
  description jsonb not null default '{}'::jsonb,
  image text not null default '',
  category_ids text[] not null default '{}',
  campaign_ids text[] not null default '{}',
  destination_ids text[] not null default '{}',
  price_from numeric(12,2) not null default 0,
  currency text not null default 'TRY',
  duration_days integer not null default 1,
  duration_nights integer not null default 0,
  departures jsonb not null default '{}'::jsonb,
  transport jsonb not null default '{}'::jsonb,
  visa jsonb not null default '{}'::jsonb,
  route jsonb not null default '{}'::jsonb,
  tags jsonb not null default '{}'::jsonb,
  featured boolean not null default false,
  active boolean not null default true,
  jolly_url text not null default '',
  itinerary jsonb not null default '{}'::jsonb,
  included jsonb not null default '{}'::jsonb,
  excluded jsonb not null default '{}'::jsonb,
  notes jsonb not null default '{}'::jsonb,
  faqs jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists tour_dates (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references tours(id) on delete cascade,
  starts_on date not null,
  ends_on date not null,
  price numeric(12,2) not null,
  currency text not null default 'TRY',
  availability jsonb not null default '{}'::jsonb,
  jolly_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null default '',
  travelers text not null default '',
  preferred_date text not null default '',
  note text not null default '',
  locale text not null default 'tr',
  tour_title text,
  source_path text not null default '',
  kvkk boolean not null default false,
  marketing boolean not null default false,
  jolly_notice boolean not null default false,
  status text not null default 'Yeni',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists managed_pages (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  slugs jsonb not null,
  title jsonb not null,
  summary jsonb not null,
  seo_title jsonb not null default '{"tr":"","en":"","de":"","ru":""}'::jsonb,
  seo_description jsonb not null default '{"tr":"","en":"","de":"","ru":""}'::jsonb,
  canonical jsonb not null default '{"tr":"","en":"","de":"","ru":""}'::jsonb,
  og_image text not null default '',
  keywords text[] not null default '{}',
  no_index boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null default '',
  email text not null default '',
  subject text not null,
  message text not null default '',
  locale text not null default 'tr',
  status text not null default 'Yeni',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists tracking_events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_tours_active on tours(active);
create index if not exists idx_tours_featured on tours(featured);
create index if not exists idx_leads_status on leads(status);
create index if not exists idx_leads_created_at on leads(created_at desc);
create index if not exists idx_tracking_events_name on tracking_events(name);
