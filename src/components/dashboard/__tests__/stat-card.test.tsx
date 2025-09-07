import React from 'react';
import { render, screen } from '@testing-library/react';
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
});
