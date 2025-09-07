import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DashboardSkeleton } from '../skeleton-loaders';

describe('DashboardSkeleton', () => {
  it('renders skeleton elements', () => {
    render(<DashboardSkeleton />);
    
    // Check for skeleton elements
    expect(screen.getByRole('status')).toBeInTheDocument();
    
    // Check for specific skeleton elements
    const dashboardSkeleton = screen.getByTestId('dashboard-skeleton');
    expect(dashboardSkeleton).toBeInTheDocument();
    
    // Check for stat card skeletons
    const statCardSkeletons = screen.getAllByTestId('stat-card-skeleton');
    expect(statCardSkeletons.length).toBeGreaterThan(0);
  });
});
