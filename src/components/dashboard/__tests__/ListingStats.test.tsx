import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ListingStats } from '../ListingStats';
import type { Listing } from '@/lib/types';

const baseListing: Listing = {
  id: 'listing-1',
  userId: 'user-1',
  status: 'live',
  vertical: 'Retail',
  location_area: 'Central',
  headline: 'Listing Headline',
  teaser: 'Short teaser',
  revenue_t12m: 0,
  profit_t12m: 0,
  revenue_last_month: 0,
  profit_last_month: 0,
  asking_price: 0,
  asking_price_reasoning: 'Reasoning',
  assets_summary: 'Assets',
  licences_summary: 'Licences',
  teamSize: 1,
  established: '2023-01-01',
  hoursPerWeek: 10,
  market: 'SG',
  lease_summary: 'Lease',
  verified: true,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
};

const createListing = (
  overrides: Partial<Listing> & {
    views?: number | null;
    leads?: number | null;
    avg_response_time_hours?: number | null;
  },
) => ({
  ...baseListing,
  ...overrides,
});

describe('ListingStats', () => {
  it('aggregates listings into dashboard metrics', () => {
    const listings = [
      createListing({
        id: 'listing-1',
        status: 'live',
        views: 100,
        leads: 8,
        avg_response_time_hours: 2,
      }),
      createListing({
        id: 'listing-2',
        status: 'draft',
        views: 30,
        leads: 4,
        avg_response_time_hours: 4,
      }),
      createListing({
        id: 'listing-3',
        status: 'live',
        views: 20,
        leads: null,
        avg_response_time_hours: null,
      }),
    ];

    render(<ListingStats listings={listings} />);

    const activeCard = screen.getByText(/Active Listings/i).closest('div');
    expect(activeCard).toHaveTextContent('2');

    const viewsCard = screen.getByText(/Total Views/i).closest('div');
    expect(viewsCard).toHaveTextContent('150');

    const leadsCard = screen.getByText(/Buyer Leads/i).closest('div');
    expect(leadsCard).toHaveTextContent('12');

    const responseCard = screen.getByText(/Avg\. Response Time/i).closest('div');
    expect(responseCard).toHaveTextContent('3h');
  });

  it('falls back to default response time when no metrics are present', () => {
    const listings = [
      createListing({
        id: 'listing-4',
        status: 'live',
        views: 0,
        leads: 0,
      }),
    ];

    render(<ListingStats listings={listings} />);

    expect(screen.getByText('2.5h')).toBeInTheDocument();
  });

  it('renders skeleton state while loading', () => {
    const { container } = render(<ListingStats isLoading />);

    const skeletonGrid = screen.getByTestId('listing-stats-skeleton');
    expect(skeletonGrid).toBeInTheDocument();
    expect(within(skeletonGrid).getAllByTestId('listing-stats-skeleton-card')).toHaveLength(4);
    expect(container.querySelector('[data-testid="listing-stats"]')).toBeNull();
  });
});
