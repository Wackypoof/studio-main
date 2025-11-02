import type {
  NdaAgreementSummary,
  NdaApprovalRequestSummary,
  NdaAuditEvent,
  NdaSecurityLevel,
} from '@/types/nda';

const normalizeSecurityLevel = (value: string | null | undefined): NdaSecurityLevel =>
  value === 'strict' ? 'strict' : 'standard';

const mapAuditTrail = (rows: any[] | null | undefined): NdaAuditEvent[] =>
  (rows ?? []).map((event) => ({
    id: event.id,
    type: event.event_type,
    createdAt: event.created_at,
    createdBy: event.created_by,
    requestId: event.request_id ?? null,
    agreementId: event.agreement_id ?? null,
    note: event.note ?? null,
  }));

export const mapAgreementRow = (row: any): NdaAgreementSummary => ({
  id: row.id,
  listingId: row.listing_id,
  listingName: row.listing?.name ?? 'Untitled listing',
  sellerName: row.seller?.full_name ?? 'Seller',
  buyerName: row.buyer?.full_name ?? 'Buyer',
  buyerCompany: row.buyer_company ?? null,
  status: row.status,
  signedDate: row.signed_at,
  expiresDate: row.expires_at,
  documentUrl: row.document_url,
  lastUpdated: row.updated_at,
  renewalRequested: Boolean(row.renewal_requested),
  securityLevel: normalizeSecurityLevel(row.security_level),
});

export const mapRequestRow = (row: any): NdaApprovalRequestSummary => ({
  id: row.id,
  listingId: row.listing_id,
  listingName: row.listing?.name ?? 'Untitled listing',
  sellerName: row.seller?.full_name ?? 'Seller',
  buyerName: row.buyer?.full_name ?? 'Buyer',
  buyerEmail: row.buyer_email,
  buyerCompany: row.buyer_company ?? null,
  status: row.status,
  requestedAt: row.requested_at,
  lastActivityAt: row.last_activity_at,
  expiresDate: row.expires_at,
  signedDate: row.signed_at,
  documentUrl: row.document_url,
  riskLevel: row.risk_level,
  notes: row.notes ?? null,
  auditTrail: mapAuditTrail(row.audit_events),
});
