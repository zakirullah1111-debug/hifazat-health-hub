import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DoctorGuard from "@/components/DoctorGuard";

// Layouts
import PatientLayout from "@/layouts/PatientLayout";
import DoctorLayout from "@/layouts/DoctorLayout";
import AdminLayout from "@/layouts/AdminLayout";

// Public pages
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import SignupChoice from "@/pages/SignupChoice";
import PatientSignup from "@/pages/PatientSignup";
import DoctorSignup from "@/pages/DoctorSignup";
import NotFound from "@/pages/NotFound";

// Patient pages
import PatientDashboard from "@/pages/patient/Dashboard";
import PatientAppointments from "@/pages/patient/Appointments";
import PatientFavorites from "@/pages/patient/Favorites";
import PatientProfile from "@/pages/patient/Profile";

// Doctor pages
import DoctorDashboard from "@/pages/doctor/Dashboard";
import DoctorAppointments from "@/pages/doctor/Appointments";
import DoctorNotifications from "@/pages/doctor/Notifications";
import DoctorProfile from "@/pages/doctor/Profile";

// Admin pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminDoctors from "@/pages/admin/Doctors";
import AdminPatients from "@/pages/admin/Patients";
import AdminApprovals from "@/pages/admin/Approvals";
import AdminNotifications from "@/pages/admin/Notifications";
import AdminComplaints from "@/pages/admin/Complaints";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignupChoice />} />
            <Route path="/signup/patient" element={<PatientSignup />} />
            <Route path="/signup/doctor" element={<DoctorSignup />} />

            {/* Patient routes */}
            <Route path="/patient" element={<ProtectedRoute allowedRoles={['patient']}><PatientLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<PatientDashboard />} />
              <Route path="appointments" element={<PatientAppointments />} />
              <Route path="favorites" element={<PatientFavorites />} />
              <Route path="profile" element={<PatientProfile />} />
            </Route>

            {/* Doctor routes */}
            <Route path="/doctor" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorGuard><DoctorLayout /></DoctorGuard></ProtectedRoute>}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DoctorDashboard />} />
              <Route path="appointments" element={<DoctorAppointments />} />
              <Route path="notifications" element={<DoctorNotifications />} />
              <Route path="profile" element={<DoctorProfile />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="doctors" element={<AdminDoctors />} />
              <Route path="patients" element={<AdminPatients />} />
              <Route path="approvals" element={<AdminApprovals />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="complaints" element={<AdminComplaints />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
