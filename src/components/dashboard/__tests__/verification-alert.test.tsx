import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { VerificationAlert } from '../verification-alert';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('VerificationAlert', () => {
  it('renders with default props', () => {
    render(<VerificationAlert />);
    
    expect(screen.getByText('Action Required: Verify Your Account')).toBeInTheDocument();
    expect(screen.getByText('Start Verification')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <VerificationAlert className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has correct verification link', () => {
    render(<VerificationAlert />);
    
    const link = screen.getByRole('link', { name: /start verification/i });
    expect(link).toHaveAttribute('href', '/my-dashboard/verification');
  });
});
