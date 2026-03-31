import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const doctors = [
  { name: 'Dr. Ahmad Khan', specialization: 'Cardiologist', city: 'Kabul', status: 'approved' },
  { name: 'Dr. Fatima Noor', specialization: 'Pediatrician', city: 'Herat', status: 'pending' },
  { name: 'Dr. Rashid Ali', specialization: 'Dermatologist', city: 'Mazar', status: 'frozen' },
];

const statusBadge = (status: string) => {
  const map: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    approved: 'default',
    pending: 'secondary',
    rejected: 'destructive',
    frozen: 'outline',
  };
  return <Badge variant={map[status] ?? 'secondary'} className="capitalize text-[10px]">{status}</Badge>;
};

const AdminDoctors = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold text-foreground">Doctors Management</h1>
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Specialization</TableHead>
              <TableHead className="hidden sm:table-cell">City</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.map((d, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium text-sm">{d.name}</TableCell>
                <TableCell className="hidden sm:table-cell text-sm">{d.specialization}</TableCell>
                <TableCell className="hidden sm:table-cell text-sm">{d.city}</TableCell>
                <TableCell>{statusBadge(d.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="h-7 text-xs">Approve</Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs text-destructive">Freeze</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default AdminDoctors;
