import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '../page';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  usePathname() {
    return '';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock the dashboard components
jest.mock('@/components/dashboard', () => ({
  __esModule: true,
  ...jest.requireActual('@/components/dashboard'),
  DashboardSkeleton: () => <div data-testid="dashboard-skeleton">Loading...</div>,
}));

describe('Dashboard Page', () => {
  it('renders loading state initially', () => {
    render(<Page />);
    expect(screen.getByTestId('dashboard-skeleton')).toBeInTheDocument();
  });

  it('displays user greeting when loaded', async () => {
    render(<Page />);
    
    await waitFor(() => {
      expect(screen.getByText(/welcome,/i)).toBeInTheDocument();
    });
  });

  it('shows verification alert when needed', async () => {
    render(<Page />);
    
    await waitFor(() => {
      expect(screen.getByText(/action required: verify your account/i)).toBeInTheDocument();
    });
  });
});
