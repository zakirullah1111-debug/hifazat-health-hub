import { Link } from 'react-router-dom';
import { ArrowLeft, User, Stethoscope } from 'lucide-react';

const SignupChoice = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">Join Hifazat</h1>
          <p className="text-sm text-muted-foreground">Choose how you want to sign up</p>
        </div>

        <div className="space-y-3">
          <Link
            to="/signup/patient"
            className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary transition-colors"
          >
            <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center shrink-0">
              <User className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">I'm a Patient</h3>
              <p className="text-sm text-muted-foreground">Book appointments with doctors</p>
            </div>
          </Link>

          <Link
            to="/signup/doctor"
            className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary transition-colors"
          >
            <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center shrink-0">
              <Stethoscope className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">I'm a Doctor</h3>
              <p className="text-sm text-muted-foreground">Manage patients and appointments</p>
            </div>
          </Link>
        </div>

        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupChoice;
