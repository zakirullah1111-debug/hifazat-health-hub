import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';

const notifications = [
  { title: 'New Appointment Request', message: 'A patient has requested an appointment for tomorrow.', time: '2 min ago', read: false },
  { title: 'Profile Approved', message: 'Your profile has been approved by admin.', time: '1 hour ago', read: false },
  { title: 'System Update', message: 'Hifazat has been updated with new features.', time: '1 day ago', read: true },
];

const DoctorNotifications = () => {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-foreground">Notifications</h1>

      <div className="space-y-2">
        {notifications.map((n, i) => (
          <Card key={i} className={!n.read ? 'border-primary/30 bg-primary/5' : ''}>
            <CardContent className="p-4 flex gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${!n.read ? 'bg-primary/10' : 'bg-muted'}`}>
                <Bell className={`h-4 w-4 ${!n.read ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground truncate">{n.title}</h3>
                  {!n.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                </div>
                <p className="text-xs text-muted-foreground">{n.message}</p>
                <p className="text-[10px] text-muted-foreground">{n.time}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DoctorNotifications;
