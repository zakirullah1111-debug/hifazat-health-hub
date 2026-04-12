
-- Drop the recursive admin policy on profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Recreate using the security definer function to avoid recursion
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR public.get_user_role(auth.uid()) = 'admin'
);
