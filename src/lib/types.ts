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
  staff_count: number;
  teamSize: number;
  established: string; // ISO date string
  hoursPerWeek: number;
  market: string;
  lease_summary: string;
  verified: boolean;
  sellingReason?: 'starting_new_venture' | 'lack_of_time' | 'financing' | 'bootstrapped';
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
