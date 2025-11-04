import type { DocumentStatus, DocumentType, ListingStatus as ListingStatusDb } from '@/types/db';

export type ListingStatus = 'draft' | 'pending' | 'live' | 'paused' | 'under_offer' | 'closed';

export type Listing = {
  id: string;
  userId: string; // ID of the user who owns this listing
  status: ListingStatus;
  vertical: string;
  location_area: string;
  headline: string;
  teaser: string;
  revenue_t12m: number;
  profit_t12m: number;
  revenue_last_month: number;
  profit_last_month: number;
  asking_price: number;
  asking_price_reasoning: string;
  assets_summary: string;
  licences_summary: string;
  teamSize: number;
  staff_count?: number; // Number of staff members (optional)
  established: string; // ISO date string
  hoursPerWeek: number;
  market: string;
  lease_summary: string;
  verified: boolean;
  // Average seller response time in hours (optional)
  avg_response_time_hours?: number;
  sellingReason?: 'starting_new_venture' | 'lack_of_time' | 'financing' | 'bootstrapped';
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

export type ListingMeta = {
  teaser?: string | null;
  vertical?: string | null;
  location_area?: string | null;
  asking_price_reasoning?: string | null;
  assets_summary?: string | null;
  licences_summary?: string | null;
  lease_summary?: string | null;
  hours_per_week?: number | null;
  market?: string | null;
  verified?: boolean | null;
  avg_response_time_hours?: number | null;
  sellingReason?: Listing['sellingReason'];
  established?: string | null;
  revenue_last_month?: number | string | null;
  profit_last_month?: number | string | null;
  business_summary?: string | null;
  businessSummary?: string | null;
  traffic_history?: Array<{ period: string; visitors: number }>;
  trafficHistory?: Array<{ period: string; visitors: number }>;
  traffic_sources?: Array<{ source: string; value: number }>;
  trafficSources?: Array<{ source: string; value: number }>;
  traffic_summary?: {
    total_visitors?: number | null;
    pages_per_visit?: number | null;
    avg_session_duration_minutes?: number | null;
  };
  trafficSummary?: {
    totalVisitors?: number | null;
    pagesPerVisit?: number | null;
    avgSessionDurationMinutes?: number | null;
  };
  documents?: Array<{
    name?: string;
    title?: string;
    storage_path?: string;
    path?: string;
    type?: string;
    size?: number | string;
  }>;
} & Record<string, unknown>;

export type ListingFinancialSnapshot = {
  fiscalYear: number | null;
  currency: string | null;
  revenue: number | null;
  profit: number | null;
  assets: number | null;
  askingPrice: number | null;
  valuationMultiple: number | null;
  growthRate: number | null;
};

export type ListingDocumentSummary = {
  id: string;
  docType: DocumentType;
  status: DocumentStatus;
  fileName: string | null;
  fileSize: number | null;
  storagePath: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
  verifiedAt: string | null;
  verifiedBy: string | null;
};

export type ListingTrafficPoint = {
  period: string;
  visitors: number;
};

export type ListingTrafficSource = {
  source: string;
  value: number;
};

export type ListingTrafficSummary = {
  totalVisitors?: number | null;
  pagesPerVisit?: number | null;
  avgSessionDurationMinutes?: number | null;
};

export type ListingTrafficMetrics = {
  history: ListingTrafficPoint[];
  sources: ListingTrafficSource[];
  summary: ListingTrafficSummary;
};

export type ListingWithMeta = Listing & {
  raw_status: ListingStatusDb;
  financials: ListingFinancialSnapshot | null;
  meta: ListingMeta;
};

export type ListingDetails = ListingWithMeta & {
  financialHistory: ListingFinancialSnapshot[];
  documents: ListingDocumentSummary[];
  traffic: ListingTrafficMetrics;
};

export type User = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  isVerifiedBuyer: boolean;
};

export type Seller = {
  id: string;
  userId: string;
  listingIds: string[];
};
