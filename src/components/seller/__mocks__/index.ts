import React from 'react';

// Mock ListingStats component
export const mockListingStats = jest.fn(({ isLoading }: { isLoading: boolean }) => (
  React.createElement('div', { 'data-testid': 'listing-stats' },
    isLoading ? 'Loading stats...' : 'Listing Stats'
  )
));

// Mock DashboardHeader component
export const mockDashboardHeader = jest.fn(({ 
  title, 
  description, 
  onRefresh, 
  isRefreshing, 
  onCreateNewListing 
}: { 
  title: string; 
  description: string; 
  onRefresh?: () => void; 
  isRefreshing?: boolean; 
  onCreateNewListing?: () => void;
}) => {
  const refreshButton = onRefresh ? 
    React.createElement('button', {
      onClick: onRefresh,
      disabled: isRefreshing,
      'data-testid': 'refresh-button',
      key: 'refresh'
    }, isRefreshing ? 'Refreshing...' : 'Refresh') : null;

  const newListingButton = React.createElement('button', {
    onClick: onCreateNewListing,
    'data-testid': 'new-listing-button',
    key: 'new-listing'
  }, 'New Listing');

  return React.createElement('div', { 'data-testid': 'dashboard-header' },
    React.createElement('h1', null, title),
    React.createElement('p', null, description),
    refreshButton,
    newListingButton
  );
});

// Mock RecentListings component
export const mockRecentListings = jest.fn(({ 
  listings, 
  onViewListing, 
  isLoading 
}: { 
  listings: any[]; 
  onViewListing: (id: string) => void; 
  isLoading: boolean;
}) => {
  let content;
  
  if (isLoading) {
    content = React.createElement('div', { 'data-testid': 'loading-indicator' }, 'Loading...');
  } else if (listings.length === 0) {
    content = React.createElement('p', null, 'No listings found');
  } else {
    content = React.createElement('ul', null,
      listings.map((listing) =>
        React.createElement('li', {
          key: listing.id,
          onClick: () => onViewListing(listing.id),
          'data-testid': `listing-${listing.id}`
        }, listing.headline)
      )
    );
  }

  return React.createElement('div', { 'data-testid': 'recent-listings' },
    React.createElement('h2', null, 'Recent Listings'),
    content
  );
});

// Set up the mocks
jest.mock('@/components/dashboard/ListingStats', () => ({
  ListingStats: mockListingStats
}));

jest.mock('../components/DashboardHeader', () => ({
  DashboardHeader: mockDashboardHeader
}));

jest.mock('../components/RecentListings', () => ({
  RecentListings: mockRecentListings
}));
