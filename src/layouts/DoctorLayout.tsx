import { Outlet } from 'react-router-dom';
import BottomNavigation from '@/components/BottomNavigation';
import { LayoutDashboard, Calendar, Bell, User } from 'lucide-react';

const doctorNavItems = [
  { label: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
  { label: 'Appointments', path: '/doctor/appointments', icon: Calendar },
  { label: 'Notifications', path: '/doctor/notifications', icon: Bell },
  { label: 'Profile', path: '/doctor/profile', icon: User },
];

const DoctorLayout = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Outlet />
      <BottomNavigation items={doctorNavItems} />
    </div>
  );
};

export default DoctorLayout;
