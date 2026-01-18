-- AIMatch Pro Database Schema
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
-- AIMatch Pro RLS Policies
-- Row Level Security for all tables

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table company_profiles enable row level security;
alter table engineer_profiles enable row level security;
alter table skills enable row level security;
alter table engineer_skill_links enable row level security;
alter table job_posts enable row level security;
alter table job_skill_links enable row level security;
alter table applications enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table contracts enable row level security;
alter table stripe_customers enable row level security;
alter table invoices enable row level security;
alter table match_weights enable row level security;

-- Profiles policies
create policy "Users can view all profiles"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Company profiles policies
create policy "Anyone can view company profiles"
  on company_profiles for select
  using (true);

create policy "Company owners can update own profile"
  on company_profiles for update
  using (owner_id = auth.uid());

create policy "Company owners can insert own profile"
  on company_profiles for insert
  with check (owner_id = auth.uid());

create policy "Company owners can delete own profile"
  on company_profiles for delete
  using (owner_id = auth.uid());

-- Engineer profiles policies
create policy "Anyone can view engineer profiles"
  on engineer_profiles for select
  using (true);

create policy "Engineers can update own profile"
  on engineer_profiles for update
  using (owner_id = auth.uid());

create policy "Engineers can insert own profile"
  on engineer_profiles for insert
  with check (owner_id = auth.uid());

create policy "Engineers can delete own profile"
  on engineer_profiles for delete
  using (owner_id = auth.uid());

-- Skills policies (read-only for non-admins)
create policy "Anyone can view skills"
  on skills for select
  using (true);

create policy "Admins can manage skills"
  on skills for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Engineer skill links policies
create policy "Anyone can view engineer skills"
  on engineer_skill_links for select
  using (true);

create policy "Engineers can manage own skills"
  on engineer_skill_links for all
  using (
    exists (
      select 1 from engineer_profiles
      where id = engineer_profile_id and owner_id = auth.uid()
    )
  );

-- Job posts policies
create policy "Anyone can view open jobs"
  on job_posts for select
  using (status = 'open' or exists (
    select 1 from company_profiles
    where id = company_profile_id and owner_id = auth.uid()
  ));

create policy "Companies can manage own jobs"
  on job_posts for all
  using (
    exists (
      select 1 from company_profiles
      where id = company_profile_id and owner_id = auth.uid()
    )
  );

-- Job skill links policies
create policy "Anyone can view job skills"
  on job_skill_links for select
  using (true);

create policy "Companies can manage own job skills"
  on job_skill_links for all
  using (
    exists (
      select 1 from job_posts jp
      join company_profiles cp on jp.company_profile_id = cp.id
      where jp.id = job_post_id and cp.owner_id = auth.uid()
    )
  );

-- Applications policies
create policy "Engineers can view own applications"
  on applications for select
  using (
    exists (
      select 1 from engineer_profiles
      where id = engineer_profile_id and owner_id = auth.uid()
    )
  );

create policy "Companies can view applications to their jobs"
  on applications for select
  using (
    exists (
      select 1 from job_posts jp
      join company_profiles cp on jp.company_profile_id = cp.id
      where jp.id = job_post_id and cp.owner_id = auth.uid()
    )
  );

create policy "Engineers can create applications"
  on applications for insert
  with check (
    exists (
      select 1 from engineer_profiles
      where id = engineer_profile_id and owner_id = auth.uid()
    )
  );

create policy "Engineers can update own applications"
  on applications for update
  using (
    exists (
      select 1 from engineer_profiles
      where id = engineer_profile_id and owner_id = auth.uid()
    )
  );

create policy "Companies can update applications to their jobs"
  on applications for update
  using (
    exists (
      select 1 from job_posts jp
      join company_profiles cp on jp.company_profile_id = cp.id
      where jp.id = job_post_id and cp.owner_id = auth.uid()
    )
  );

-- Conversations policies
create policy "Participants can view conversations"
  on conversations for select
  using (
    exists (
      select 1 from company_profiles where id = company_profile_id and owner_id = auth.uid()
    ) or exists (
      select 1 from engineer_profiles where id = engineer_profile_id and owner_id = auth.uid()
    )
  );

create policy "Participants can create conversations"
  on conversations for insert
  with check (
    exists (
      select 1 from company_profiles where id = company_profile_id and owner_id = auth.uid()
    ) or exists (
      select 1 from engineer_profiles where id = engineer_profile_id and owner_id = auth.uid()
    )
  );

-- Messages policies
create policy "Participants can view messages"
  on messages for select
  using (
    exists (
      select 1 from conversations c
      where c.id = conversation_id and (
        exists (select 1 from company_profiles where id = c.company_profile_id and owner_id = auth.uid())
        or exists (select 1 from engineer_profiles where id = c.engineer_profile_id and owner_id = auth.uid())
      )
    )
  );

create policy "Participants can send messages"
  on messages for insert
  with check (
    sender_profile_id = auth.uid() and
    exists (
      select 1 from conversations c
      where c.id = conversation_id and (
        exists (select 1 from company_profiles where id = c.company_profile_id and owner_id = auth.uid())
        or exists (select 1 from engineer_profiles where id = c.engineer_profile_id and owner_id = auth.uid())
      )
    )
  );

-- Contracts policies
create policy "Participants can view contracts"
  on contracts for select
  using (
    exists (
      select 1 from company_profiles where id = company_profile_id and owner_id = auth.uid()
    ) or exists (
      select 1 from engineer_profiles where id = engineer_profile_id and owner_id = auth.uid()
    )
  );

create policy "Companies can create contracts"
  on contracts for insert
  with check (
    exists (
      select 1 from company_profiles where id = company_profile_id and owner_id = auth.uid()
    )
  );

create policy "Companies can update contracts"
  on contracts for update
  using (
    exists (
      select 1 from company_profiles where id = company_profile_id and owner_id = auth.uid()
    )
  );

-- Stripe customers policies
create policy "Users can view own stripe customer"
  on stripe_customers for select
  using (profile_id = auth.uid());

create policy "Users can insert own stripe customer"
  on stripe_customers for insert
  with check (profile_id = auth.uid());

-- Invoices policies
create policy "Participants can view invoices"
  on invoices for select
  using (
    exists (
      select 1 from contracts c
      where c.id = contract_id and (
        exists (select 1 from company_profiles where id = c.company_profile_id and owner_id = auth.uid())
        or exists (select 1 from engineer_profiles where id = c.engineer_profile_id and owner_id = auth.uid())
      )
    )
  );

-- Match weights policies (admin only write)
create policy "Anyone can view match weights"
  on match_weights for select
  using (true);

create policy "Admins can manage match weights"
  on match_weights for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );
-- AIMatch Pro Seed Data: Skills
-- Initial skills for AI/ML engineers

-- Programming Languages
INSERT INTO skills (name, category) VALUES
  ('Python', 'language'),
  ('JavaScript', 'language'),
  ('TypeScript', 'language'),
  ('Go', 'language'),
  ('Rust', 'language'),
  ('Java', 'language'),
  ('C++', 'language'),
  ('R', 'language'),
  ('Julia', 'language'),
  ('Scala', 'language')
ON CONFLICT (name) DO NOTHING;

-- ML/AI Frameworks
INSERT INTO skills (name, category) VALUES
  ('PyTorch', 'framework'),
  ('TensorFlow', 'framework'),
  ('Keras', 'framework'),
  ('scikit-learn', 'framework'),
  ('JAX', 'framework'),
  ('Hugging Face Transformers', 'framework'),
  ('LangChain', 'framework'),
  ('LlamaIndex', 'framework'),
  ('OpenCV', 'framework'),
  ('FastAPI', 'framework'),
  ('Django', 'framework'),
  ('Flask', 'framework'),
  ('Next.js', 'framework'),
  ('React', 'framework'),
  ('Vue.js', 'framework')
ON CONFLICT (name) DO NOTHING;

-- ML/AI Skills
INSERT INTO skills (name, category) VALUES
  ('機械学習', 'ml'),
  ('深層学習', 'ml'),
  ('自然言語処理', 'ml'),
  ('コンピュータビジョン', 'ml'),
  ('強化学習', 'ml'),
  ('推薦システム', 'ml'),
  ('時系列予測', 'ml'),
  ('異常検知', 'ml'),
  ('音声認識', 'ml'),
  ('画像生成', 'ml')
ON CONFLICT (name) DO NOTHING;

-- GenAI Skills
INSERT INTO skills (name, category) VALUES
  ('LLM', 'genai'),
  ('GPT', 'genai'),
  ('Claude', 'genai'),
  ('Gemini', 'genai'),
  ('RAG', 'genai'),
  ('プロンプトエンジニアリング', 'genai'),
  ('Fine-tuning', 'genai'),
  ('Embeddings', 'genai'),
  ('Vector Database', 'genai'),
  ('AI Agent', 'genai'),
  ('Stable Diffusion', 'genai'),
  ('Midjourney', 'genai'),
  ('DALL-E', 'genai')
ON CONFLICT (name) DO NOTHING;

-- Infrastructure/MLOps
INSERT INTO skills (name, category) VALUES
  ('AWS', 'infra'),
  ('GCP', 'infra'),
  ('Azure', 'infra'),
  ('Docker', 'infra'),
  ('Kubernetes', 'infra'),
  ('MLflow', 'infra'),
  ('Kubeflow', 'infra'),
  ('Airflow', 'infra'),
  ('Terraform', 'infra'),
  ('CI/CD', 'infra'),
  ('MLOps', 'infra'),
  ('データパイプライン', 'infra')
ON CONFLICT (name) DO NOTHING;

-- Data Skills
INSERT INTO skills (name, category) VALUES
  ('SQL', 'data'),
  ('PostgreSQL', 'data'),
  ('MongoDB', 'data'),
  ('BigQuery', 'data'),
  ('Snowflake', 'data'),
  ('Spark', 'data'),
  ('Pandas', 'data'),
  ('NumPy', 'data'),
  ('データ分析', 'data'),
  ('データ可視化', 'data'),
  ('ETL', 'data'),
  ('dbt', 'data')
ON CONFLICT (name) DO NOTHING;
