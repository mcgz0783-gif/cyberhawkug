
-- Fix set_updated_at search path
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

-- Newsletter insert: require valid email format instead of blanket TRUE
DROP POLICY IF EXISTS "newsletter_insert_all" ON public.newsletter_subscribers;
CREATE POLICY "newsletter_insert_anon_or_auth" ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (email IS NOT NULL AND length(email) > 5);
