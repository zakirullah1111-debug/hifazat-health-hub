import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Send } from 'lucide-react';
import { useState } from 'react';

const AdminNotifications = () => {
  const [target, setTarget] = useState('both');

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Send Notification</h1>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Send To</Label>
            <RadioGroup value={target} onValueChange={setTarget} className="flex gap-4">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="doctor" id="doctor" />
                <Label htmlFor="doctor" className="text-sm">Doctors</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="patient" id="patient" />
                <Label htmlFor="patient" className="text-sm">Patients</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="both" id="both" />
                <Label htmlFor="both" className="text-sm">Both</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm">Title</Label>
            <Input id="title" placeholder="Notification title" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm">Message</Label>
            <Textarea id="message" placeholder="Write your message..." rows={4} />
          </div>

          <Button className="gap-1">
            <Send className="h-4 w-4" /> Send Notification
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNotifications;
