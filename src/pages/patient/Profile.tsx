import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { LogOut, Mail, MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PatientProfile = () => {
  const { profile, signOut } = useAuth();
  const { toast } = useToast();
  const [complaintSubject, setComplaintSubject] = useState('');
  const [complaintMessage, setComplaintMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) return;
    setSubmitting(true);

    try {
      const { error } = await supabase.from('complaints').insert({
        patient_id: profile.id,
        subject: complaintSubject,
        message: complaintMessage,
        status: 'open',
      });

      if (error) throw error;

      toast({ title: 'Complaint submitted', description: 'We will get back to you soon.' });
      setComplaintSubject('');
      setComplaintMessage('');
    } catch (err: any) {
      toast({ title: 'Failed to submit', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-foreground">Profile</h1>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              {profile?.full_name?.[0] ?? 'P'}
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{profile?.full_name}</h2>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
              <p className="text-sm text-muted-foreground">{profile?.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Notifications</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Dark Theme</Label>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Customer Support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <a href="mailto:zakirullah20331@gmail.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <Mail className="h-4 w-4" /> zakirullah20331@gmail.com
          </a>
          <a href="https://wa.me/933490807893" target="_blank" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <MessageCircle className="h-4 w-4" /> +93 3490807893
          </a>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Submit a Complaint</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleComplaintSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="subject" className="text-xs">Subject</Label>
              <Input id="subject" value={complaintSubject} onChange={(e) => setComplaintSubject(e.target.value)} required placeholder="Brief subject" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="message" className="text-xs">Message</Label>
              <Textarea id="message" value={complaintMessage} onChange={(e) => setComplaintMessage(e.target.value)} required placeholder="Describe your issue..." rows={3} />
            </div>
            <Button type="submit" size="sm" disabled={submitting} className="gap-1">
              <Send className="h-3 w-3" /> Submit
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      <Button variant="outline" className="w-full text-destructive" onClick={signOut}>
        <LogOut className="h-4 w-4 mr-2" /> Sign Out
      </Button>
    </div>
  );
};

export default PatientProfile;
