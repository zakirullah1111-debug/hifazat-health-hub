import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { LogOut } from 'lucide-react';

const DoctorProfile = () => {
  const { profile, signOut } = useAuth();

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-foreground">Doctor Profile</h1>

      {/* Avatar & name */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
              {profile?.full_name?.[0] ?? 'D'}
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{profile?.full_name}</h2>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editable info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Professional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Specialization</Label>
              <Input placeholder="Cardiology" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Qualification</Label>
              <Input placeholder="MBBS, MD" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Consultation Fee</Label>
              <Input type="number" placeholder="500" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Experience (years)</Label>
              <Input type="number" placeholder="5" />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Bio</Label>
            <Textarea placeholder="Tell patients about yourself..." rows={3} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Clinic Name</Label>
            <Input placeholder="Your clinic name" />
          </div>
          <Button size="sm">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Visibility toggles */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Visibility Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            'Show phone to patients',
            'Show email to patients',
            'Show fee to patients',
            'Show experience to patients',
            'Show qualification to patients',
          ].map((label) => (
            <div key={label} className="flex items-center justify-between">
              <Label className="text-sm">{label}</Label>
              <Switch defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>

      <Separator />

      <Button variant="outline" className="w-full text-destructive" onClick={signOut}>
        <LogOut className="h-4 w-4 mr-2" /> Sign Out
      </Button>
    </div>
  );
};

export default DoctorProfile;
