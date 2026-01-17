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
