-- Drop the permissive insert policy that allows users to set any status/amount
DROP POLICY "purchases_insert_own" ON public.purchases;

-- Recreate with restrictions: users can only insert PENDING purchases with positive amounts
CREATE POLICY "purchases_insert_own" ON public.purchases FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'PENDING'
    AND amount_paid > 0
  );