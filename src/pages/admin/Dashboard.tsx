import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Stethoscope, Calendar, ShieldCheck, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const [kpiData, setKpiData] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    todayAppointments: 0,
    totalAppointments: 0,
    pendingVerifications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 3000);

    const fetchKPIs = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];

        const [patients, doctors, todayAppts, allAppts, pending] = await Promise.all([
          supabase.from('patient_profiles').select('id', { count: 'exact', head: true }),
          supabase.from('doctor_profiles').select('id', { count: 'exact', head: true }).eq('verification_status', 'approved'),
          supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('appointment_date', today),
          supabase.from('appointments').select('id', { count: 'exact', head: true }),
          supabase.from('doctor_profiles').select('id', { count: 'exact', head: true }).eq('verification_status', 'pending'),
        ]);

        setKpiData({
          totalPatients: patients.count || 0,
          totalDoctors: doctors.count || 0,
          todayAppointments: todayAppts.count || 0,
          totalAppointments: allAppts.count || 0,
          pendingVerifications: pending.count || 0,
        });
      } catch (err) {
        console.error('KPI fetch error:', err);
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    };

    fetchKPIs();
    return () => clearTimeout(timeout);
  }, []);

  const kpis = [
    { label: 'All Patients', value: kpiData.totalPatients, icon: Users, color: 'text-info' },
    { label: 'All Doctors', value: kpiData.totalDoctors, icon: Stethoscope, color: 'text-primary' },
    { label: "Today's Appointments", value: kpiData.todayAppointments, icon: Calendar, color: 'text-success' },
    { label: 'Total Appointments', value: kpiData.totalAppointments, icon: TrendingUp, color: 'text-info' },
    { label: 'Pending Verifications', value: kpiData.pendingVerifications, icon: ShieldCheck, color: 'text-warning' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4 space-y-2">
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              <p className="text-xl font-bold text-foreground">{loading ? '…' : kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Appointment Trends (7 days)</h3>
            <div className="h-40 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm">
              📊 Chart placeholder
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Doctor Availability</h3>
            <div className="h-40 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm">
              🥧 Pie chart placeholder
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
