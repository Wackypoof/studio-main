import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorBoundary } from '../ErrorBoundary';

// A component that throws an error
const ErrorComponent = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  // Suppress console.error during tests
  const originalError = console.error;
  const fallbackHeadline = /oops! something went wrong/i;
  
  beforeAll(() => {
    console.error = jest.fn();
  });
  
  afterAll(() => {
    console.error = originalError;
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('catches errors and displays fallback UI', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText(fallbackHeadline)).toBeInTheDocument();
    expect(
      screen.getByText(/we've been notified about this issue/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /refresh page/i })).toBeInTheDocument();
  });

  it('calls onError when an error is caught', () => {
    const mockOnError = jest.fn();
    
    render(
      <ErrorBoundary onError={mockOnError}>
        <ErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(mockOnError).toHaveBeenCalledTimes(1);
    expect(mockOnError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(mockOnError.mock.calls[0][0].message).toBe('Test error');
  });

  it('resets error state when resetOnChange prop changes', () => {
    jest.useFakeTimers();
    const { rerender } = render(
      <ErrorBoundary resetOnChange={[1]}>
        <ErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    
    // Should show error UI
    expect(screen.getByText(fallbackHeadline)).toBeInTheDocument();
    
    // Change the resetOnChange value
    rerender(
      <ErrorBoundary resetOnChange={[2]}>
        <ErrorComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    act(() => {
      jest.runAllTimers();
    });

    // Should now show the child component
    expect(screen.getByText('No error')).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('calls resetErrorBoundary when reset button is clicked', () => {
    jest.useFakeTimers();
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    
    render(
      <ErrorBoundary>
        <ErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    
    fireEvent.click(screen.getByRole('button', { name: /refresh page/i }));
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 100);
    
    setTimeoutSpy.mockRestore();
    jest.useRealTimers();
  });
});
