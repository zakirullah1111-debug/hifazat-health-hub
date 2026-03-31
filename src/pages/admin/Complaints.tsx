import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const complaints = [
  { id: 1, patient: 'Ali Ahmad', subject: 'Late response', status: 'open', date: '2026-03-30' },
  { id: 2, patient: 'Sara Noor', subject: 'Wrong fee charged', status: 'in_progress', date: '2026-03-29' },
  { id: 3, patient: 'Hassan Karim', subject: 'Rude behavior', status: 'resolved', date: '2026-03-28' },
];

const statusBadge = (status: string) => {
  const map: Record<string, 'default' | 'secondary' | 'destructive'> = {
    open: 'destructive',
    in_progress: 'secondary',
    resolved: 'default',
  };
  return <Badge variant={map[status] ?? 'secondary'} className="capitalize text-[10px]">{status.replace('_', ' ')}</Badge>;
};

const AdminComplaints = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold text-foreground">Complaints</h1>
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead>Update</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {complaints.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium text-sm">{c.patient}</TableCell>
                <TableCell className="text-sm">{c.subject}</TableCell>
                <TableCell>{statusBadge(c.status)}</TableCell>
                <TableCell className="hidden sm:table-cell text-sm">{c.date}</TableCell>
                <TableCell>
                  <Select defaultValue={c.status}>
                    <SelectTrigger className="h-7 w-28 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default AdminComplaints;
