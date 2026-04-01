
-- Create discount_codes table
CREATE TABLE public.discount_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_percent INTEGER NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
  max_uses INTEGER,
  current_uses INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

-- Anyone can validate a code (select active ones)
CREATE POLICY "Anyone can view active discount codes"
  ON public.discount_codes FOR SELECT
  USING (is_active = true);

-- Admins have full access
CREATE POLICY "Admins can manage discount codes"
  ON public.discount_codes FOR ALL
  USING (is_admin_or_super_admin())
  WITH CHECK (is_admin_or_super_admin());

-- Trigger for updated_at
CREATE TRIGGER update_discount_codes_updated_at
  BEFORE UPDATE ON public.discount_codes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
