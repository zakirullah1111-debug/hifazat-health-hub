import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Users, Clock, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const statusOptions = ['available', 'busy', 'away', 'offline'] as const;
const statusColors: Record<string, string> = {
  available: 'bg-success text-success-foreground',
  busy: 'bg-warning text-warning-foreground',
  away: 'bg-muted text-muted-foreground',
  offline: 'bg-destructive text-destructive-foreground',
};

const DoctorDashboard = () => {
  const { profile } = useAuth();
  const [availability, setAvailability] = useState<string>('offline');
  const [statusLoading, setStatusLoading] = useState(false);
  const [doctorProfileId, setDoctorProfileId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    todayTotal: 0,
    todayConfirmed: 0,
    inQueue: 0,
    allTime: 0,
  });

  useEffect(() => {
    if (!profile?.id) return;

    const init = async () => {
      // Get doctor_profile record
      const { data: dp } = await supabase
        .from('doctor_profiles')
        .select('id, availability_status')
        .eq('profile_id', profile.id)
        .maybeSingle();

      if (dp) {
        setDoctorProfileId(dp.id);
        setAvailability(dp.availability_status);
        await fetchStats(dp.id);
      }
    };
    init();
  }, [profile?.id]);

  const fetchStats = async (dpId: string) => {
    const today = new Date().toISOString().split('T')[0];

    const [todayAll, confirmed, queue, allTime] = await Promise.all([
      supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('doctor_profile_id', dpId).eq('appointment_date', today).neq('status', 'cancelled'),
      supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('doctor_profile_id', dpId).eq('appointment_date', today).eq('status', 'confirmed'),
      supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('doctor_profile_id', dpId).eq('status', 'in_queue'),
      supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('doctor_profile_id', dpId).neq('status', 'cancelled'),
    ]);

    setStats({
      todayTotal: todayAll.count || 0,
      todayConfirmed: confirmed.count || 0,
      inQueue: queue.count || 0,
      allTime: allTime.count || 0,
    });
  };

  const updateStatus = async (newStatus: string) => {
    if (!doctorProfileId) return;
    setStatusLoading(true);
    await supabase
      .from('doctor_profiles')
      .update({ availability_status: newStatus as any })
      .eq('id', doctorProfileId);
    setAvailability(newStatus);
    setStatusLoading(false);
  };

  return (
    <div className="p-4 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">
          Welcome to Hifazat, Dr. {profile?.full_name?.replace(/^Dr\.?\s*/i, '') || 'Doctor'} 👋
        </h1>
        <p className="text-sm text-muted-foreground">Manage your appointments and patients</p>
      </div>

      {/* Status Toggle */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-sm font-medium">Your Status</p>
              <p className="text-xs text-muted-foreground">Patients see this in real-time</p>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {statusOptions.map((s) => (
                <button
                  key={s}
                  disabled={statusLoading}
                  onClick={() => updateStatus(s)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-medium capitalize transition-all ${
                    availability === s ? statusColors[s] : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={Calendar} label="Today's Appointments" value={stats.todayTotal.toString()} color="text-primary" />
        <StatCard icon={CheckCircle} label="Confirmed Today" value={stats.todayConfirmed.toString()} color="text-success" />
        <StatCard icon={Users} label="In Queue" value={stats.inQueue.toString()} color="text-warning" />
        <StatCard icon={Clock} label="All Appointments" value={stats.allTime.toString()} color="text-info" />
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) => (
  <Card>
    <CardContent className="p-4 space-y-2">
      <Icon className={`h-5 w-5 ${color}`} />
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </CardContent>
  </Card>
);

export default DoctorDashboard;
