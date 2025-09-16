import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminProtectedRouteProps {
  children: ReactNode;
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/admin-login');
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}