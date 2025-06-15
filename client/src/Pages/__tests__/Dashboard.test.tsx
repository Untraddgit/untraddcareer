import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

// Mock Clerk with all necessary components
vi.mock('@clerk/clerk-react', () => ({
  useAuth: () => ({
    getToken: () => Promise.resolve('mock-token'),
    isLoaded: true,
    signOut: vi.fn(),
  }),
  useUser: () => ({
    isLoaded: true,
    user: {
      id: 'test-user-id',
      firstName: 'Test',
      lastName: 'User',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
    }
  }),
  UserButton: () => <div data-testid="user-button">User Button</div>,
  ClerkProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SignedIn: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SignedOut: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SignInButton: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
  RedirectToSignIn: () => <div>Redirect to Sign In</div>,
  SignIn: () => <div>Sign In</div>,
}));

// Mock axios with response data
vi.mock('../utils/axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: {} }),
    post: vi.fn().mockResolvedValue({ data: {} }),
    put: vi.fn().mockResolvedValue({ data: {} }),
    delete: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the student dashboard successfully', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Check that the dashboard renders without crashing
    await waitFor(() => {
      expect(screen.getByText(/Overview/i)).toBeInTheDocument();
    });
  });

  it('has navigation tabs', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Overview/i)).toBeInTheDocument();
      expect(screen.getByText(/Course/i)).toBeInTheDocument();
      expect(screen.getByText(/My Counseling Feedback/i)).toBeInTheDocument();
    });
  });

  it('can switch to counseling feedback tab', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      const counselingTab = screen.getByText(/My Counseling Feedback/i);
      fireEvent.click(counselingTab);
    });

    await waitFor(() => {
      expect(screen.getByText(/Your counseling feedback will appear here/i)).toBeInTheDocument();
    });
  });

  it('displays user button in navbar', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-button')).toBeInTheDocument();
    });
  });
}); 