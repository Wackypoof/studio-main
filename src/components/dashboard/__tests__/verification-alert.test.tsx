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
    const { container } = render(
      <VerificationAlert className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('calls onAction when the button is clicked', () => {
    render(<VerificationAlert onAction={mockOnClick} />);
    
    const button = screen.getByRole('button', { name: /start verification/i });
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
