/**
 * Consolidated database type definitions
 * Single source of truth for all Supabase database types
 * Re-exports from the generated database.types.ts
 */

import type { Database as DatabaseGenerated } from '@/lib/supabase/database.types';

// Main database type
export type Database = DatabaseGenerated;

// Helper type utilities
export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row'];

export type TablesInsert<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert'];

export type TablesUpdate<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update'];

export type Enums<T extends keyof Database['public']['Enums']> = 
  Database['public']['Enums'][T];

export type Views<T extends keyof Database['public']['Views']> = 
  Database['public']['Views'][T]['Row'];

// Commonly used types
export type Profile = Tables<'profiles'>;
export type Listing = Tables<'listings'>;
export type ListingFinancial = Tables<'listing_financials'>;
export type ListingDocument = Tables<'listing_documents'>;
export type ListingPhoto = Tables<'listing_photos'>;
export type NdaRequest = Tables<'nda_requests'>;
export type NdaAgreement = Tables<'nda_agreements'>;
export type Offer = Tables<'offers'>;
export type BuyerLead = Tables<'buyer_leads'>;
export type BuyerSavedListing = Tables<'buyer_saved_listings'>;

// Enum types
export type UserRole = Enums<'user_role'>;
export type ListingStatus = Enums<'listing_status'>;
export type DocumentStatus = Enums<'document_status'>;
export type DocumentType = Enums<'document_type'>;
export type NdaStatus = Enums<'nda_status'>;
export type NdaRequestStatus = Enums<'nda_request_status'>;
export type NdaRiskLevel = Enums<'nda_risk_level'>;
export type NdaAuditEventType = Enums<'nda_audit_event_type'>;

// Re-export Json type from generated types
export type { Json } from '@/lib/supabase/database.types';
