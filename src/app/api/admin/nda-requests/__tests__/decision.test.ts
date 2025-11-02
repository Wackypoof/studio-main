/**
 * @jest-environment node
 */

import { POST as decideNda } from '@/app/api/admin/nda-requests/[id]/decision/route';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-client';

jest.mock('@/lib/supabase/server');
jest.mock('@/lib/supabase/service-client');

const mockServerClient = {
  auth: {
    getUser: jest.fn(),
  },
};

const makeInitialBuilder = (row: any) => {
  const single = jest.fn().mockResolvedValue({ data: row, error: null });
  const eq = jest.fn().mockReturnValue({ single });
  const select = jest.fn().mockReturnValue({ eq });
  return { select };
};

const makeUpdateBuilder = (row: any) => {
  const single = jest.fn().mockResolvedValue({ data: row, error: null });
  const select = jest.fn().mockReturnValue({ single });
  const eq = jest.fn().mockReturnValue({ select });
  const update = jest.fn().mockReturnValue({ eq });
  return { update };
};

const makeFinalBuilder = (row: any) => {
  const single = jest.fn().mockResolvedValue({ data: row, error: null });
  const order = jest.fn().mockReturnValue({ single });
  const eq = jest.fn().mockReturnValue({ order });
  const select = jest.fn().mockReturnValue({ eq });
  return { select };
};

describe('POST /api/admin/nda-requests/[id]/decision', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env.ADMIN_EMAILS = 'admin@example.com';
    jest.mocked(createServerClient).mockResolvedValue(mockServerClient as any);
  });

  afterEach(() => {
    delete process.env.ADMIN_EMAILS;
  });

  it('approves a pending request and logs an audit event', async () => {
    const requestId = '33333333-3333-3333-3333-333333333333';
    const baseRow = { id: requestId };

    const updatedRow = {
      id: requestId,
      listing_id: 'listing-1',
      buyer_id: 'buyer-1',
      seller_id: 'seller-1',
      buyer_email: 'buyer@example.com',
      buyer_company: 'Cobalt Ventures',
      status: 'approved',
      requested_at: '2024-01-01T00:00:00.000Z',
      last_activity_at: '2024-01-02T00:00:00.000Z',
      expires_at: null,
      signed_at: null,
      document_url: 'https://example.com/nda.pdf',
      risk_level: 'medium',
      notes: null,
      listing: { id: 'listing-1', name: 'AI SaaS' },
      buyer: { id: 'buyer-1', full_name: 'Olivia Chen' },
      seller: { id: 'seller-1', full_name: 'Acme Inc.' },
      audit_events: [],
    };

    const finalRow = {
      ...updatedRow,
      audit_events: [
        {
          id: 'audit-1',
          event_type: 'approved',
          created_at: '2024-01-02T01:00:00.000Z',
          created_by: 'admin@example.com',
          request_id: requestId,
          agreement_id: null,
          note: null,
        },
      ],
    };

    const auditInsert = jest.fn().mockResolvedValue({ error: null });

    const fromMock = jest.fn().mockImplementation((table: string) => {
      if (table === 'nda_requests') {
        fromMock.calls = (fromMock.calls || 0) + 1;
        if (fromMock.calls === 1) return makeInitialBuilder(baseRow);
        if (fromMock.calls === 2) return makeUpdateBuilder(updatedRow);
        if (fromMock.calls === 3) return makeFinalBuilder(finalRow);
      }
      if (table === 'nda_audit_events') {
        return { insert: auditInsert };
      }
      throw new Error(`Unexpected table: ${table}`);
    });

    jest.mocked(createServiceRoleClient).mockReturnValue({ from: fromMock } as any);

    mockServerClient.auth.getUser.mockResolvedValue({
      data: { user: { id: 'admin-1', email: 'admin@example.com' } },
      error: null,
    });

    const response = await decideNda(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ status: 'approved' }),
        headers: { 'Content-Type': 'application/json' },
      }),
      { params: { id: requestId } }
    );

    expect(response.status).toBe(200);
    expect(auditInsert).toHaveBeenCalledWith({
      request_id: requestId,
      agreement_id: null,
      event_type: 'approved',
      created_by: 'admin@example.com',
      note: null,
    });

    const payload = (await response.json()) as { request: any };
    expect(payload.request.id).toBe(requestId);
    expect(payload.request.status).toBe('approved');
    expect(payload.request.auditTrail[0]?.type).toBe('approved');
  });
});
