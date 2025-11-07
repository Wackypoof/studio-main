import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StatCard } from '../stat-card';
import { FileSignature } from 'lucide-react';

describe('StatCard', () => {
  it('renders with correct title and value', () => {
    render(
      <StatCard 
        title="Test Title" 
        value={42} 
        description="Test Description"
        icon={<FileSignature />}
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    const { container } = render(
      <StatCard 
        title="Test" 
        value={0} 
        description="Test"
        icon={<FileSignature />}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders trend indicators when provided', () => {
    const { container } = render(
      <StatCard
        title="Trend"
        value={100}
        description="Trend description"
        icon={<FileSignature />}
        trend={{ value: '12%', type: 'up' }}
      />,
    );

    expect(screen.getByText('12%')).toBeInTheDocument();
    expect(container.querySelectorAll('svg')).toHaveLength(2);
  });

  it('handles clicks when clickable', () => {
    const handleClick = jest.fn();
    render(
      <StatCard
        title="Clickable"
        value={10}
        description="Click to view details"
        icon={<FileSignature />}
        clickable
        onClick={handleClick}
      />,
    );

    const buttonWrapper = screen.getByRole('button');
    expect(buttonWrapper).toHaveAttribute('tabindex', '0');
    fireEvent.click(buttonWrapper);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
