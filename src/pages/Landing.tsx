import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Shield, Stethoscope, Users, ArrowRight, Heart, CalendarCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-5 py-4 relative z-10"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-foreground">
            Hifazat
          </h1>
        </div>
        <Link to="/login">
          <Button variant="outline" size="sm" className="rounded-full px-5 font-semibold">
            Login
          </Button>
        </Link>
      </motion.header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col relative">
        {/* Decorative background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-[0.08]"
            style={{ background: 'hsl(var(--primary))' }}
          />
          <div
            className="absolute top-1/3 -left-16 w-48 h-48 rounded-full opacity-[0.06]"
            style={{ background: 'hsl(var(--success))' }}
          />
          <div
            className="absolute bottom-20 right-10 w-32 h-32 rounded-full opacity-[0.05]"
            style={{ background: 'hsl(var(--info))' }}
          />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-5 text-center gap-8 relative z-10">
          {/* Animated Heart Pulse Icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="relative"
          >
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center relative">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Heart className="h-10 w-10 text-primary" fill="hsl(var(--primary))" fillOpacity={0.2} />
              </motion.div>
              {/* Small pulsing ring */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-primary/20"
                animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              />
            </div>
          </motion.div>

          {/* Welcome Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-3 max-w-md"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight tracking-tight">
              Welcome to{' '}
              <span className="text-primary">Hifazat</span>
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed max-w-sm mx-auto">
              Your trusted healthcare companion. Connect with verified doctors, book appointments instantly, and take charge of your well-being.
            </p>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-3 gap-3 w-full max-w-md"
          >
            <FeatureCard
              icon={Stethoscope}
              title="Expert Doctors"
              desc="Verified & trusted"
              delay={0.6}
            />
            <FeatureCard
              icon={CalendarCheck}
              title="Easy Booking"
              desc="Book in seconds"
              delay={0.7}
            />
            <FeatureCard
              icon={Shield}
              title="Secure"
              desc="Data protected"
              delay={0.8}
            />
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex items-center justify-center gap-6 text-center"
          >
            <StatItem value="100+" label="Doctors" />
            <div className="w-px h-8 bg-border" />
            <StatItem value="500+" label="Patients" />
            <div className="w-px h-8 bg-border" />
            <StatItem value="24/7" label="Support" />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="w-full max-w-sm space-y-3"
          >
            <Link to="/signup" className="block">
              <Button className="w-full h-13 text-base font-bold gap-2 rounded-xl shadow-lg" size="lg">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Bottom trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="py-4 px-5 text-center"
        >
          <p className="text-xs text-muted-foreground/70 flex items-center justify-center gap-1">
            <Shield className="h-3 w-3" />
            Trusted by healthcare professionals across Afghanistan
          </p>
        </motion.div>
      </main>
    </div>
  );
};

const FeatureCard = ({
  icon: Icon,
  title,
  desc,
  delay = 0,
}: {
  icon: any;
  title: string;
  desc: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ y: -2, transition: { duration: 0.2 } }}
    className="bg-card rounded-xl p-3.5 border border-border text-center space-y-1.5 shadow-sm"
  >
    <div className="w-10 h-10 mx-auto rounded-xl bg-primary/10 flex items-center justify-center">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <h3 className="text-xs font-bold text-foreground leading-tight">{title}</h3>
    <p className="text-[10px] text-muted-foreground leading-tight">{desc}</p>
  </motion.div>
);

const StatItem = ({ value, label }: { value: string; label: string }) => (
  <div>
    <p className="text-lg font-extrabold text-foreground">{value}</p>
    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
  </div>
);

export default Landing;
