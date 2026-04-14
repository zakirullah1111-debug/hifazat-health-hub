import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PendingDoctor {
  id: string;
  specialization: string | null;
  city: string | null;
  district: string | null;
  experience_years: number | null;
  fee: number | null;
  full_name: string;
  email: string;
  phone: string;
}

const AdminApprovals = () => {
  const [pendingDoctors, setPendingDoctors] = useState<PendingDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPending = async () => {
    try {
      const { data } = await supabase
        .from('doctors')
        .select('id, specialization, city, district, experience_years, fee')
        .eq('is_approved', false)
        .eq('is_frozen', false);

      if (!data || data.length === 0) {
        setPendingDoctors([]);
        setLoading(false);
        return;
      }

      // Get profile info for each doctor
      const ids = data.map(d => d.id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone')
        .in('id', ids);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      const mapped: PendingDoctor[] = data.map(d => {
        const prof = profileMap.get(d.id);
        return {
          ...d,
          full_name: prof?.full_name ?? 'Unknown',
          email: prof?.email ?? '',
          phone: prof?.phone ?? '',
        };
      });

      setPendingDoctors(mapped);
    } catch (err) {
      console.error('Fetch pending error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const approveDoctor = async (doctorId: string) => {
    setActionLoading(doctorId);
    await supabase
      .from('doctors')
      .update({ is_approved: true })
      .eq('id', doctorId);

    await supabase.from('notifications').insert({
      recipient_id: doctorId,
      type: 'approval_update',
      title: 'Profile Approved!',
      body: 'Your profile has been approved. You can now access your dashboard.',
    });

    setPendingDoctors((prev) => prev.filter((d) => d.id !== doctorId));
    setActionLoading(null);
    toast({ title: 'Doctor approved successfully' });
  };

  const rejectDoctor = async (doctorId: string) => {
    setActionLoading(doctorId);
    await supabase
      .from('doctors')
      .update({ is_frozen: true })
      .eq('id', doctorId);

    await supabase.from('notifications').insert({
      recipient_id: doctorId,
      type: 'approval_update',
      title: 'Profile Not Approved',
      body: 'Your profile was not approved. Please contact support for more information.',
    });

    setPendingDoctors((prev) => prev.filter((d) => d.id !== doctorId));
    setActionLoading(null);
    toast({ title: 'Doctor rejected' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Pending Approvals</h1>

      {pendingDoctors.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">No pending verifications</p>
      ) : (
        <div className="space-y-3">
          {pendingDoctors.map((d) => (
            <Card key={d.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-foreground">{d.full_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {d.specialization ?? 'N/A'} • {d.experience_years ?? 0} yrs experience
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {d.city ?? ''}{d.district ? `, ${d.district}` : ''} • Fee: {d.fee ?? 0} AFN
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">Pending</Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="gap-1"
                    disabled={actionLoading === d.id}
                    onClick={() => approveDoctor(d.id)}
                  >
                    {actionLoading === d.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />} Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 text-destructive"
                    disabled={actionLoading === d.id}
                    onClick={() => rejectDoctor(d.id)}
                  >
                    <X className="h-3 w-3" /> Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminApprovals;
