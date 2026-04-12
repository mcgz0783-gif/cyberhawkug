-- 1. Fix admin role escalation: add WITH CHECK to prevent non-SUPER_ADMIN from changing roles
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
CREATE POLICY "profiles_update_admin" ON public.profiles FOR UPDATE
  USING (public.is_admin_or_super_admin())
  WITH CHECK (
    (role = (SELECT p.role FROM public.profiles p WHERE p.id = profiles.id))
    OR EXISTS (
      SELECT 1 FROM public.profiles p2
      WHERE p2.id = auth.uid() AND p2.role = 'SUPER_ADMIN'
    )
  );

-- 2. Fix discount codes public exposure: remove the public SELECT policy
DROP POLICY IF EXISTS "Anyone can view active discount codes" ON public.discount_codes;

-- 3. Add is_not_banned helper function
CREATE OR REPLACE FUNCTION public.is_not_banned()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(
    (SELECT (NOT is_banned AND is_active) FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

-- 4. Update purchases_insert_own to also check ban status
DROP POLICY IF EXISTS "purchases_insert_own" ON public.purchases;
CREATE POLICY "purchases_insert_own" ON public.purchases FOR INSERT
  WITH CHECK (
    (auth.uid() = user_id)
    AND (status = 'PENDING'::purchase_status)
    AND (amount_paid > 0)
    AND public.is_not_banned()
  );

-- 5. Add RLS policies on stripe_events (currently has RLS enabled but no policies)
CREATE POLICY "stripe_events_select_admin" ON public.stripe_events FOR SELECT
  USING (public.is_admin_or_super_admin());