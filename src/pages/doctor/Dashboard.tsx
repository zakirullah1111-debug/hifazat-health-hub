import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar, Users, Clock, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const statusOptions = ['available', 'busy', 'away', 'offline'] as const;
const statusColors: Record<string, string> = {
  available: 'bg-success text-success-foreground',
  busy: 'bg-warning text-warning-foreground',
  away: 'bg-muted text-muted-foreground',
  offline: 'bg-destructive text-destructive-foreground',
};

const DoctorDashboard = () => {
  const { profile } = useAuth();
  const [availability, setAvailability] = useState<string>('available');

  return (
    <div className="p-4 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">
          Welcome to Hifazat, Dr. {profile?.full_name?.replace(/^Dr\.?\s*/i, '') || 'Doctor'} 👋
        </h1>
        <p className="text-sm text-muted-foreground">Manage your appointments and patients</p>
      </div>

      {/* Availability Toggle */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Availability Status</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Current: {availability}</p>
            </div>
            <div className="flex gap-1.5">
              {statusOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => setAvailability(s)}
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
        <StatCard icon={Calendar} label="Today's Appointments" value="5" color="text-primary" />
        <StatCard icon={CheckCircle} label="Confirmed Today" value="3" color="text-success" />
        <StatCard icon={Users} label="In Queue" value="2" color="text-warning" />
        <StatCard icon={Clock} label="All Appointments" value="128" color="text-info" />
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
