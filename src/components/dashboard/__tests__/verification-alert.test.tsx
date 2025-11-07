import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { VerificationAlert } from '../verification-alert';

describe('VerificationAlert', () => {
  const mockOnClick = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<VerificationAlert />);
    
    expect(screen.getByText('Verification Required')).toBeInTheDocument();
    expect(screen.getByText('Complete your profile verification to access all features and increase trust with buyers.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start verification/i })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<VerificationAlert className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('calls onAction when the button is clicked', () => {
    render(<VerificationAlert onAction={mockOnClick} />);
    
    const button = screen.getByRole('button', { name: /start verification/i });
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('sets accessibility attributes for status announcements', () => {
    render(<VerificationAlert status="pending" />);

    const alert = screen.getByRole('status');
    expect(alert).toHaveAttribute('aria-live', 'polite');
    expect(alert).toHaveAttribute('data-status', 'pending');
  });

  it.each([
    { status: 'unverified', title: 'Verification Required' },
    { status: 'pending', title: 'Verification in Progress' },
    { status: 'verified', title: 'Seller Verified' },
    { status: 'rejected', title: 'Verification Needed' },
  ] as const)('renders the $status state copy', ({ status, title }) => {
    render(<VerificationAlert status={status} />);

    const alert = screen.getByRole('status');
    expect(alert).toHaveAttribute('data-status', status);
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('allows overriding message and action text', () => {
    render(
      <VerificationAlert
        status="pending"
        message="Custom message"
        actionText="Resolve now"
        variant="secondary"
      />,
    );

    expect(screen.getByText('Custom message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /resolve now/i })).toBeInTheDocument();
  });
});
