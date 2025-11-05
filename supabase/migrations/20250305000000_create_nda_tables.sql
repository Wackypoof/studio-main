-- Create NDA related enum types
create type nda_status as enum ('pending', 'signed', 'expired', 'declined');
create type nda_request_status as enum ('pending', 'approved', 'declined', 'signed', 'expired');
create type nda_risk_level as enum ('low', 'medium', 'high');
create type nda_audit_event_type as enum ('requested', 'approved', 'declined', 'signed', 'expired', 'system');

-- Table storing active NDA agreements between buyers and sellers
create table nda_agreements (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  buyer_id uuid not null references profiles(id) on delete cascade,
  seller_id uuid not null references profiles(id) on delete cascade,
  buyer_company text,
  status nda_status not null default 'pending',
  signed_at timestamptz,
  expires_at timestamptz,
  document_url text,
  renewal_requested boolean not null default false,
  security_level text not null default 'standard' check (security_level in ('standard', 'strict')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Requests waiting for admin review or in-progress
create table nda_requests (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  buyer_id uuid not null references profiles(id) on delete cascade,
  seller_id uuid not null references profiles(id) on delete cascade,
  buyer_email text not null,
  buyer_company text,
  status nda_request_status not null default 'pending',
  requested_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now(),
  expires_at timestamptz,
  signed_at timestamptz,
  document_url text,
  risk_level nda_risk_level not null default 'low',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Audit log for NDA request activity
create table nda_audit_events (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references nda_requests(id) on delete cascade,
  agreement_id uuid references nda_agreements(id) on delete cascade,
  event_type nda_audit_event_type not null,
  created_at timestamptz not null default now(),
  created_by text not null,
  note text,
  constraint nda_audit_events_subject_chk check (request_id is not null or agreement_id is not null)
);

create index nda_agreements_buyer_idx on nda_agreements (buyer_id);
create index nda_agreements_seller_idx on nda_agreements (seller_id);
create index nda_requests_status_idx on nda_requests (status);
create index nda_requests_buyer_idx on nda_requests (buyer_id);
create index nda_requests_seller_idx on nda_requests (seller_id);
create index nda_audit_events_agreement_idx on nda_audit_events (agreement_id);

-- Basic timestamp trigger helper
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at_on_nda_agreements
  before update on nda_agreements
  for each row
  execute procedure set_updated_at();

create trigger set_updated_at_on_nda_requests
  before update on nda_requests
  for each row
  execute procedure set_updated_at();

-- Enable RLS and allow secure access patterns
alter table nda_agreements enable row level security;
alter table nda_requests enable row level security;
alter table nda_audit_events enable row level security;

create policy "buyer_read_agreements"
  on nda_agreements
  for select
  using (auth.uid() = buyer_id);

create policy "seller_read_agreements"
  on nda_agreements
  for select
  using (auth.uid() = seller_id);

create policy "buyer_flag_renewal"
  on nda_agreements
  for update
  using (auth.uid() = buyer_id)
  with check (auth.uid() = buyer_id);

create policy "buyer_read_requests"
  on nda_requests
  for select
  using (auth.uid() = buyer_id);

create policy "seller_read_requests"
  on nda_requests
  for select
  using (auth.uid() = seller_id);

create policy "participants_read_audit"
  on nda_audit_events
  for select
  using (
    exists (
      select 1
      from nda_requests r
      where r.id = request_id
        and (auth.uid() = r.buyer_id or auth.uid() = r.seller_id)
    )
    or exists (
      select 1
      from nda_agreements a
      where a.id = agreement_id
        and (auth.uid() = a.buyer_id or auth.uid() = a.seller_id)
    )
  );
