import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';

const specializations = [
  'General Physician', 'Cardiologist', 'Dermatologist', 'Pediatrician',
  'Gynecologist', 'Orthopedic', 'ENT', 'Neurologist', 'Psychiatrist', 'Dentist', 'Other',
];

const DoctorSignup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role: 'doctor', full_name: fullName, phone },
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      if (data.user) {
        await new Promise((r) => setTimeout(r, 1500));

        const { error: doctorError } = await supabase
          .from('doctors')
          .insert({
            id: data.user.id,
            specialization,
            city,
            district,
            experience_years: parseInt(experienceYears) || 0,
            fee: parseFloat(consultationFee) || 0,
            bio: bio || null,
            is_approved: false,
            is_frozen: false,
            status: 'offline',
          });

        if (doctorError) {
          console.error('Doctor insert error:', doctorError);
        }
      }

      toast({ title: 'Application submitted!', description: 'Your profile is pending approval.' });
      navigate('/login');
    } catch (err: any) {
      toast({ title: 'Signup failed', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
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
            <Select value={specialization} onValueChange={setSpecialization} required>
              <SelectTrigger>
                <SelectValue placeholder="Select specialization" />
              </SelectTrigger>
              <SelectContent>
                {specializations.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required placeholder="Your city" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="district">District</Label>
            <Input id="district" value={district} onChange={(e) => setDistrict(e.target.value)} required placeholder="Your district" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="experience">Experience (Years)</Label>
            <Input id="experience" type="number" min="0" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} required placeholder="e.g. 5" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fee">Consultation Fee (AFN)</Label>
            <Input id="fee" type="number" min="0" value={consultationFee} onChange={(e) => setConsultationFee(e.target.value)} required placeholder="e.g. 500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio (optional)</Label>
            <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell patients about yourself..." rows={3} />
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
