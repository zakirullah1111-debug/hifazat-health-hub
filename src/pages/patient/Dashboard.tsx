import { useAuth } from '@/contexts/AuthContext';
import { Search, Filter, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const filters = ['All', 'Cardiologist', 'Dermatologist', 'Pediatrician', 'General'];

const PatientDashboard = () => {
  const { profile } = useAuth();

  return (
    <div className="p-4 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">
          Welcome, {profile?.full_name || 'Patient'} 👋
        </h1>
        <p className="text-sm text-muted-foreground">Find and book your doctor</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search doctors by name, specialization..." className="pl-10" />
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {filters.map((f, i) => (
          <Badge
            key={f}
            variant={i === 0 ? 'default' : 'secondary'}
            className="cursor-pointer whitespace-nowrap shrink-0"
          >
            {f}
          </Badge>
        ))}
        <Badge variant="outline" className="cursor-pointer whitespace-nowrap shrink-0">
          <Filter className="h-3 w-3 mr-1" /> More
        </Badge>
      </div>

      {/* Doctor list placeholder */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Available Doctors</h2>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4 flex gap-3">
              <div className="w-12 h-12 rounded-full bg-muted shrink-0" />
              <div className="flex-1 min-w-0 space-y-1">
                <h3 className="font-semibold text-foreground text-sm truncate">Dr. Sample Doctor</h3>
                <p className="text-xs text-muted-foreground">Cardiologist • 5 yrs exp</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px]">Available</Badge>
                  <span className="text-xs text-muted-foreground">Fee: 500 AFN</span>
                </div>
              </div>
              <Button size="sm" variant="outline" className="self-center shrink-0">
                Book
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Emergency FAB */}
      <button className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-emergency text-emergency-foreground shadow-lg flex items-center justify-center z-40 active:scale-95 transition-transform">
        <Phone className="h-6 w-6" />
      </button>
    </div>
  );
};

export default PatientDashboard;
