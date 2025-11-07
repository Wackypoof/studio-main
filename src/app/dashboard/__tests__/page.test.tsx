import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '../page';

const mockToggleRole = jest.fn();
const mockRefetch = jest.fn();
const mockDashboardData = {
  stats: {
    savedListings: 0,
    activeNdas: 0,
    activeOffers: 0,
    unreadMessages: 0,
  },
  recentActivity: [],
  verificationStatus: 'unverified' as const,
};

jest.mock('@/context/AuthProvider', () => ({
  useAuth: () => ({
    user: {
      id: 'test-user-id',
      email: 'buyer@example.com',
      user_metadata: { full_name: 'Test Buyer' },
    },
    session: null,
    isLoading: false,
    isAuthenticating: false,
    isInitialized: true,
    error: null,
    clearError: jest.fn(),
    signIn: jest.fn(),
    signInWithProvider: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    updateProfile: jest.fn(),
  }),
}));

jest.mock('@/contexts/role-context', () => ({
  useRole: () => ({
    role: 'buyer',
    isBuyer: true,
    isSeller: false,
    toggleRole: mockToggleRole,
  }),
}));

jest.mock('@/hooks/useBuyerDashboardSummary', () => ({
  useBuyerDashboardSummary: () => ({
    data: mockDashboardData,
    isLoading: false,
    isRefetching: false,
    error: null,
    refetch: mockRefetch,
  }),
}));

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

const renderDashboard = async () => {
  await act(async () => {
    render(<Page />);
  });
};

describe('Dashboard Page', () => {
  it('renders loading state initially', async () => {
    const env = process.env as NodeJS.ProcessEnv & { NODE_ENV?: string };
    const originalEnv = env.NODE_ENV;
    env.NODE_ENV = 'development';
    jest.useFakeTimers();

    try {
      await renderDashboard();
      expect(document.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
      expect(screen.queryByText(/welcome back/i)).not.toBeInTheDocument();

      await act(async () => {
        jest.advanceTimersByTime(300);
        await Promise.resolve();
      });

      await screen.findByText(/welcome back/i);
    } finally {
      env.NODE_ENV = originalEnv ?? 'development';
      jest.useRealTimers();
    }
  });

  it('displays user greeting when loaded', async () => {
    await renderDashboard();

    expect(await screen.findByText(/welcome back/i)).toBeInTheDocument();
  });

  it('shows verification alert when needed', async () => {
    await renderDashboard();

    expect(await screen.findByText(/complete your profile verification/i)).toBeInTheDocument();
  });
});
