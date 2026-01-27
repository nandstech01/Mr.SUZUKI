-- CareerBridge Database Schema
-- Initial Migration

-- Extensions
create extension if not exists "pgcrypto";

-- Enums
do $$ begin
  create type user_role as enum ('engineer', 'company', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type engagement_type as enum ('freelance', 'sidejob', 'fulltime');
exception when duplicate_object then null; end $$;

do $$ begin
  create type job_status as enum ('draft','open','paused','closed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type application_status as enum ('applied','screening','interview','offer','accepted','rejected','withdrawn');
exception when duplicate_object then null; end $$;

do $$ begin
  create type contract_status as enum ('initiated','signed','active','completed','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type invoice_status as enum ('pending','paid','void','failed');
exception when duplicate_object then null; end $$;

-- Profiles (linked to Supabase Auth users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null,
  display_name text not null,
  email text,
  avatar_url text,
  locale text default 'ja',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Company profile
create table if not exists company_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  company_name text not null,
  website_url text,
  industry text,
  company_size text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_company_profiles_owner on company_profiles(owner_id);

-- Engineer profile
create table if not exists engineer_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  headline text,
  bio text,
  years_of_experience int,
  location text,
  remote_ok boolean default true,
  availability_hours_per_week int,
  desired_engagement engagement_type,
  desired_min_monthly_yen int, -- ex: 800000
  github_url text,
  linkedin_url text,
  portfolio_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_engineer_profiles_owner on engineer_profiles(owner_id);

-- Skills master
create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  name text not null unique, -- ex: "Python", "PyTorch", "MLOps", "RAG"
  category text,            -- ex: "language", "framework", "ml", "genai"
  created_at timestamptz not null default now()
);

-- Engineer skills (many-to-many)
create table if not exists engineer_skill_links (
  engineer_profile_id uuid not null references engineer_profiles(id) on delete cascade,
  skill_id uuid not null references skills(id) on delete cascade,
  level int not null default 3, -- 1-5
  years int,
  primary key(engineer_profile_id, skill_id)
);

create index if not exists idx_engineer_skill_skill on engineer_skill_links(skill_id);

-- Job postings
create table if not exists job_posts (
  id uuid primary key default gen_random_uuid(),
  company_profile_id uuid not null references company_profiles(id) on delete cascade,
  title text not null,
  description text not null,
  engagement engagement_type not null,
  status job_status not null default 'draft',
  location text,
  remote_ok boolean default true,
  weekly_hours_min int,
  weekly_hours_max int,
  duration_months int,
  budget_min_monthly_yen int,
  budget_max_monthly_yen int,
  must_have text,   -- free text
  nice_to_have text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_job_posts_company on job_posts(company_profile_id);
create index if not exists idx_job_posts_status on job_posts(status);

-- Job required skills
create table if not exists job_skill_links (
  job_post_id uuid not null references job_posts(id) on delete cascade,
  skill_id uuid not null references skills(id) on delete cascade,
  weight int not null default 3, -- 1-5 importance
  primary key(job_post_id, skill_id)
);

create index if not exists idx_job_skill_skill on job_skill_links(skill_id);

-- Applications
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  job_post_id uuid not null references job_posts(id) on delete cascade,
  engineer_profile_id uuid not null references engineer_profiles(id) on delete cascade,
  status application_status not null default 'applied',
  cover_letter text,
  match_score numeric(5,2) default 0, -- 0-100
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(job_post_id, engineer_profile_id)
);

create index if not exists idx_applications_job on applications(job_post_id);
create index if not exists idx_applications_engineer on applications(engineer_profile_id);

-- Conversations
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  job_post_id uuid references job_posts(id) on delete set null,
  company_profile_id uuid not null references company_profiles(id) on delete cascade,
  engineer_profile_id uuid not null references engineer_profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(company_profile_id, engineer_profile_id, job_post_id)
);

-- Messages
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_profile_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_messages_convo on messages(conversation_id);

-- Contracts
create table if not exists contracts (
  id uuid primary key default gen_random_uuid(),
  application_id uuid unique references applications(id) on delete set null,
  company_profile_id uuid not null references company_profiles(id) on delete cascade,
  engineer_profile_id uuid not null references engineer_profiles(id) on delete cascade,
  status contract_status not null default 'initiated',
  start_date date,
  end_date date,
  monthly_fee_yen int,
  platform_fee_rate numeric(5,2) default 15.00, -- configurable, MVP default 15%
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_contracts_company on contracts(company_profile_id);
create index if not exists idx_contracts_engineer on contracts(engineer_profile_id);

-- Stripe customers mapping
create table if not exists stripe_customers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  stripe_customer_id text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists idx_stripe_customers_profile on stripe_customers(profile_id);

-- Invoices / Payments (for contracts)
create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references contracts(id) on delete cascade,
  stripe_invoice_id text unique,
  amount_yen int not null,
  status invoice_status not null default 'pending',
  billing_month date, -- first day of month
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_invoices_contract on invoices(contract_id);

-- Simple scoring weights (admin editable)
create table if not exists match_weights (
  id uuid primary key default gen_random_uuid(),
  key text not null unique, -- e.g., "skill_overlap", "budget_fit", "availability_fit"
  weight numeric(6,3) not null default 1.0,
  updated_at timestamptz not null default now()
);

-- Insert default weights
insert into match_weights(key, weight) values
  ('skill_overlap', 1.5),
  ('budget_fit', 1.0),
  ('availability_fit', 1.0),
  ('remote_fit', 0.5)
on conflict (key) do nothing;

-- updated_at trigger helper
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
do $$ begin
  create trigger trg_profiles_updated_at
  before update on profiles for each row execute function set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger trg_company_profiles_updated_at
  before update on company_profiles for each row execute function set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger trg_engineer_profiles_updated_at
  before update on engineer_profiles for each row execute function set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger trg_job_posts_updated_at
  before update on job_posts for each row execute function set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger trg_applications_updated_at
  before update on applications for each row execute function set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger trg_contracts_updated_at
  before update on contracts for each row execute function set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger trg_invoices_updated_at
  before update on invoices for each row execute function set_updated_at();
exception when duplicate_object then null; end $$;
