import { ReactNode, useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import api from '../utils/axios';

interface UserTypeRouteProps {
  children: ReactNode;
  allowedUserTypes: ('student' | 'admin')[];
}

const UserTypeRoute = ({ children, allowedUserTypes }: UserTypeRouteProps) => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [userType, setUserType] = useState<'student' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createOrFetchUser = async () => {
      if (!user) {
        console.log('No user found in Clerk');
        setLoading(false);
        return;
      }

      console.log('User found in Clerk:', {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName
      });

      try {
        const token = await getToken();
        console.log('Got Clerk token');

        // First try to get the user
        try {
          console.log('Attempting to fetch user from database...');
          const response = await api.get(`/api/users/${user.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('User found in database:', response.data);
          setUserType(response.data.userType);
          setError(null);
        } catch (fetchError: any) {
          console.log('Error fetching user:', fetchError);
          // If user doesn't exist, create them
          if (fetchError.response?.status === 404) {
            console.log('User not found in database, creating new user...');
            const userData = {
              clerkId: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              firstName: user.firstName,
              lastName: user.lastName,
              userType: 'student' // Default to student
            };
            console.log('Creating user with data:', userData);

            const createResponse = await api.post('/api/users', userData, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            console.log('User created successfully:', createResponse.data);
            setUserType(createResponse.data.userType);
            setError(null);
          } else {
            console.error('Unexpected error fetching user:', fetchError);
            setError('Failed to fetch user data');
            // Don't set userType to null, keep it as is to prevent redirect loops
          }
        }
      } catch (error) {
        console.error('Error with user data:', error);
        setError('Authentication error');
        // For now, default to student if there's an error to prevent redirect loops
        setUserType('student');
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && user) {
      console.log('User loaded, starting createOrFetchUser...');
      createOrFetchUser();
    } else if (isLoaded) {
      console.log('No user loaded');
      setLoading(false);
    }
  }, [isLoaded, user, getToken]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Starting the server and Loading your dashboard...please wait a moment...</p>
        </div>
      </div>
    );
  }

  // If there's an error but we're trying to access admin routes, show error
  if (error && allowedUserTypes.includes('admin') && !allowedUserTypes.includes('student')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Access Error</h2>
          <p className="text-slate-600 mb-4">Unable to verify your admin access. Please try refreshing the page or contact support.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // If no user type is determined yet and there's no error, show loading
  if (!userType && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Verifying your access...</p>
        </div>
      </div>
    );
  }

  // Check if user type is allowed
  if (userType && !allowedUserTypes.includes(userType)) {
    console.log(`User type ${userType} not allowed for route requiring ${allowedUserTypes.join(', ')}`);
    // Redirect based on user type
    if (userType === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // If user type is allowed, render children
  if (userType && allowedUserTypes.includes(userType)) {
    console.log(`User type ${userType} is allowed for route requiring ${allowedUserTypes.join(', ')}`);
    return <>{children}</>;
  }

  // If there's an error and we're allowing student access, render children
  if (error && allowedUserTypes.includes('student')) {
    console.log('Error occurred but allowing student access');
    return <>{children}</>;
  }

  // Default fallback - redirect to appropriate dashboard
  console.log('Fallback redirect based on user type:', userType);
  if (userType === 'admin') {
    return <Navigate to="/admin" replace />;
  } else {
    return <Navigate to="/dashboard" replace />;
  }
};

export default UserTypeRoute; 