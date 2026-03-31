import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type VerificationStatus = Database['public']['Enums']['verification_status'];

const DoctorGuard = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      supabase
        .from('doctor_profiles')
        .select('verification_status')
        .eq('profile_id', profile.id)
        .single()
        .then(({ data }) => {
          setVerificationStatus(data?.verification_status ?? null);
          setLoading(false);
        });
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (verificationStatus !== 'approved') {
    return <DoctorPendingScreen status={verificationStatus} />;
  }

  return <>{children}</>;
};

const DoctorPendingScreen = ({ status }: { status: VerificationStatus | null }) => {
  const { signOut } = useAuth();
  
  const statusMessages: Record<string, { title: string; message: string; color: string }> = {
    pending: {
      title: 'Verification Pending',
      message: 'Your profile is under review. You will be notified once approved by the admin.',
      color: 'text-warning',
    },
    rejected: {
      title: 'Verification Rejected',
      message: 'Unfortunately, your verification was not approved. Please contact support.',
      color: 'text-destructive',
    },
    frozen: {
      title: 'Account Frozen',
      message: 'Your account has been temporarily frozen. Please contact support.',
      color: 'text-destructive',
    },
  };

  const info = statusMessages[status ?? 'pending'] ?? statusMessages.pending;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
          <svg className={`w-10 h-10 ${info.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className={`text-2xl font-bold ${info.color}`}>{info.title}</h1>
        <p className="text-muted-foreground">{info.message}</p>
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
