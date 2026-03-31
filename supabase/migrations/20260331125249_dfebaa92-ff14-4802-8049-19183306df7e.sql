
-- Create enums
CREATE TYPE public.app_role AS ENUM ('patient', 'doctor', 'admin');
CREATE TYPE public.verification_status AS ENUM ('pending', 'approved', 'rejected', 'frozen');
CREATE TYPE public.availability_status AS ENUM ('available', 'busy', 'away', 'offline');
CREATE TYPE public.appointment_status AS ENUM ('pending_confirmation', 'confirmed', 'in_queue', 'called', 'completed', 'cancelled');
CREATE TYPE public.complaint_status AS ENUM ('open', 'in_progress', 'resolved');
CREATE TYPE public.notification_target AS ENUM ('patient', 'doctor', 'both');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role app_role NOT NULL DEFAULT 'patient',
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin')
);

-- Patient profiles
CREATE TABLE public.patient_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  village TEXT,
  district TEXT,
  theme_preference TEXT DEFAULT 'light',
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.patient_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view own patient profile" ON public.patient_profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = patient_profiles.profile_id AND p.user_id = auth.uid())
);
CREATE POLICY "Patients can update own patient profile" ON public.patient_profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = patient_profiles.profile_id AND p.user_id = auth.uid())
);
CREATE POLICY "Patients can insert own patient profile" ON public.patient_profiles FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = patient_profiles.profile_id AND p.user_id = auth.uid())
);
CREATE POLICY "Admins can view all patient profiles" ON public.patient_profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin')
);

-- Doctor profiles
CREATE TABLE public.doctor_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  specialization TEXT,
  qualification TEXT,
  license_number TEXT,
  years_of_experience INTEGER DEFAULT 0,
  consultation_fee NUMERIC(10,2) DEFAULT 0,
  city TEXT,
  district TEXT,
  bio TEXT,
  clinic_name TEXT,
  profile_photo_url TEXT,
  verification_status verification_status NOT NULL DEFAULT 'pending',
  availability_status availability_status NOT NULL DEFAULT 'offline',
  available_in_emergency BOOLEAN DEFAULT false,
  patients_checked_count INTEGER DEFAULT 0,
  show_phone_to_patients BOOLEAN DEFAULT true,
  show_email_to_patients BOOLEAN DEFAULT true,
  show_fee_to_patients BOOLEAN DEFAULT true,
  show_experience_to_patients BOOLEAN DEFAULT true,
  show_qualification_to_patients BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.doctor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can view own doctor profile" ON public.doctor_profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = doctor_profiles.profile_id AND p.user_id = auth.uid())
);
CREATE POLICY "Doctors can update own doctor profile" ON public.doctor_profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = doctor_profiles.profile_id AND p.user_id = auth.uid())
);
CREATE POLICY "Doctors can insert own doctor profile" ON public.doctor_profiles FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = doctor_profiles.profile_id AND p.user_id = auth.uid())
);
CREATE POLICY "Anyone authenticated can view approved doctors" ON public.doctor_profiles FOR SELECT USING (
  verification_status = 'approved' AND auth.uid() IS NOT NULL
);
CREATE POLICY "Admins can view all doctor profiles" ON public.doctor_profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin')
);
CREATE POLICY "Admins can update doctor profiles" ON public.doctor_profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin')
);

-- Appointments
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_profile_id UUID REFERENCES public.patient_profiles(id) ON DELETE CASCADE NOT NULL,
  doctor_profile_id UUID REFERENCES public.doctor_profiles(id) ON DELETE CASCADE NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status appointment_status NOT NULL DEFAULT 'pending_confirmation',
  fee_snapshot NUMERIC(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view own appointments" ON public.appointments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.patient_profiles pp JOIN public.profiles p ON p.id = pp.profile_id WHERE pp.id = appointments.patient_profile_id AND p.user_id = auth.uid())
);
CREATE POLICY "Patients can create appointments" ON public.appointments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.patient_profiles pp JOIN public.profiles p ON p.id = pp.profile_id WHERE pp.id = appointments.patient_profile_id AND p.user_id = auth.uid())
);
CREATE POLICY "Doctors can view their appointments" ON public.appointments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.doctor_profiles dp JOIN public.profiles p ON p.id = dp.profile_id WHERE dp.id = appointments.doctor_profile_id AND p.user_id = auth.uid())
);
CREATE POLICY "Doctors can update their appointments" ON public.appointments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.doctor_profiles dp JOIN public.profiles p ON p.id = dp.profile_id WHERE dp.id = appointments.doctor_profile_id AND p.user_id = auth.uid())
);
CREATE POLICY "Admins can view all appointments" ON public.appointments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin')
);

-- Favorites
CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_profile_id UUID REFERENCES public.patient_profiles(id) ON DELETE CASCADE NOT NULL,
  doctor_profile_id UUID REFERENCES public.doctor_profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(patient_profile_id, doctor_profile_id)
);
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view own favorites" ON public.favorites FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.patient_profiles pp JOIN public.profiles p ON p.id = pp.profile_id WHERE pp.id = favorites.patient_profile_id AND p.user_id = auth.uid())
);
CREATE POLICY "Patients can manage favorites" ON public.favorites FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.patient_profiles pp JOIN public.profiles p ON p.id = pp.profile_id WHERE pp.id = favorites.patient_profile_id AND p.user_id = auth.uid())
);
CREATE POLICY "Patients can delete favorites" ON public.favorites FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.patient_profiles pp JOIN public.profiles p ON p.id = pp.profile_id WHERE pp.id = favorites.patient_profile_id AND p.user_id = auth.uid())
);

-- Notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  target_role notification_target NOT NULL DEFAULT 'both',
  target_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'general',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their notifications" ON public.notifications FOR SELECT USING (
  target_profile_id IS NULL OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = notifications.target_profile_id AND p.user_id = auth.uid())
);
CREATE POLICY "Users can update read status" ON public.notifications FOR UPDATE USING (
  target_profile_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = notifications.target_profile_id AND p.user_id = auth.uid())
);
CREATE POLICY "Admins can manage notifications" ON public.notifications FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin')
);

-- Complaints
CREATE TABLE public.complaints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_profile_id UUID REFERENCES public.patient_profiles(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status complaint_status NOT NULL DEFAULT 'open',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view own complaints" ON public.complaints FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.patient_profiles pp JOIN public.profiles p ON p.id = pp.profile_id WHERE pp.id = complaints.patient_profile_id AND p.user_id = auth.uid())
);
CREATE POLICY "Patients can create complaints" ON public.complaints FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.patient_profiles pp JOIN public.profiles p ON p.id = pp.profile_id WHERE pp.id = complaints.patient_profile_id AND p.user_id = auth.uid())
);
CREATE POLICY "Admins can view all complaints" ON public.complaints FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin')
);
CREATE POLICY "Admins can update complaints" ON public.complaints FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin')
);

-- Emergency contacts
CREATE TABLE public.emergency_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('ambulance', 'rescue', 'helpline')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view emergency contacts" ON public.emergency_contacts FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage emergency contacts" ON public.emergency_contacts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin')
);

-- Helper function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = user_uuid LIMIT 1;
$$;

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role, full_name, email, phone)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'patient'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
