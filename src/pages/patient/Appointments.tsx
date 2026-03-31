import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

const AppointmentCard = ({ status }: { status: string }) => (
  <Card>
    <CardContent className="p-4 space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-sm text-foreground">Dr. Sample Doctor</h3>
          <p className="text-xs text-muted-foreground">Cardiologist</p>
        </div>
        <Badge variant={status === 'confirmed' ? 'default' : 'secondary'} className="text-[10px]">
          {status}
        </Badge>
      </div>
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span>📅 Today</span>
        <span>🕐 10:00 AM</span>
        <span>💰 500 AFN</span>
      </div>
    </CardContent>
  </Card>
);

const PatientAppointments = () => {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-foreground">Appointments</h1>

      <Tabs defaultValue="today">
        <TabsList className="w-full">
          <TabsTrigger value="today" className="flex-1">Today</TabsTrigger>
          <TabsTrigger value="previous" className="flex-1">Previous</TabsTrigger>
          <TabsTrigger value="cancelled" className="flex-1">Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value="today" className="space-y-3 mt-3">
          <AppointmentCard status="confirmed" />
          <AppointmentCard status="pending_confirmation" />
        </TabsContent>
        <TabsContent value="previous" className="space-y-3 mt-3">
          <AppointmentCard status="completed" />
        </TabsContent>
        <TabsContent value="cancelled" className="space-y-3 mt-3">
          <AppointmentCard status="cancelled" />
        </TabsContent>
      </Tabs>

      <button className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center z-40 active:scale-95 transition-transform">
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
};

export default PatientAppointments;
