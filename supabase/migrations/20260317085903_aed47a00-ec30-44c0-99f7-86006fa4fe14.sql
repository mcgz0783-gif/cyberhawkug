
-- ═══════════════════════════════════════════════════════════════
-- CYBERHAWK-UG DATABASE SCHEMA
-- ═══════════════════════════════════════════════════════════════

-- 1. CUSTOM TYPES
CREATE TYPE public.user_role AS ENUM ('CUSTOMER', 'ADMIN', 'SUPER_ADMIN');
CREATE TYPE public.purchase_status AS ENUM ('PENDING', 'COMPLETED', 'REFUNDED', 'DISPUTED');

-- 2. HELPER: updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

-- 3. PROFILES TABLE
CREATE TABLE public.profiles (
  id            UUID         PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT         NOT NULL,
  full_name     TEXT,
  role          user_role    NOT NULL DEFAULT 'CUSTOMER',
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
  is_banned     BOOLEAN      NOT NULL DEFAULT FALSE,
  ban_reason    TEXT,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. SECURITY DEFINER HELPER: check role without recursion
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('ADMIN', 'SUPER_ADMIN')
  );
$$;

-- 5. EBOOKS TABLE
CREATE TABLE public.ebooks (
  id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  title             TEXT         NOT NULL,
  slug              TEXT         NOT NULL UNIQUE,
  description       TEXT         NOT NULL,
  price             INTEGER      NOT NULL,
  cover_url         TEXT,
  file_key          TEXT,
  file_size          INTEGER,
  page_count        INTEGER,
  author            TEXT,
  category          TEXT,
  tags              TEXT[]       DEFAULT '{}',
  is_published      BOOLEAN      NOT NULL DEFAULT FALSE,
  is_featured       BOOLEAN      NOT NULL DEFAULT FALSE,
  sort_order        INTEGER      NOT NULL DEFAULT 0,
  stripe_product_id TEXT,
  stripe_price_id   TEXT,
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ebooks_slug ON public.ebooks(slug);
CREATE INDEX idx_ebooks_published ON public.ebooks(is_published);

CREATE TRIGGER ebooks_updated_at
  BEFORE UPDATE ON public.ebooks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 6. BLOG POSTS TABLE
CREATE TABLE public.blog_posts (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT         NOT NULL,
  slug          TEXT         NOT NULL UNIQUE,
  excerpt       TEXT         NOT NULL,
  content       TEXT         NOT NULL,
  category      TEXT         NOT NULL,
  threat_level  TEXT,
  tags          TEXT[]       DEFAULT '{}',
  cover_url     TEXT,
  author        TEXT         NOT NULL DEFAULT 'CyberHawk-UG Threat Intel Team',
  is_published  BOOLEAN      NOT NULL DEFAULT FALSE,
  is_featured   BOOLEAN      NOT NULL DEFAULT FALSE,
  read_time     TEXT,
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blog_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_published ON public.blog_posts(is_published);
CREATE INDEX idx_blog_category ON public.blog_posts(category);

CREATE TRIGGER blog_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 7. PURCHASES TABLE
CREATE TABLE public.purchases (
  id                 UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID             NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  ebook_id           UUID             NOT NULL REFERENCES public.ebooks(id) ON DELETE RESTRICT,
  status             purchase_status  NOT NULL DEFAULT 'PENDING',
  amount_paid        INTEGER          NOT NULL,
  currency           TEXT             NOT NULL DEFAULT 'usd',
  stripe_session_id  TEXT             NOT NULL UNIQUE,
  stripe_payment_id  TEXT,
  download_count     INTEGER          NOT NULL DEFAULT 0,
  last_download_at   TIMESTAMPTZ,
  refunded_at        TIMESTAMPTZ,
  refund_reason      TEXT,
  created_at         TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_ebook UNIQUE (user_id, ebook_id)
);

CREATE INDEX idx_purchases_user ON public.purchases(user_id);
CREATE INDEX idx_purchases_ebook ON public.purchases(ebook_id);
CREATE INDEX idx_purchases_session ON public.purchases(stripe_session_id);
CREATE INDEX idx_purchases_status ON public.purchases(status);

CREATE TRIGGER purchases_updated_at
  BEFORE UPDATE ON public.purchases
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 8. STRIPE EVENTS LOG
CREATE TABLE public.stripe_events (
  id            TEXT         PRIMARY KEY,
  type          TEXT         NOT NULL,
  payload       JSONB        NOT NULL,
  processed     BOOLEAN      NOT NULL DEFAULT FALSE,
  processed_at  TIMESTAMPTZ,
  error         TEXT,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_stripe_events_type ON public.stripe_events(type);

-- 9. AUDIT LOGS
CREATE TABLE public.audit_logs (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id     UUID         NOT NULL,
  actor_role   user_role    NOT NULL,
  action       TEXT         NOT NULL,
  target_id    TEXT,
  target_type  TEXT,
  metadata     JSONB,
  ip_address   TEXT,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_actor ON public.audit_logs(actor_id);
CREATE INDEX idx_audit_action ON public.audit_logs(action);
CREATE INDEX idx_audit_time ON public.audit_logs(created_at DESC);

-- 10. NEWSLETTER SUBSCRIBERS
CREATE TABLE public.newsletter_subscribers (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT         NOT NULL UNIQUE,
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
  subscribed_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT
  USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (role = (SELECT role FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "profiles_select_admin" ON public.profiles FOR SELECT
  USING (public.is_admin_or_super_admin());
CREATE POLICY "profiles_update_admin" ON public.profiles FOR UPDATE
  USING (public.is_admin_or_super_admin());

-- EBOOKS
CREATE POLICY "ebooks_select_published" ON public.ebooks FOR SELECT
  USING (is_published = TRUE);
CREATE POLICY "ebooks_select_admin" ON public.ebooks FOR SELECT
  USING (public.is_admin_or_super_admin());
CREATE POLICY "ebooks_insert_admin" ON public.ebooks FOR INSERT
  WITH CHECK (public.is_admin_or_super_admin());
CREATE POLICY "ebooks_update_admin" ON public.ebooks FOR UPDATE
  USING (public.is_admin_or_super_admin());
CREATE POLICY "ebooks_delete_admin" ON public.ebooks FOR DELETE
  USING (public.is_admin_or_super_admin());

-- BLOG POSTS
CREATE POLICY "blog_select_published" ON public.blog_posts FOR SELECT
  USING (is_published = TRUE);
CREATE POLICY "blog_select_admin" ON public.blog_posts FOR SELECT
  USING (public.is_admin_or_super_admin());
CREATE POLICY "blog_insert_admin" ON public.blog_posts FOR INSERT
  WITH CHECK (public.is_admin_or_super_admin());
CREATE POLICY "blog_update_admin" ON public.blog_posts FOR UPDATE
  USING (public.is_admin_or_super_admin());
CREATE POLICY "blog_delete_admin" ON public.blog_posts FOR DELETE
  USING (public.is_admin_or_super_admin());

-- PURCHASES
CREATE POLICY "purchases_select_own" ON public.purchases FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "purchases_insert_own" ON public.purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "purchases_select_admin" ON public.purchases FOR SELECT
  USING (public.is_admin_or_super_admin());

-- STRIPE EVENTS (service role only - no policies for normal users)
-- Access via supabase admin client only

-- AUDIT LOGS
CREATE POLICY "audit_select_admin" ON public.audit_logs FOR SELECT
  USING (public.is_admin_or_super_admin());

-- NEWSLETTER
CREATE POLICY "newsletter_insert_all" ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (TRUE);
CREATE POLICY "newsletter_select_admin" ON public.newsletter_subscribers FOR SELECT
  USING (public.is_admin_or_super_admin());

-- ═══════════════════════════════════════════════════════════════
-- STORAGE BUCKETS
-- ═══════════════════════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('covers', 'covers', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('ebooks', 'ebooks', false, 524288000, ARRAY['application/pdf']);

-- Covers: public read, admin write
CREATE POLICY "covers_public_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'covers');
CREATE POLICY "covers_admin_insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'covers' AND public.is_admin_or_super_admin());
CREATE POLICY "covers_admin_update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'covers' AND public.is_admin_or_super_admin());
CREATE POLICY "covers_admin_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'covers' AND public.is_admin_or_super_admin());

-- Ebooks: admin write only (downloads via signed URLs from edge function)
CREATE POLICY "ebooks_admin_insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'ebooks' AND public.is_admin_or_super_admin());
CREATE POLICY "ebooks_admin_update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'ebooks' AND public.is_admin_or_super_admin());
CREATE POLICY "ebooks_admin_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'ebooks' AND public.is_admin_or_super_admin());
