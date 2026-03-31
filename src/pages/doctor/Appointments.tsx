import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

const DoctorAppointmentCard = ({ status, showActions }: { status: string; showActions?: boolean }) => (
  <Card>
    <CardContent className="p-4 space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-sm text-foreground">Patient Name</h3>
          <p className="text-xs text-muted-foreground">📅 Today • 🕐 10:00 AM</p>
        </div>
        <Badge variant="secondary" className="text-[10px] capitalize">{status.replace('_', ' ')}</Badge>
      </div>
      {showActions && (
        <div className="flex gap-2 pt-1">
          <Button size="sm" variant="default" className="h-7 text-xs gap-1">
            <Check className="h-3 w-3" /> Confirm
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-destructive">
            <X className="h-3 w-3" /> Decline
          </Button>
        </div>
      )}
    </CardContent>
  </Card>
);

const DoctorAppointments = () => {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-foreground">Appointments</h1>

      <Tabs defaultValue="pending">
        <TabsList className="w-full">
          <TabsTrigger value="pending" className="flex-1">Pending</TabsTrigger>
          <TabsTrigger value="confirmed" className="flex-1">Confirmed</TabsTrigger>
          <TabsTrigger value="queue" className="flex-1">Queue</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="space-y-3 mt-3">
          <DoctorAppointmentCard status="pending_confirmation" showActions />
          <DoctorAppointmentCard status="pending_confirmation" showActions />
        </TabsContent>
        <TabsContent value="confirmed" className="space-y-3 mt-3">
          <DoctorAppointmentCard status="confirmed" />
        </TabsContent>
        <TabsContent value="queue" className="space-y-3 mt-3">
          <DoctorAppointmentCard status="in_queue" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorAppointments;
