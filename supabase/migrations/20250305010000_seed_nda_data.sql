-- Ensure sample auth users exist so profile foreign keys resolve
insert into auth.users (
  id,
  instance_id,
  email,
  raw_user_meta_data,
  email_confirmed_at,
  created_at,
  updated_at
)
values
  (
    '11111111-aaaa-aaaa-aaaa-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'olivia.chen@example.com',
    jsonb_build_object('full_name', 'Olivia Chen'),
    now(),
    now(),
    now()
  ),
  (
    '22222222-bbbb-bbbb-bbbb-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'seller.acme@example.com',
    jsonb_build_object('full_name', 'Acme Inc. Seller'),
    now(),
    now(),
    now()
  ),
  (
    '33333333-cccc-cccc-cccc-333333333333',
    '00000000-0000-0000-0000-000000000000',
    'marcus.lee@example.com',
    jsonb_build_object('full_name', 'Marcus Lee'),
    now(),
    now(),
    now()
  ),
  (
    '44444444-dddd-dddd-dddd-444444444444',
    '00000000-0000-0000-0000-000000000000',
    'seller.nova@example.com',
    jsonb_build_object('full_name', 'Nova Systems Seller'),
    now(),
    now(),
    now()
  )
on conflict (id) do update set
  email = excluded.email,
  raw_user_meta_data = excluded.raw_user_meta_data,
  email_confirmed_at = excluded.email_confirmed_at,
  updated_at = excluded.updated_at;

-- Seed sample profiles for NDA scenarios
insert into profiles (id, full_name, created_at, updated_at)
values
  ('11111111-aaaa-aaaa-aaaa-111111111111', 'Olivia Chen', now(), now()),
  ('22222222-bbbb-bbbb-bbbb-222222222222', 'Acme Inc. Seller', now(), now()),
  ('33333333-cccc-cccc-cccc-333333333333', 'Marcus Lee', now(), now()),
  ('44444444-dddd-dddd-dddd-444444444444', 'Nova Systems Seller', now(), now())
on conflict (id) do update set
  full_name = excluded.full_name,
  updated_at = excluded.updated_at;

-- Seed sample listings owned by sellers above
insert into listings (
  id,
  owner_id,
  name,
  industry,
  status,
  created_at,
  updated_at,
  city,
  country,
  description,
  meta
) values
  (
    'aaaa1111-2222-3333-4444-555555555555',
    '22222222-bbbb-bbbb-bbbb-222222222222',
    'Premium Skincare Dropshipping Store',
    'E-commerce',
    'active',
    now(),
    now(),
    'Singapore',
    'SG',
    'Well-performing skincare dropshipping business with verified supplier relationships.',
    jsonb_build_object('teaser', 'Clean skincare brand with strong retention')
  ),
  (
    'bbbb1111-2222-3333-4444-666666666666',
    '44444444-dddd-dddd-dddd-444444444444',
    'AI-Powered Marketing SaaS',
    'Software',
    'active',
    now(),
    now(),
    'Kuala Lumpur',
    'MY',
    'Growth-stage SaaS focused on AI-assisted marketing automation.',
    jsonb_build_object('teaser', 'Sticky enterprise contracts and 120% NRR')
  )
on conflict (id) do update set
  name = excluded.name,
  industry = excluded.industry,
  status = excluded.status,
  updated_at = excluded.updated_at,
  description = excluded.description,
  meta = excluded.meta;

-- Seed NDA requests covering different lifecycle states
insert into nda_requests (
  id,
  listing_id,
  buyer_id,
  seller_id,
  buyer_email,
  buyer_company,
  status,
  requested_at,
  last_activity_at,
  expires_at,
  signed_at,
  document_url,
  risk_level,
  notes
) values
  (
    '33333333-3333-3333-3333-333333333333',
    'aaaa1111-2222-3333-4444-555555555555',
    '11111111-aaaa-aaaa-aaaa-111111111111',
    '22222222-bbbb-bbbb-bbbb-222222222222',
    'olivia.chen@example.com',
    'NorthBridge Capital',
    'pending',
    now() - interval '2 day',
    now() - interval '2 day',
    null,
    null,
    null,
    'medium',
    'Investment committee review scheduled for next week.'
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'bbbb1111-2222-3333-4444-666666666666',
    '33333333-cccc-cccc-cccc-333333333333',
    '44444444-dddd-dddd-dddd-444444444444',
    'marcus.lee@example.com',
    'Velocity Labs',
    'signed',
    now() - interval '14 day',
    now() - interval '5 day',
    now() + interval '180 day',
    now() - interval '5 day',
    'https://storage.example.com/nda/velocity-labs.pdf',
    'low',
    'Fully verified buyer with repeat transactions.'
  )
on conflict (id) do update set
  status = excluded.status,
  last_activity_at = excluded.last_activity_at,
  expires_at = excluded.expires_at,
  signed_at = excluded.signed_at,
  document_url = excluded.document_url,
  risk_level = excluded.risk_level,
  notes = excluded.notes;

-- Seed NDA agreements derived from the requests
insert into nda_agreements (
  id,
  listing_id,
  buyer_id,
  seller_id,
  buyer_company,
  status,
  signed_at,
  expires_at,
  document_url,
  renewal_requested,
  security_level,
  created_at,
  updated_at
) values
  (
    '11111111-1111-1111-1111-111111111111',
    'aaaa1111-2222-3333-4444-555555555555',
    '11111111-aaaa-aaaa-aaaa-111111111111',
    '22222222-bbbb-bbbb-bbbb-222222222222',
    'NorthBridge Capital',
    'signed',
    now() - interval '6 month',
    now() + interval '6 month',
    'https://storage.example.com/nda/northbridge.pdf',
    false,
    'standard',
    now() - interval '6 month',
    now() - interval '1 day'
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    'bbbb1111-2222-3333-4444-666666666666',
    '33333333-cccc-cccc-cccc-333333333333',
    '44444444-dddd-dddd-dddd-444444444444',
    'Velocity Labs',
    'signed',
    now() - interval '5 day',
    now() + interval '180 day',
    'https://storage.example.com/nda/velocity-labs.pdf',
    false,
    'strict',
    now() - interval '5 day',
    now() - interval '1 day'
  )
on conflict (id) do update set
  status = excluded.status,
  signed_at = excluded.signed_at,
  expires_at = excluded.expires_at,
  document_url = excluded.document_url,
  renewal_requested = excluded.renewal_requested,
  security_level = excluded.security_level,
  updated_at = excluded.updated_at;

-- Seed audit trail entries covering both requests and agreements
insert into nda_audit_events (
  id,
  request_id,
  agreement_id,
  event_type,
  created_at,
  created_by,
  note
) values
  (
    'aaaaeeee-1111-1111-1111-aaaaaaaaaaaa',
    '33333333-3333-3333-3333-333333333333',
    null,
    'requested',
    now() - interval '2 day',
    'olivia.chen@example.com',
    'Buyer submitted NDA request through marketplace.'
  ),
  (
    'bbbbbbbb-2222-2222-2222-bbbbbbbbbbbb',
    '55555555-5555-5555-5555-555555555555',
    null,
    'requested',
    now() - interval '14 day',
    'marcus.lee@example.com',
    'Buyer requested expedited approval.'
  ),
  (
    'cccccccc-3333-3333-3333-cccccccccccc',
    '55555555-5555-5555-5555-555555555555',
    null,
    'approved',
    now() - interval '10 day',
    'admin@example.com',
    'Verification completed. NDA approved.'
  ),
  (
    'dddddddd-4444-4444-4444-dddddddddddd',
    '55555555-5555-5555-5555-555555555555',
    null,
    'signed',
    now() - interval '5 day',
    'marcus.lee@example.com',
    'Buyer signed the NDA via e-signature provider.'
  ),
  (
    'eeeeeeee-5555-5555-5555-eeeeeeeeeeee',
    null,
    '11111111-1111-1111-1111-111111111111',
    'system',
    now() - interval '1 day',
    'buyer@example.com',
    'Buyer requested renewal via dashboard.'
  )
on conflict (id) do update set
  event_type = excluded.event_type,
  created_at = excluded.created_at,
  created_by = excluded.created_by,
  note = excluded.note;
