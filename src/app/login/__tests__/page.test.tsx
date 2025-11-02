import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '../page';

const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: pushMock,
  })),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

const mockSignIn = jest.fn();
const mockSignInWithProvider = jest.fn();
const mockClearError = jest.fn();

jest.mock('@/context/AuthProvider', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    signInWithProvider: mockSignInWithProvider,
    clearError: mockClearError,
    isLoading: false,
  }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    mockSignIn.mockResolvedValue({ data: null, error: null });
    mockSignInWithProvider.mockResolvedValue({ data: null, error: null });
    mockSignIn.mockClear();
    mockSignInWithProvider.mockClear();
    mockClearError.mockClear();
    pushMock.mockClear();
  });

  it('shows validation errors when submitting empty form', async () => {
    render(<LoginPage />);

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('submits credentials when form is valid', async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() =>
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123',
      })
    );
  });

  it('initiates Google OAuth when continue with Google is clicked', async () => {
    render(<LoginPage />);

    fireEvent.click(screen.getByRole('button', { name: /continue with google/i }));

    await waitFor(() => {
      expect(mockSignInWithProvider).toHaveBeenCalledWith('google', '/dashboard');
    });
  });
});
