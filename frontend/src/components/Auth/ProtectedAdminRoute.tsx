import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../Redux/store';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Don't redirect while still loading
    if (loading) return;

    if (!isAuthenticated) {
      // Not authenticated, redirect to admin login
      navigate('/admin/login');
      return;
    }

    if (user?.role !== 'admin') {
      // Not an admin user, redirect to home page
      navigate('/');
      return;
    }
  }, [isAuthenticated, user, loading, navigate]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // If user is authenticated and role is admin, render the admin content
  if (isAuthenticated && user?.role === 'admin') {
    return <>{children}</>;
  }

  // Return null while redirecting
  return null;
};

export default ProtectedAdminRoute;
