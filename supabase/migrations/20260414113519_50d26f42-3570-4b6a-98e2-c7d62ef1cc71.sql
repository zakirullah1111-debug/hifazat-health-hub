
-- ================================================
-- STEP 0: Create temporary ID mappings BEFORE any changes
-- ================================================
CREATE TEMP TABLE _profile_map AS SELECT id AS old_id, user_id AS new_id FROM profiles;
CREATE TEMP TABLE _doctor_map AS SELECT dp.id AS old_id, p.user_id AS new_id FROM doctor_profiles dp JOIN profiles p ON p.id = dp.profile_id;
CREATE TEMP TABLE _patient_map AS SELECT pp.id AS old_id, p.user_id AS new_id FROM patient_profiles pp JOIN profiles p ON p.id = pp.profile_id;

-- ================================================
-- STEP 1: Drop all RLS policies
-- ================================================
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

DROP POLICY IF EXISTS "Admins can update doctor profiles" ON doctor_profiles;
DROP POLICY IF EXISTS "Admins can view all doctor profiles" ON doctor_profiles;
DROP POLICY IF EXISTS "Anyone authenticated can view approved doctors" ON doctor_profiles;
DROP POLICY IF EXISTS "Doctors can insert own doctor profile" ON doctor_profiles;
DROP POLICY IF EXISTS "Doctors can update own doctor profile" ON doctor_profiles;
DROP POLICY IF EXISTS "Doctors can view own doctor profile" ON doctor_profiles;

DROP POLICY IF EXISTS "Admins can view all patient profiles" ON patient_profiles;
DROP POLICY IF EXISTS "Patients can insert own patient profile" ON patient_profiles;
DROP POLICY IF EXISTS "Patients can update own patient profile" ON patient_profiles;
DROP POLICY IF EXISTS "Patients can view own patient profile" ON patient_profiles;

DROP POLICY IF EXISTS "Admins can view all appointments" ON appointments;
DROP POLICY IF EXISTS "Doctors can update their appointments" ON appointments;
DROP POLICY IF EXISTS "Doctors can view their appointments" ON appointments;
DROP POLICY IF EXISTS "Patients can create appointments" ON appointments;
DROP POLICY IF EXISTS "Patients can view own appointments" ON appointments;

DROP POLICY IF EXISTS "Admins can update complaints" ON complaints;
DROP POLICY IF EXISTS "Admins can view all complaints" ON complaints;
DROP POLICY IF EXISTS "Patients can create complaints" ON complaints;
DROP POLICY IF EXISTS "Patients can view own complaints" ON complaints;

DROP POLICY IF EXISTS "Patients can delete favorites" ON favorites;
DROP POLICY IF EXISTS "Patients can manage favorites" ON favorites;
DROP POLICY IF EXISTS "Patients can view own favorites" ON favorites;

DROP POLICY IF EXISTS "Admins can manage notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update read status" ON notifications;
DROP POLICY IF EXISTS "Users can view their notifications" ON notifications;

DROP POLICY IF EXISTS "Admins can manage emergency contacts" ON emergency_contacts;
DROP POLICY IF EXISTS "Anyone authenticated can view emergency contacts" ON emergency_contacts;

-- ================================================
-- STEP 2: Drop all foreign keys
-- ================================================
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_doctor_profile_id_fkey;
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_patient_profile_id_fkey;
ALTER TABLE complaints DROP CONSTRAINT IF EXISTS complaints_patient_profile_id_fkey;
ALTER TABLE doctor_profiles DROP CONSTRAINT IF EXISTS doctor_profiles_profile_id_fkey;
ALTER TABLE favorites DROP CONSTRAINT IF EXISTS favorites_doctor_profile_id_fkey;
ALTER TABLE favorites DROP CONSTRAINT IF EXISTS favorites_patient_profile_id_fkey;
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_target_profile_id_fkey;
ALTER TABLE patient_profiles DROP CONSTRAINT IF EXISTS patient_profiles_profile_id_fkey;

-- ================================================
-- STEP 3: Create new doctors and patients tables
-- ================================================
CREATE TABLE public.doctors (
  id uuid PRIMARY KEY,
  specialization text,
  city text,
  district text,
  village text,
  experience_years integer DEFAULT 0,
  fee numeric DEFAULT 0,
  bio text,
  is_approved boolean DEFAULT false,
  is_frozen boolean DEFAULT false,
  status text DEFAULT 'offline',
  available_emergency boolean DEFAULT false,
  visible_fields jsonb DEFAULT '{}',
  total_patients integer DEFAULT 0,
  rating numeric DEFAULT 0,
  rating_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

INSERT INTO doctors (id, specialization, city, district, experience_years, fee, bio, is_approved, is_frozen, status, available_emergency, total_patients, created_at)
SELECT
  p.user_id, dp.specialization, dp.city, dp.district,
  COALESCE(dp.years_of_experience, 0), COALESCE(dp.consultation_fee, 0), dp.bio,
  (dp.verification_status = 'approved'), (dp.verification_status = 'frozen'),
  dp.availability_status::text, COALESCE(dp.available_in_emergency, false),
  COALESCE(dp.patients_checked_count, 0), dp.created_at
FROM doctor_profiles dp JOIN profiles p ON p.id = dp.profile_id;

CREATE TABLE public.patients (
  id uuid PRIMARY KEY,
  village text,
  district text,
  city text,
  created_at timestamptz DEFAULT now()
);

INSERT INTO patients (id, village, district, created_at)
SELECT p.user_id, pp.village, pp.district, pp.created_at
FROM patient_profiles pp JOIN profiles p ON p.id = pp.profile_id;

-- ================================================
-- STEP 4: Update appointments FK values to auth uids
-- ================================================
UPDATE appointments a SET doctor_profile_id = dm.new_id FROM _doctor_map dm WHERE dm.old_id = a.doctor_profile_id;
UPDATE appointments a SET patient_profile_id = pm.new_id FROM _patient_map pm WHERE pm.old_id = a.patient_profile_id;
ALTER TABLE appointments RENAME COLUMN doctor_profile_id TO doctor_id;
ALTER TABLE appointments RENAME COLUMN patient_profile_id TO patient_id;
ALTER TABLE appointments DROP COLUMN IF EXISTS fee_snapshot;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS fee_paid numeric;
ALTER TABLE appointments DROP COLUMN IF EXISTS appointment_time;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS queue_position integer;
-- Update status enum to text
ALTER TABLE appointments ALTER COLUMN status DROP DEFAULT;
ALTER TABLE appointments ALTER COLUMN status TYPE text USING status::text;
ALTER TABLE appointments ALTER COLUMN status SET DEFAULT 'pending';
UPDATE appointments SET status = 'pending' WHERE status = 'pending_confirmation';
UPDATE appointments SET status = 'completed' WHERE status = 'called';

-- ================================================
-- STEP 5: Update complaints
-- ================================================
UPDATE complaints c SET patient_profile_id = pm.new_id FROM _patient_map pm WHERE pm.old_id = c.patient_profile_id;
ALTER TABLE complaints RENAME COLUMN patient_profile_id TO patient_id;
ALTER TABLE complaints RENAME COLUMN admin_notes TO admin_reply;
ALTER TABLE complaints ALTER COLUMN status DROP DEFAULT;
ALTER TABLE complaints ALTER COLUMN status TYPE text USING status::text;
ALTER TABLE complaints ALTER COLUMN status SET DEFAULT 'open';

-- ================================================
-- STEP 6: Update favorites → favourites
-- ================================================
UPDATE favorites f SET doctor_profile_id = dm.new_id FROM _doctor_map dm WHERE dm.old_id = f.doctor_profile_id;
UPDATE favorites f SET patient_profile_id = pm.new_id FROM _patient_map pm WHERE pm.old_id = f.patient_profile_id;
ALTER TABLE favorites RENAME COLUMN doctor_profile_id TO doctor_id;
ALTER TABLE favorites RENAME COLUMN patient_profile_id TO patient_id;
ALTER TABLE favorites RENAME TO favourites;

-- ================================================
-- STEP 7: Update notifications
-- ================================================
UPDATE notifications n SET target_profile_id = m.new_id FROM _profile_map m WHERE m.old_id = n.target_profile_id AND n.target_profile_id IS NOT NULL;
ALTER TABLE notifications RENAME COLUMN target_profile_id TO recipient_id;
ALTER TABLE notifications RENAME COLUMN message TO body;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS sender_id uuid;
ALTER TABLE notifications DROP COLUMN IF EXISTS target_role;

-- ================================================
-- STEP 8: Update profiles (id = user_id)
-- ================================================
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_pkey;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_id_key;
UPDATE profiles SET id = user_id;
ALTER TABLE profiles ADD PRIMARY KEY (id);
ALTER TABLE profiles DROP COLUMN user_id;

-- ================================================
-- STEP 9: Drop old tables
-- ================================================
DROP TABLE IF EXISTS doctor_profiles CASCADE;
DROP TABLE IF EXISTS patient_profiles CASCADE;
DROP TABLE IF EXISTS emergency_contacts CASCADE;

-- ================================================
-- STEP 10: Drop old enums
-- ================================================
DROP TYPE IF EXISTS verification_status CASCADE;
DROP TYPE IF EXISTS availability_status CASCADE;
DROP TYPE IF EXISTS notification_target CASCADE;
DROP TYPE IF EXISTS appointment_status CASCADE;
DROP TYPE IF EXISTS complaint_status CASCADE;

-- ================================================
-- STEP 11: Add foreign keys
-- ================================================
ALTER TABLE doctors ADD CONSTRAINT doctors_id_fkey FOREIGN KEY (id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE patients ADD CONSTRAINT patients_id_fkey FOREIGN KEY (id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE appointments ADD CONSTRAINT appointments_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES doctors(id);
ALTER TABLE appointments ADD CONSTRAINT appointments_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES patients(id);
ALTER TABLE complaints ADD CONSTRAINT complaints_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES patients(id);
ALTER TABLE favourites ADD CONSTRAINT favourites_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES doctors(id);
ALTER TABLE favourites ADD CONSTRAINT favourites_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES patients(id);
ALTER TABLE notifications ADD CONSTRAINT notifications_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES profiles(id);

-- ================================================
-- STEP 12: Update functions
-- ================================================
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT role FROM public.profiles WHERE id = user_uuid LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name, email, phone)
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

-- ================================================
-- STEP 13: RLS policies
-- ================================================
-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT TO authenticated USING (get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- doctors
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Doctors can view own profile" ON doctors FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Doctors can update own profile" ON doctors FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Doctors can insert own profile" ON doctors FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Anyone can view approved doctors" ON doctors FOR SELECT USING (is_approved = true AND is_frozen = false AND auth.uid() IS NOT NULL);
CREATE POLICY "Admins can view all doctors" ON doctors FOR SELECT USING (get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Admins can update doctors" ON doctors FOR UPDATE USING (get_user_role(auth.uid()) = 'admin');

-- patients
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients can view own profile" ON patients FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Patients can insert own profile" ON patients FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Patients can update own profile" ON patients FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all patients" ON patients FOR SELECT USING (get_user_role(auth.uid()) = 'admin');

-- appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Doctors can view their appointments" ON appointments FOR SELECT USING (auth.uid() = doctor_id);
CREATE POLICY "Doctors can update their appointments" ON appointments FOR UPDATE USING (auth.uid() = doctor_id);
CREATE POLICY "Patients can view own appointments" ON appointments FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients can create appointments" ON appointments FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Admins can view all appointments" ON appointments FOR SELECT USING (get_user_role(auth.uid()) = 'admin');

-- complaints
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients can create complaints" ON complaints FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Patients can view own complaints" ON complaints FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Admins can view all complaints" ON complaints FOR SELECT USING (get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Admins can update complaints" ON complaints FOR UPDATE USING (get_user_role(auth.uid()) = 'admin');

-- favourites
ALTER TABLE favourites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients can view own favourites" ON favourites FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients can manage favourites" ON favourites FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Patients can delete favourites" ON favourites FOR DELETE USING (auth.uid() = patient_id);

-- notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT USING (recipient_id IS NULL OR auth.uid() = recipient_id);
CREATE POLICY "Users can update read status" ON notifications FOR UPDATE USING (auth.uid() = recipient_id);
CREATE POLICY "Admins can manage notifications" ON notifications FOR ALL USING (get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Authenticated users can insert notifications" ON notifications FOR INSERT TO authenticated WITH CHECK (true);

-- ================================================
-- STEP 14: Cleanup
-- ================================================
DROP TABLE IF EXISTS _profile_map;
DROP TABLE IF EXISTS _doctor_map;
DROP TABLE IF EXISTS _patient_map;
