import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';
import { Loader2 } from 'lucide-react';

type AppRole = Database['public']['Enums']['app_role'];

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: AppRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setTimedOut(true), 5000);
    return () => clearTimeout(timeout);
  }, []);

  if (loading && !timedOut) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    if (timedOut) return <Navigate to="/login" replace />;
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!allowedRoles.includes(profile.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
