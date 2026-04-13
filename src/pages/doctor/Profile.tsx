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
  const [doctorProfileId, setDoctorProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [specialization, setSpecialization] = useState('');
  const [qualification, setQualification] = useState('');
  const [fee, setFee] = useState('');
  const [experience, setExperience] = useState('');
  const [bio, setBio] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [availableEmergency, setAvailableEmergency] = useState(false);

  const [showPhone, setShowPhone] = useState(true);
  const [showEmail, setShowEmail] = useState(true);
  const [showFee, setShowFee] = useState(true);
  const [showExp, setShowExp] = useState(true);
  const [showQual, setShowQual] = useState(true);

  useEffect(() => {
    if (!profile?.id) return;
    const fetch = async () => {
      const { data } = await supabase
        .from('doctor_profiles')
        .select('*')
        .eq('profile_id', profile.id)
        .maybeSingle();
      if (data) {
        setDoctorProfileId(data.id);
        setSpecialization(data.specialization || '');
        setQualification(data.qualification || '');
        setFee(data.consultation_fee?.toString() || '');
        setExperience(data.years_of_experience?.toString() || '');
        setBio(data.bio || '');
        setClinicName(data.clinic_name || '');
        setAvailableEmergency(data.available_in_emergency || false);
        setShowPhone(data.show_phone_to_patients ?? true);
        setShowEmail(data.show_email_to_patients ?? true);
        setShowFee(data.show_fee_to_patients ?? true);
        setShowExp(data.show_experience_to_patients ?? true);
        setShowQual(data.show_qualification_to_patients ?? true);
      }
      setLoading(false);
    };
    fetch();
  }, [profile?.id]);

  const handleSave = async () => {
    if (!doctorProfileId) return;
    setSaving(true);
    const { error } = await supabase
      .from('doctor_profiles')
      .update({
        specialization,
        qualification,
        consultation_fee: fee ? parseFloat(fee) : null,
        years_of_experience: experience ? parseInt(experience) : null,
        bio: bio || null,
        clinic_name: clinicName || null,
        available_in_emergency: availableEmergency,
        show_phone_to_patients: showPhone,
        show_email_to_patients: showEmail,
        show_fee_to_patients: showFee,
        show_experience_to_patients: showExp,
        show_qualification_to_patients: showQual,
      })
      .eq('id', doctorProfileId);

    if (error) {
      toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Profile updated successfully' });
    }
    setSaving(false);
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
              <Label className="text-xs">Qualification</Label>
              <Input value={qualification} onChange={e => setQualification(e.target.value)} placeholder="MBBS, MD" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Consultation Fee (AFN)</Label>
              <Input type="number" value={fee} onChange={e => setFee(e.target.value)} placeholder="500" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Experience (years)</Label>
              <Input type="number" value={experience} onChange={e => setExperience(e.target.value)} placeholder="5" />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Bio</Label>
            <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell patients about yourself..." rows={3} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Clinic Name</Label>
            <Input value={clinicName} onChange={e => setClinicName(e.target.value)} placeholder="Your clinic name" />
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
            { label: 'Show phone to patients', value: showPhone, set: setShowPhone },
            { label: 'Show email to patients', value: showEmail, set: setShowEmail },
            { label: 'Show fee to patients', value: showFee, set: setShowFee },
            { label: 'Show experience to patients', value: showExp, set: setShowExp },
            { label: 'Show qualification to patients', value: showQual, set: setShowQual },
          ].map(({ label, value, set }) => (
            <div key={label} className="flex items-center justify-between">
              <Label className="text-sm">{label}</Label>
              <Switch checked={value} onCheckedChange={set} />
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
