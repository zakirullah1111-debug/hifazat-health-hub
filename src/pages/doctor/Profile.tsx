import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { LogOut, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const DoctorProfile = () => {
  const { profile, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [specialization, setSpecialization] = useState('');
  const [fee, setFee] = useState('');
  const [experience, setExperience] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [availableEmergency, setAvailableEmergency] = useState(false);
  const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>({
    phone: true, email: true, fee: true, experience: true, qualification: true,
  });

  useEffect(() => {
    if (!profile?.id) return;
    const fetchData = async () => {
      const { data } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', profile.id)
        .maybeSingle();
      if (data) {
        setSpecialization(data.specialization || '');
        setFee(data.fee?.toString() || '');
        setExperience(data.experience_years?.toString() || '');
        setBio(data.bio || '');
        setCity(data.city || '');
        setDistrict(data.district || '');
        setAvailableEmergency(data.available_emergency || false);
        if (data.visible_fields && typeof data.visible_fields === 'object') {
          setVisibleFields({ ...visibleFields, ...(data.visible_fields as Record<string, boolean>) });
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [profile?.id]);

  const handleSave = async () => {
    if (!profile?.id) return;
    setSaving(true);
    const { error } = await supabase
      .from('doctors')
      .update({
        specialization,
        fee: fee ? parseFloat(fee) : null,
        experience_years: experience ? parseInt(experience) : null,
        bio: bio || null,
        city,
        district,
        available_emergency: availableEmergency,
        visible_fields: visibleFields,
      })
      .eq('id', profile.id);

    if (error) {
      toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Profile updated successfully' });
    }
    setSaving(false);
  };

  const toggleVisibility = (field: string) => {
    setVisibleFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-foreground">Doctor Profile</h1>

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

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Professional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Specialization</Label>
              <Input value={specialization} onChange={e => setSpecialization(e.target.value)} placeholder="Cardiology" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Consultation Fee (AFN)</Label>
              <Input type="number" value={fee} onChange={e => setFee(e.target.value)} placeholder="500" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Experience (years)</Label>
              <Input type="number" value={experience} onChange={e => setExperience(e.target.value)} placeholder="5" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">City</Label>
              <Input value={city} onChange={e => setCity(e.target.value)} placeholder="Kabul" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">District</Label>
              <Input value={district} onChange={e => setDistrict(e.target.value)} placeholder="District" />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Bio</Label>
            <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell patients about yourself..." rows={3} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Available for Emergency</Label>
            <Switch checked={availableEmergency} onCheckedChange={setAvailableEmergency} />
          </div>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Visibility Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: 'Show phone to patients', key: 'phone' },
            { label: 'Show email to patients', key: 'email' },
            { label: 'Show fee to patients', key: 'fee' },
            { label: 'Show experience to patients', key: 'experience' },
            { label: 'Show qualification to patients', key: 'qualification' },
          ].map(({ label, key }) => (
            <div key={key} className="flex items-center justify-between">
              <Label className="text-sm">{label}</Label>
              <Switch checked={visibleFields[key] ?? true} onCheckedChange={() => toggleVisibility(key)} />
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
