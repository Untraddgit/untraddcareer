import { UserButton, useUser } from '@clerk/clerk-react';
import { Home, Menu, X, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '@clerk/clerk-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userType, setUserType] = useState<'student' | 'admin' | null>(null);
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchUserType = async () => {
      if (!user) return;
      
      try {
        const token = await getToken();
        const response = await api.get(`/api/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserType(response.data.userType);
      } catch (error) {
        console.error('Error fetching user type:', error);
        setUserType('student'); // Default to student
      }
    };

    fetchUserType();
  }, [user, getToken]);

  const studentNavItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
  ];

  const adminNavItems = [
    { icon: BarChart3, label: 'Admin Dashboard', href: '/admin' },
    ];

  const navItems = userType === 'admin' ? adminNavItems : studentNavItems;

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <img 
                  src="/logo.png" 
                  alt="UntraddCareer Logo" 
                  className="h-10 w-10 object-contain"
                />
                <span className="ml-2 text-xl font-bold text-gray-900">UntraddCareer</span>
                {userType === 'admin' && (
                  <span className="ml-2 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-600 rounded-full">
                    Admin
                  </span>
                )}
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <UserButton afterSignOutUrl="/" />
            
            {/* Mobile menu button */}
            <div className="sm:hidden ml-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="flex items-center px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 