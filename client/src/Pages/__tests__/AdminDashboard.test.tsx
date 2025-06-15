import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from '../AdminDashboard';

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
      id: 'test-admin-id',
      firstName: 'Admin',
      lastName: 'User',
      emailAddresses: [{ emailAddress: 'admin@example.com' }],
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

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the admin dashboard successfully', async () => {
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    // Check that the dashboard renders without crashing
    await waitFor(() => {
      expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
    });
  });

  it('has navigation tabs', async () => {
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Overview/i)).toBeInTheDocument();
      expect(screen.getByText(/Students/i)).toBeInTheDocument();
      expect(screen.getByText(/Tests/i)).toBeInTheDocument();
      expect(screen.getByText(/Counselling/i)).toBeInTheDocument();
    });
  });

  it('can switch to counselling tab', async () => {
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    const counsellingTab = screen.getByText(/Counselling/i);
    fireEvent.click(counsellingTab);

    await waitFor(() => {
      expect(screen.getByText(/Premium Students/i)).toBeInTheDocument();
    });
  });

  it('has search functionality', async () => {
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/Search students/i);
      expect(searchInput).toBeInTheDocument();
      
      fireEvent.change(searchInput, { target: { value: 'test student' } });
      expect(screen.getByDisplayValue('test student')).toBeInTheDocument();
    });
  });

  it('displays user button in navbar', async () => {
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-button')).toBeInTheDocument();
    });
  });
}); 