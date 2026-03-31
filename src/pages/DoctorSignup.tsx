import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';

const DoctorSignup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [qualification, setQualification] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role: 'doctor', full_name: fullName, phone },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      toast({ title: 'Signup failed', description: error.message, variant: 'destructive' });
      setLoading(false);
      return;
    }

    if (data.user) {
      await new Promise((r) => setTimeout(r, 1000));
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', data.user.id)
        .single();

      if (profile) {
        await supabase.from('doctor_profiles').insert({
          profile_id: profile.id,
          specialization,
          qualification,
          license_number: licenseNumber,
          city,
        });
      }
    }

    setLoading(false);
    toast({ title: 'Application submitted!', description: 'Your profile is pending approval.' });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-6">
        <Link to="/signup" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">Doctor Sign Up</h1>
          <p className="text-sm text-muted-foreground">Your profile will be reviewed before activation</p>
        </div>
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Dr. Full Name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="doctor@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+93 ..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Input id="specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} required placeholder="e.g. Cardiology" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="qualification">Qualification</Label>
            <Input id="qualification" value={qualification} onChange={(e) => setQualification(e.target.value)} required placeholder="e.g. MBBS, MD" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="license">License Number</Label>
            <Input id="license" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} required placeholder="Medical license number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required placeholder="Your city" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="At least 6 characters" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Application'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default DoctorSignup;
