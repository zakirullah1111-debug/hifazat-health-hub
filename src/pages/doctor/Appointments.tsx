import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, ArrowRight, Phone, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  id: string;
  status: string;
  appointment_date: string;
  fee_paid: number | null;
  notes: string | null;
  patient_id: string;
  patient_name: string;
  patient_phone: string;
}

const DoctorAppointments = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [calledIds, setCalledIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!profile?.id) return;
    fetchAppointments();
  }, [profile?.id]);

  const fetchAppointments = async () => {
    if (!profile?.id) return;
    const today = new Date().toISOString().split('T')[0];

    const { data } = await supabase
      .from('appointments')
      .select('id, status, appointment_date, fee_paid, notes, patient_id')
      .eq('doctor_id', profile.id)
      .eq('appointment_date', today)
      .order('created_at', { ascending: true });

    if (!data || data.length === 0) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    // Get patient names from profiles
    const patientIds = [...new Set(data.map(a => a.patient_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, phone')
      .in('id', patientIds);

    const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

    const mapped: Appointment[] = data.map(a => {
      const prof = profileMap.get(a.patient_id);
      return {
        ...a,
        patient_name: prof?.full_name || 'Unknown',
        patient_phone: prof?.phone || '',
      };
    });

    setAppointments(mapped);
    setLoading(false);
  };

  const updateAppointment = async (id: string, status: string, extra?: Record<string, any>) => {
    setActionLoading(id);
    await supabase.from('appointments').update({ status, ...extra }).eq('id', id);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status, ...extra } : a));
    setActionLoading(null);
  };

  const confirmAppointment = async (apt: Appointment) => {
    await updateAppointment(apt.id, 'confirmed');
    await supabase.from('notifications').insert({
      recipient_id: apt.patient_id,
      type: 'appointment_confirmed',
      title: 'Appointment Confirmed',
      body: `Dr. ${profile?.full_name} has confirmed your appointment.`,
    });
    toast({ title: 'Appointment confirmed' });
  };

  const declineAppointment = async (apt: Appointment) => {
    await updateAppointment(apt.id, 'cancelled');
    toast({ title: 'Appointment declined' });
  };

  const moveToQueue = async (apt: Appointment) => {
    await updateAppointment(apt.id, 'in_queue');
    toast({ title: 'Moved to queue' });
  };

  const callPatient = async (apt: Appointment) => {
    await supabase.from('notifications').insert({
      recipient_id: apt.patient_id,
      type: 'queue_call',
      title: 'Your Turn!',
      body: `Dr. ${profile?.full_name} is ready to see you. Please proceed to the consultation.`,
    });
    setCalledIds(prev => new Set(prev).add(apt.id));
    toast({ title: 'Patient notified' });
  };

  const completeAppointment = async (apt: Appointment) => {
    await updateAppointment(apt.id, 'completed');
    toast({ title: 'Consultation completed' });
  };

  const pending = appointments.filter(a => a.status === 'pending');
  const confirmed = appointments.filter(a => a.status === 'confirmed');
  const queue = appointments.filter(a => a.status === 'in_queue');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-foreground">Appointments</h1>

      <Tabs defaultValue="pending">
        <TabsList className="w-full">
          <TabsTrigger value="pending" className="flex-1">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="confirmed" className="flex-1">Confirmed ({confirmed.length})</TabsTrigger>
          <TabsTrigger value="queue" className="flex-1">Queue ({queue.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-3 mt-3">
          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No pending appointments</p>
          ) : pending.map(apt => (
            <AppointmentCard key={apt.id} apt={apt} actionLoading={actionLoading}>
              <Button size="sm" variant="default" className="h-7 text-xs gap-1" disabled={actionLoading === apt.id} onClick={() => confirmAppointment(apt)}>
                <Check className="h-3 w-3" /> Confirm
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-destructive" disabled={actionLoading === apt.id} onClick={() => declineAppointment(apt)}>
                <X className="h-3 w-3" /> Decline
              </Button>
            </AppointmentCard>
          ))}
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-3 mt-3">
          {confirmed.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No confirmed appointments</p>
          ) : confirmed.map(apt => (
            <AppointmentCard key={apt.id} apt={apt} actionLoading={actionLoading}>
              <Button size="sm" variant="default" className="h-7 text-xs gap-1" disabled={actionLoading === apt.id} onClick={() => moveToQueue(apt)}>
                <ArrowRight className="h-3 w-3" /> Move to Queue
              </Button>
            </AppointmentCard>
          ))}
        </TabsContent>

        <TabsContent value="queue" className="space-y-3 mt-3">
          {queue.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No patients in queue</p>
          ) : queue.map((apt, idx) => (
            <AppointmentCard key={apt.id} apt={apt} actionLoading={actionLoading} queuePosition={idx + 1}>
              {calledIds.has(apt.id) ? (
                <>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {apt.patient_phone}
                  </p>
                  <Button size="sm" variant="default" className="h-7 text-xs gap-1" disabled={actionLoading === apt.id} onClick={() => completeAppointment(apt)}>
                    <CheckCircle className="h-3 w-3" /> Complete
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" variant="default" className="h-7 text-xs gap-1" disabled={actionLoading === apt.id} onClick={() => callPatient(apt)}>
                    <Phone className="h-3 w-3" /> Call
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1" disabled={actionLoading === apt.id} onClick={() => completeAppointment(apt)}>
                    <CheckCircle className="h-3 w-3" /> Complete
                  </Button>
                </>
              )}
            </AppointmentCard>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const AppointmentCard = ({
  apt,
  actionLoading,
  queuePosition,
  children,
}: {
  apt: Appointment;
  actionLoading: string | null;
  queuePosition?: number;
  children: React.ReactNode;
}) => (
  <Card>
    <CardContent className="p-4 space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-sm text-foreground">
            {queuePosition ? `#${queuePosition} ` : ''}{apt.patient_name}
          </h3>
          <p className="text-xs text-muted-foreground">
            📅 {apt.appointment_date}
            {apt.fee_paid ? ` • ${apt.fee_paid} AFN` : ''}
          </p>
        </div>
        <Badge variant="secondary" className="text-[10px] capitalize">{apt.status.replace(/_/g, ' ')}</Badge>
      </div>
      <div className="flex gap-2 pt-1 flex-wrap items-center">
        {actionLoading === apt.id && <Loader2 className="h-3 w-3 animate-spin" />}
        {children}
      </div>
    </CardContent>
  </Card>
);

export default DoctorAppointments;
