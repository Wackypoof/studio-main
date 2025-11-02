import type { Database } from '@/types/supabase';

export type NdaStatus = Database['public']['Enums']['nda_status'];
export type NdaRequestStatus = Database['public']['Enums']['nda_request_status'];
export type NdaRiskLevel = Database['public']['Enums']['nda_risk_level'];
export type NdaAuditEventType = Database['public']['Enums']['nda_audit_event_type'];

export interface NdaAuditEvent {
  id: string;
  type: NdaAuditEventType;
  createdAt: string;
  createdBy: string;
  requestId?: string | null;
  agreementId?: string | null;
  note?: string | null;
}

export type NdaSecurityLevel = 'standard' | 'strict';

export interface NdaAgreementSummary {
  id: string;
  listingId: string;
  listingName: string;
  sellerName: string;
  buyerName: string;
  buyerCompany?: string | null;
  status: NdaStatus;
  signedDate?: string | null;
  expiresDate?: string | null;
  documentUrl?: string | null;
  lastUpdated: string;
  renewalRequested: boolean;
  securityLevel: NdaSecurityLevel;
}

export interface NdaApprovalRequestSummary {
  id: string;
  listingId: string;
  listingName: string;
  sellerName: string;
  buyerName: string;
  buyerEmail: string;
  buyerCompany?: string | null;
  status: NdaRequestStatus;
  requestedAt: string;
  lastActivityAt: string;
  expiresDate?: string | null;
  signedDate?: string | null;
  documentUrl?: string | null;
  riskLevel: NdaRiskLevel;
  notes?: string | null;
  auditTrail: NdaAuditEvent[];
}
