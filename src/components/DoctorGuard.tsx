import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type VerificationStatus = Database['public']['Enums']['verification_status'];

const DoctorGuard = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.id) return;

    supabase
      .from('doctor_profiles')
      .select('verification_status')
      .eq('profile_id', profile.id)
      .maybeSingle()
      .then(({ data }) => {
        setVerificationStatus(data?.verification_status ?? null);
        setLoading(false);
      });
  }, [profile?.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (verificationStatus === 'frozen') {
    return (
      <DoctorStatusScreen
        title="Account Frozen"
        message="Your account has been frozen by admin. Please contact support."
        color="text-destructive"
      />
    );
  }

  if (verificationStatus === 'rejected') {
    return (
      <DoctorStatusScreen
        title="Verification Rejected"
        message="Your verification was not approved. Please contact support."
        color="text-destructive"
      />
    );
  }

  if (verificationStatus !== 'approved') {
    return (
      <DoctorStatusScreen
        title="Verification Pending"
        message="Your profile is under review. You will be notified once approved by the admin."
        color="text-warning"
      />
    );
  }

  return <>{children}</>;
};

const DoctorStatusScreen = ({ title, message, color }: { title: string; message: string; color: string }) => {
  const { signOut } = useAuth();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="max-w-sm w-full text-center space-y-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
          <Clock className={`w-10 h-10 ${color}`} />
        </div>
        <h1 className={`text-xl font-bold ${color}`}>{title}</h1>
        <p className="text-muted-foreground text-sm">{message}</p>
        <button
          onClick={signOut}
          className="text-sm text-muted-foreground underline hover:text-foreground"
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export default DoctorGuard;
