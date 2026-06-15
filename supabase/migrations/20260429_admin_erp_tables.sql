-- Migration: Admin ERP tables (Supabase managed)
-- Created: 2026-04-29
-- NOTE: Does NOT depend on has_role() function

-- 1. Create admin_settings table (key-value JSONB)
CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- 2. Create content_banners table
CREATE TABLE IF NOT EXISTS content_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  image_url text,
  link_url text,
  active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Create activity_log table
CREATE TABLE IF NOT EXISTS activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  entity text NOT NULL,
  entity_id text,
  details text,
  user_email text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_log_entity_created ON activity_log (entity, created_at);

-- 4. Ensure coupons table has all required columns
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coupons' AND column_name = 'code') THEN
    ALTER TABLE coupons ADD COLUMN code text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coupons' AND column_name = 'type') THEN
    ALTER TABLE coupons ADD COLUMN type text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coupons' AND column_name = 'value') THEN
    ALTER TABLE coupons ADD COLUMN value numeric;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coupons' AND column_name = 'min_order') THEN
    ALTER TABLE coupons ADD COLUMN min_order numeric DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coupons' AND column_name = 'max_uses') THEN
    ALTER TABLE coupons ADD COLUMN max_uses integer DEFAULT 100;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coupons' AND column_name = 'used_count') THEN
    ALTER TABLE coupons ADD COLUMN used_count integer DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coupons' AND column_name = 'expiry_date') THEN
    ALTER TABLE coupons ADD COLUMN expiry_date timestamptz;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coupons' AND column_name = 'active') THEN
    ALTER TABLE coupons ADD COLUMN active boolean DEFAULT true;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coupons' AND column_name = 'created_at') THEN
    ALTER TABLE coupons ADD COLUMN created_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Helper: check if current user is admin (no has_role dependency)
CREATE OR REPLACE FUNCTION public._is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Enable RLS
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- admin_settings: admin full access, authenticated read
CREATE POLICY "admin_settings_admin_all" ON admin_settings
  FOR ALL USING (public._is_admin()) WITH CHECK (public._is_admin());

CREATE POLICY "admin_settings_auth_read" ON admin_settings
  FOR SELECT USING (auth.role() = 'authenticated');

-- content_banners: admin full access, everyone read active
CREATE POLICY "content_banners_admin_all" ON content_banners
  FOR ALL USING (public._is_admin()) WITH CHECK (public._is_admin());

CREATE POLICY "content_banners_public_read" ON content_banners
  FOR SELECT USING (active = true);

-- activity_log: admin only
CREATE POLICY "activity_log_admin_all" ON activity_log
  FOR ALL USING (public._is_admin()) WITH CHECK (public._is_admin());

-- coupons: admin full access, authenticated read active
CREATE POLICY "coupons_admin_all" ON coupons
  FOR ALL USING (public._is_admin()) WITH CHECK (public._is_admin());

CREATE POLICY "coupons_auth_read" ON coupons
  FOR SELECT USING (auth.role() = 'authenticated' AND active = true);

-- Default site settings
INSERT INTO admin_settings (key, value)
VALUES (
  'site_settings',
  '{
    "siteName": "Marrengula-IT",
    "whatsappNumber": "+258840000000",
    "email": "info@marrengula.co.mz",
    "address": "Maputo, Moçambique",
    "freeShippingThreshold": 5000,
    "currency": "MZN",
    "taxRate": 17,
    "mpesaEnabled": true,
    "emolaEnabled": true,
    "cashEnabled": true,
    "heroTitle": "TECNOLOGIA DE PONTA",
    "heroSubtitle": "Monte seu PC gamer, encontre os melhores smartphones e componentes com entrega rápida em Moçambique",
    "showMayBanner": true
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;
