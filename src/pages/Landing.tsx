import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Shield, Stethoscope, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Landing = () => {
  const { user, profile } = useAuth();

  if (user && profile) {
    const routes: Record<string, string> = {
      patient: '/patient/dashboard',
      doctor: '/doctor/dashboard',
      admin: '/admin/dashboard',
    };
    return <Navigate to={routes[profile.role] ?? '/'} replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-between px-4 py-4">
        <h1 className="text-xl font-bold text-primary">Hifazat</h1>
        <Link to="/login">
          <Button variant="outline" size="sm">Login</Button>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center gap-8">
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">
            Your Health,<br />Our Priority
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Connect with trusted doctors, book appointments, and manage your healthcare journey — all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg w-full">
          <FeatureCard icon={Stethoscope} title="Expert Doctors" desc="Verified medical professionals" />
          <FeatureCard icon={Users} title="Easy Booking" desc="Book appointments quickly" />
          <FeatureCard icon={Shield} title="Secure" desc="Your data is protected" />
        </div>

        <Link to="/signup" className="w-full max-w-sm">
          <Button className="w-full h-12 text-base font-semibold gap-2" size="lg">
            Get Started <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>

        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
        </p>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) => (
  <div className="bg-card rounded-xl p-4 border border-border text-center space-y-2">
    <div className="w-10 h-10 mx-auto rounded-lg bg-accent flex items-center justify-center">
      <Icon className="h-5 w-5 text-accent-foreground" />
    </div>
    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
    <p className="text-xs text-muted-foreground">{desc}</p>
  </div>
);

export default Landing;
