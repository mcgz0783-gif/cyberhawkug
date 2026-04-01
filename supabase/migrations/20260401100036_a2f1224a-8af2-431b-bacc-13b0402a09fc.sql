
CREATE OR REPLACE FUNCTION public.increment_discount_usage(discount_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE discount_codes SET current_uses = current_uses + 1 WHERE id = discount_id;
END;
$$;
