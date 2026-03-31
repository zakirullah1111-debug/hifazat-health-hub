import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

const pendingDoctors = [
  { name: 'Dr. Fatima Noor', specialization: 'Pediatrician', qualification: 'MBBS', license: 'AF-12345', city: 'Herat' },
  { name: 'Dr. Kamal Shah', specialization: 'Orthopedic', qualification: 'MBBS, MS', license: 'AF-67890', city: 'Kandahar' },
];

const AdminApprovals = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold text-foreground">Pending Approvals</h1>

    {pendingDoctors.length === 0 ? (
      <p className="text-muted-foreground text-sm py-8 text-center">No pending verifications</p>
    ) : (
      <div className="space-y-3">
        {pendingDoctors.map((d, i) => (
          <Card key={i}>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-foreground">{d.name}</h3>
                  <p className="text-sm text-muted-foreground">{d.specialization} • {d.qualification}</p>
                  <p className="text-xs text-muted-foreground">License: {d.license} • {d.city}</p>
                </div>
                <Badge variant="secondary" className="text-[10px]">Pending</Badge>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="gap-1"><Check className="h-3 w-3" /> Approve</Button>
                <Button size="sm" variant="outline" className="gap-1 text-destructive"><X className="h-3 w-3" /> Reject</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )}
  </div>
);

export default AdminApprovals;
