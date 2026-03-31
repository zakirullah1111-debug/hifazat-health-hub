import { Card, CardContent } from '@/components/ui/card';
import { Users, Stethoscope, Calendar, DollarSign, ShieldCheck, TrendingUp } from 'lucide-react';

const kpis = [
  { label: 'All Patients', value: '245', icon: Users, color: 'text-info' },
  { label: 'All Doctors', value: '38', icon: Stethoscope, color: 'text-primary' },
  { label: "Today's Appointments", value: '12', icon: Calendar, color: 'text-success' },
  { label: "Today's Revenue", value: '6,000 AFN', icon: DollarSign, color: 'text-warning' },
  { label: 'Total Appointments', value: '1,842', icon: TrendingUp, color: 'text-info' },
  { label: 'Total Revenue', value: '920K AFN', icon: DollarSign, color: 'text-success' },
  { label: 'Pending Verifications', value: '4', icon: ShieldCheck, color: 'text-warning' },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4 space-y-2">
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              <p className="text-xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart placeholders */}
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
