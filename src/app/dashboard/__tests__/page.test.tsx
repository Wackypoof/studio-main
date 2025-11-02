import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
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

describe('Dashboard Page', () => {
  it('renders loading state initially', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    jest.useFakeTimers();

    try {
      render(<Page />); 
      expect(document.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
      expect(screen.queryByText(/buyer dashboard/i)).not.toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(300);
      });
    } finally {
      process.env.NODE_ENV = originalEnv;
      jest.useRealTimers();
    }
  });

  it('displays user greeting when loaded', async () => {
    render(<Page />);
    
    await waitFor(() => {
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    });
  });

  it('shows verification alert when needed', async () => {
    render(<Page />);
    
    await waitFor(() => {
      expect(screen.getByText(/verification required/i)).toBeInTheDocument();
    });
  });
});
