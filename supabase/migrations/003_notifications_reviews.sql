-- AIMatch Pro Database Schema
-- Migration 003: Notifications and Reviews

-- Notification type enum
do $$ begin
  create type notification_type as enum ('application', 'message', 'contract', 'system', 'scout');
exception when duplicate_object then null; end $$;

-- Notifications table
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  type notification_type not null,
  title text not null,
  body text,
  link text,
  is_read boolean default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_profile on notifications(profile_id);
create index if not exists idx_notifications_unread on notifications(profile_id, is_read) where is_read = false;

-- Reviews table
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references contracts(id) on delete cascade,
  reviewer_profile_id uuid not null references profiles(id) on delete cascade,
  reviewee_profile_id uuid not null references profiles(id) on delete cascade,
  rating int not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz not null default now(),
  unique(contract_id, reviewer_profile_id)
);

create index if not exists idx_reviews_contract on reviews(contract_id);
create index if not exists idx_reviews_reviewer on reviews(reviewer_profile_id);
create index if not exists idx_reviews_reviewee on reviews(reviewee_profile_id);

-- Scout table (for tracking scout messages)
create table if not exists scouts (
  id uuid primary key default gen_random_uuid(),
  company_profile_id uuid not null references company_profiles(id) on delete cascade,
  engineer_profile_id uuid not null references engineer_profiles(id) on delete cascade,
  job_post_id uuid references job_posts(id) on delete set null,
  message text not null,
  status text not null default 'sent', -- sent, viewed, replied, declined
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_scouts_company on scouts(company_profile_id);
create index if not exists idx_scouts_engineer on scouts(engineer_profile_id);

-- Trigger for scouts updated_at
do $$ begin
  create trigger trg_scouts_updated_at
  before update on scouts for each row execute function set_updated_at();
exception when duplicate_object then null; end $$;

-- RLS Policies for notifications
alter table notifications enable row level security;

create policy "Users can view their own notifications"
  on notifications for select
  using (auth.uid() = profile_id);

create policy "Users can update their own notifications"
  on notifications for update
  using (auth.uid() = profile_id);

-- RLS Policies for reviews
alter table reviews enable row level security;

create policy "Anyone can view reviews"
  on reviews for select
  using (true);

create policy "Contract participants can create reviews"
  on reviews for insert
  with check (auth.uid() = reviewer_profile_id);

-- RLS Policies for scouts
alter table scouts enable row level security;

create policy "Companies can view their sent scouts"
  on scouts for select
  using (
    exists (
      select 1 from company_profiles
      where id = scouts.company_profile_id
      and owner_id = auth.uid()
    )
  );

create policy "Engineers can view scouts sent to them"
  on scouts for select
  using (
    exists (
      select 1 from engineer_profiles
      where id = scouts.engineer_profile_id
      and owner_id = auth.uid()
    )
  );

create policy "Companies can create scouts"
  on scouts for insert
  with check (
    exists (
      select 1 from company_profiles
      where id = scouts.company_profile_id
      and owner_id = auth.uid()
    )
  );

-- Admin can do anything (bypass RLS)
create policy "Admin full access notifications"
  on notifications for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

create policy "Admin full access reviews"
  on reviews for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

create policy "Admin full access scouts"
  on scouts for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );
