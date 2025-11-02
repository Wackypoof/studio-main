/**
 * @jest-environment node
 */

import { POST as renewNda } from '@/app/api/ndas/[id]/renewal/route';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-client';

jest.mock('@/lib/supabase/server');
jest.mock('@/lib/supabase/service-client');

const mockServerClient = {
  auth: {
    getUser: jest.fn(),
  },
};

const selectMock = jest.fn();
const eqMock = jest.fn();
const singleMock = jest.fn();
const updateMock = jest.fn();
const updateEqMock = jest.fn();
const auditInsertMock = jest.fn();

const resetSupabaseMocks = () => {
  selectMock.mockReset();
  eqMock.mockReset();
  singleMock.mockReset();
  updateMock.mockReset();
  updateEqMock.mockReset();
  auditInsertMock.mockReset();

  auditInsertMock.mockResolvedValue({ error: null });

  selectMock.mockReturnValue({
    eq: eqMock.mockReturnValue({
      single: singleMock,
    }),
  });

  updateMock.mockReturnValue({
    eq: updateEqMock,
  });

  const supabaseMock = {
    from: jest.fn((table: string) => {
      if (table === 'nda_agreements') {
        return {
          select: selectMock,
          update: updateMock,
        };
      }

      if (table === 'nda_audit_events') {
        return {
          insert: auditInsertMock,
        };
      }

      throw new Error(`Unexpected table: ${table}`);
    }),
  };

  jest.mocked(createServiceRoleClient).mockReturnValue(supabaseMock as any);
};

describe('POST /api/ndas/[id]/renewal', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.mocked(createServerClient).mockResolvedValue(mockServerClient as any);
    resetSupabaseMocks();
  });

  it('marks an agreement for renewal when requested by the buyer', async () => {
    const agreement = {
      id: '11111111-1111-1111-1111-111111111111',
      listing_id: 'listing-1',
      buyer_id: 'user-1',
      seller_id: 'user-2',
      buyer_company: 'Cobalt Ventures',
      status: 'signed',
      signed_at: '2024-01-01T00:00:00.000Z',
      expires_at: '2024-12-01T00:00:00.000Z',
      document_url: 'https://example.com/nda.pdf',
      renewal_requested: false,
      security_level: 'standard',
      updated_at: '2024-02-01T00:00:00.000Z',
      listing: { id: 'listing-1', name: 'Premium Skincare Dropshipping Store' },
      buyer: { id: 'user-1', full_name: 'Jane Buyer' },
      seller: { id: 'user-2', full_name: 'John Seller' },
    };

    mockServerClient.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user-1', email: 'buyer@example.com' } },
      error: null,
    });

    singleMock.mockResolvedValue({ data: { ...agreement }, error: null });
    updateEqMock.mockResolvedValue({ error: null });

    const response = await renewNda(new Request('http://localhost'), {
      params: { id: agreement.id },
    });

    expect(response.status).toBe(200);

    expect(updateMock).toHaveBeenCalledTimes(1);
    const updatePayload = updateMock.mock.calls[0][0];
    expect(updatePayload).toMatchObject({ renewal_requested: true });

    const payload = (await response.json()) as { agreement: any };
    expect(payload.agreement.id).toBe(agreement.id);
    expect(payload.agreement.renewalRequested).toBe(true);
    expect(auditInsertMock).toHaveBeenCalledTimes(1);
    expect(auditInsertMock.mock.calls[0][0]).toMatchObject({
      agreement_id: agreement.id,
      event_type: 'system',
    });
  });

  it('returns 401 when no authenticated user is present', async () => {
    mockServerClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const response = await renewNda(new Request('http://localhost'), {
      params: { id: '22222222-2222-2222-2222-222222222222' },
    });

    expect(response.status).toBe(401);
    expect(updateMock).not.toHaveBeenCalled();
    expect(auditInsertMock).not.toHaveBeenCalled();
  });
});
