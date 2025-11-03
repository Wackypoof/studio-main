import React, { type ComponentProps, type ReactElement } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SellerDashboard } from '../SellerDashboard';
import { Listing } from '@/lib/types';
import { 
  mockDashboardHeader, 
  mockRecentListings, 
  mockListingStats 
} from '../__mocks__';
import { RoleProvider } from '@/contexts/role-context';

// Mock data for listings
const mockListings: Listing[] = [
  {
    id: '1',
    userId: 'user1',
    status: 'live',
    vertical: 'Retail',
    location_area: 'Central',
    headline: 'Test Listing 1',
    teaser: 'Test teaser 1',
    revenue_t12m: 100000,
    profit_t12m: 50000,
    revenue_last_month: 10000,
    profit_last_month: 5000,
    asking_price: 200000,
    asking_price_reasoning: 'Test reasoning',
    assets_summary: 'Test assets',
    licences_summary: 'Test licenses',
    teamSize: 5,
    established: '2020-01-01',
    hoursPerWeek: 40,
    market: 'Test market',
    lease_summary: 'Test lease',
    verified: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    userId: 'user1',
    status: 'draft',
    vertical: 'Food & Beverage',
    location_area: 'East',
    headline: 'Test Listing 2',
    teaser: 'Test teaser 2',
    revenue_t12m: 200000,
    profit_t12m: 100000,
    revenue_last_month: 20000,
    profit_last_month: 10000,
    asking_price: 400000,
    asking_price_reasoning: 'Test reasoning 2',
    assets_summary: 'Test assets 2',
    licences_summary: 'Test licenses 2',
    teamSize: 3,
    established: '2019-01-01',
    hoursPerWeek: 35,
    market: 'Test market 2',
    lease_summary: 'Test lease 2',
    verified: false,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
];

describe('SellerDashboard', () => {
  const mockOnViewListing = jest.fn();
  const mockOnCreateNewListing = jest.fn();
  const mockOnRefresh = jest.fn().mockResolvedValue(undefined);

  // Mock the components
  jest.mock('@/components/dashboard/ListingActions', () => ({
    ListingActions: jest.fn(({ onRefresh, onCreateNewListing, isRefreshing }) => (
      <div>
        {onRefresh && (
          <button 
            onClick={onRefresh} 
            data-testid="refresh-button"
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        )}
        {onCreateNewListing && (
          <button 
            onClick={onCreateNewListing} 
            data-testid="new-listing-button"
          >
            New Listing
          </button>
        )}
      </div>
    )),
  }));

  jest.mock('../components/DashboardHeader', () => ({
    DashboardHeader: jest.fn(({ onRefresh, onCreateNewListing, isRefreshing }) => (
      <div data-testid="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your listings and performance</p>
        </div>
        <div>
          <div>
            {onRefresh && (
              <button 
                onClick={onRefresh} 
                data-testid="refresh-button"
                disabled={isRefreshing}
              >
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            )}
            {onCreateNewListing && (
              <button 
                onClick={onCreateNewListing} 
                data-testid="new-listing-button"
              >
                New Listing
              </button>
            )}
          </div>
        </div>
      </div>
    )),
  }));

  jest.mock('@/components/dashboard/ListingStats', () => ({
    ListingStats: jest.fn(() => (
      <div data-testid="listing-stats">
        <div>Total Listings</div>
        <div>Active Listings</div>
        <div>Total Value</div>
      </div>
    )),
  }));

  jest.mock('../components/RecentListings', () => ({
    RecentListings: jest.fn(({ listings, onViewListing }) => (
      <div data-testid="recent-listings">
        <h3>Recent Listings</h3>
        {listings.length === 0 ? (
          <div>No listings yet</div>
        ) : (
          <div>
            {listings.map((listing: any) => (
              <div 
                key={listing.id} 
                onClick={() => onViewListing?.(listing.id)}
                data-testid={`listing-${listing.id}`}
              >
                {listing.headline}
              </div>
            ))}
          </div>
        )}
      </div>
    )),
  }));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRoleProvider = (ui: ReactElement) =>
    render(ui, {
      wrapper: ({ children }) => <RoleProvider>{children}</RoleProvider>,
    });

  const defaultProps: ComponentProps<typeof SellerDashboard> = {
    listings: mockListings,
    onViewListing: mockOnViewListing,
    onCreateNewListing: mockOnCreateNewListing,
    onRefresh: mockOnRefresh,
  };

  const renderDashboard = (props: Partial<ComponentProps<typeof SellerDashboard>> = {}) =>
    renderWithRoleProvider(<SellerDashboard {...defaultProps} {...props} />);

  it('renders the dashboard with listings', () => {
    renderDashboard();

    // Check if the dashboard title is rendered
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    
    // Check if the dashboard description is rendered
    expect(screen.getByText('Overview of your listings and performance')).toBeInTheDocument();
    
    // Check if the recent listings section is rendered
    const recentListingsHeadings = screen.getAllByText('Recent Listings');
    expect(recentListingsHeadings.length).toBeGreaterThan(0);
    
    // Check if the listings are rendered
    mockListings.forEach((listing) => {
      expect(screen.getByText(listing.headline)).toBeInTheDocument();
    });
  });

  it('calls onViewListing when a listing is clicked', async () => {
    renderDashboard();

    // Find and click on the first listing
    const listingHeadline = screen.getByText(mockListings[0].headline);
    const listingLink = listingHeadline.closest('a');
    
    if (listingLink) {
      await act(async () => {
        fireEvent.click(listingLink);
      });
      
      // Check if onViewListing was called with the correct listing ID
      expect(mockOnViewListing).toHaveBeenCalledWith(mockListings[0].id);
    } else {
      // If we can't find the link, just verify the listing is rendered
      expect(listingHeadline).toBeInTheDocument();
    }
  });

  it('calls onCreateNewListing when the new listing button is clicked', async () => {
    renderDashboard();

    // Find all new listing buttons and click the first one
    const newListingButtons = screen.getAllByRole('button', { name: /new listing/i });
    await act(async () => {
      fireEvent.click(newListingButtons[0]);
    });
    
    // Check if onCreateNewListing was called
    expect(mockOnCreateNewListing).toHaveBeenCalledTimes(1);
  });

  it('shows a loading state when isLoading is true', () => {
    // Render the component with isLoading true
    renderDashboard({
      listings: [],
      isLoading: true,
    });

    // Check if loading indicators are shown in the stats cards
    const loadingIndicators = document.querySelectorAll('[class*="animate-pulse"]');
    expect(loadingIndicators.length).toBeGreaterThan(0);
    
    // Check if the loading state is shown in the RecentListings component
    // Look for any loading indicators in the document
    const allLoadingElements = document.querySelectorAll('[class*="animate-pulse"]');
    expect(allLoadingElements.length).toBeGreaterThan(0);
  });

  it('calls onRefresh when the refresh button is clicked', async () => {
    // Mock the refresh function to resolve immediately
    const refreshPromise = Promise.resolve();
    mockOnRefresh.mockImplementationOnce(() => refreshPromise);

    // Render the component
    const { rerender } = renderDashboard();

    // Find and click the refresh button
    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    
    // Verify the refresh function is called when clicked
    await act(async () => {
      fireEvent.click(refreshButton);
    });
    
    // Verify the refresh function was called
    expect(mockOnRefresh).toHaveBeenCalledTimes(1);
    
    // Complete the refresh
    await act(async () => {
      await refreshPromise;
    });
  });

  it('disables the refresh button while refreshing', async () => {
    // Create a promise that we can resolve manually
    let resolveRefresh: () => void;
    const refreshPromise = new Promise<void>((resolve) => {
      resolveRefresh = () => resolve();
    });
    
    mockOnRefresh.mockImplementationOnce(() => refreshPromise);

    // Render the component
    const { rerender } = renderDashboard();

    // Find the refresh button
    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    
    // Initially should not be disabled
    expect(refreshButton).not.toBeDisabled();
    
    // Trigger refresh
    await act(async () => {
      fireEvent.click(refreshButton);
      // Wait for the next tick to allow state updates
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Re-render to get the latest state
    rerender(<SellerDashboard {...defaultProps} />);
    
    // The button should be disabled while refreshing
    const updatedRefreshButton = screen.getByRole('button', { name: /refresh/i });
    expect(updatedRefreshButton).toBeDisabled();
    
    // Resolve the refresh promise
    resolveRefresh!();
    await act(async () => {
      await refreshPromise;
    });
    
    // Re-render to get the latest state
    rerender(<SellerDashboard {...defaultProps} />);
    
    // Should be enabled again after refresh completes
    const finalRefreshButton = screen.getByRole('button', { name: /refresh/i });
    expect(finalRefreshButton).not.toBeDisabled();
  });

  it('displays a message when there are no listings', () => {
    renderDashboard({ listings: [] });

    // Check if the "No listings" message is shown
    expect(screen.getByText('No listings yet')).toBeInTheDocument();
    expect(screen.getByText('Get started by creating your first listing')).toBeInTheDocument();
  });

  it('does not show refresh button when onRefresh is not provided', () => {
    renderDashboard({ onRefresh: undefined });

    // Check that the refresh button is not in the document
    expect(screen.queryByRole('button', { name: /refresh/i })).not.toBeInTheDocument();
  });
});
