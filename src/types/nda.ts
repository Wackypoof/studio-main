import type { 
  NdaStatus, 
  NdaRequestStatus, 
  NdaRiskLevel, 
  NdaAuditEventType 
} from '@/types/db';

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

export type {
  NdaStatus,
  NdaRequestStatus,
  NdaRiskLevel,
  NdaAuditEventType,
};
