import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const patients = [
  { name: 'Ali Ahmad', email: 'ali@example.com', phone: '+93 700 123456', district: 'Kabul' },
  { name: 'Sara Noor', email: 'sara@example.com', phone: '+93 700 654321', district: 'Herat' },
  { name: 'Hassan Karim', email: 'hassan@example.com', phone: '+93 700 111222', district: 'Balkh' },
];

const AdminPatients = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold text-foreground">Patients Management</h1>
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="hidden sm:table-cell">District</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((p, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium text-sm">{p.name}</TableCell>
                <TableCell className="hidden sm:table-cell text-sm">{p.email}</TableCell>
                <TableCell className="text-sm">{p.phone}</TableCell>
                <TableCell className="hidden sm:table-cell text-sm">{p.district}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default AdminPatients;
