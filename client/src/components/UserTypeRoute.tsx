import { ReactNode, useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

interface UserTypeRouteProps {
  children: ReactNode;
  allowedUserTypes: ('student' | 'admin')[];
}

const UserTypeRoute = ({ children, allowedUserTypes }: UserTypeRouteProps) => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [userType, setUserType] = useState<'student' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const createOrFetchUser = async () => {
      if (!user) {
        console.log('No user found in Clerk');
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
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${user.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('User found in database:', response.data);
          setUserType(response.data.userType);
        } catch (error) {
          console.log('Error fetching user:', error);
          // If user doesn't exist, create them
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            console.log('User not found in database, creating new user...');
            const userData = {
              clerkId: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              firstName: user.firstName,
              lastName: user.lastName,
              userType: 'student' // Default to student
            };
            console.log('Creating user with data:', userData);

            const createResponse = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/users`,
              userData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log('User created successfully:', createResponse.data);
            setUserType(createResponse.data.userType);
          } else {
            console.error('Unexpected error:', error);
            throw error;
          }
        }
      } catch (error) {
        console.error('Error with user data:', error);
        // For now, default to student if there's an error
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If no user type is set yet, allow access to student routes
  if (!userType && allowedUserTypes.includes('student')) {
    return <>{children}</>;
  }

  if (!userType || !allowedUserTypes.includes(userType)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default UserTypeRoute; 