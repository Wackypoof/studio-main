import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '../page';

const mockToggleRole = jest.fn();

jest.mock('@/contexts/role-context', () => ({
  useRole: () => ({
    role: 'buyer',
    isBuyer: true,
    isSeller: false,
    toggleRole: mockToggleRole,
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
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
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
      process.env.NODE_ENV = originalEnv;
      jest.useRealTimers();
    }
  });

  it('displays user greeting when loaded', async () => {
    await renderDashboard();

    expect(await screen.findByText(/welcome back/i)).toBeInTheDocument();
  });

  it('shows verification alert when needed', async () => {
    await renderDashboard();

    expect(await screen.findByText(/verification required/i)).toBeInTheDocument();
  });
});
