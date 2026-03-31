import { Outlet } from 'react-router-dom';
import BottomNavigation from '@/components/BottomNavigation';
import { LayoutDashboard, Calendar, Heart, User } from 'lucide-react';

const patientNavItems = [
  { label: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
  { label: 'Appointments', path: '/patient/appointments', icon: Calendar },
  { label: 'Favorites', path: '/patient/favorites', icon: Heart },
  { label: 'Profile', path: '/patient/profile', icon: User },
];

const PatientLayout = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Outlet />
      <BottomNavigation items={patientNavItems} />
    </div>
  );
};

export default PatientLayout;
