export type Listing = {
  id: string;
  status: 'draft' | 'pending' | 'live' | 'paused' | 'under_offer' | 'closed';
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
  staff_count: number;
  lease_summary: string;
  verified: boolean;
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
