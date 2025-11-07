export type DashboardVerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export type BuyerDashboardActivityType = 'saved_listing' | 'nda' | 'offer' | 'message';

export interface BuyerDashboardActivityItem {
  id: string;
  type: BuyerDashboardActivityType;
  title: string;
  subtitle: string;
  timestamp: string;
  href: string;
}

export interface BuyerDashboardStats {
  savedListings: number;
  activeNdas: number;
  activeOffers: number;
  unreadMessages: number;
}

export interface BuyerDashboardSummaryResponse {
  stats: BuyerDashboardStats;
  recentActivity: BuyerDashboardActivityItem[];
  verificationStatus: DashboardVerificationStatus;
}
