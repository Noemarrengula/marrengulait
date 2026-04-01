-- ============================================================================
-- RESET COMPLETO E SETUP - MARRENGULA-IT
-- Este script LIMPA tudo e recria do zero
-- ⚠️ ATENÇÃO: Isso vai APAGAR todos os dados existentes!
-- ============================================================================

-- ============================================================================
-- PASSO 1: DESABILITAR RLS E REMOVER POLÍTICAS
-- ============================================================================

DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Remover todas as políticas
    FOR r IN (SELECT schemaname, tablename, policyname 
              FROM pg_policies 
              WHERE schemaname = 'public') 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                      r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- ============================================================================
-- PASSO 2: REMOVER TRIGGERS
-- ============================================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS set_order_number_trigger ON orders;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;

-- ============================================================================
-- PASSO 3: REMOVER FUNÇÕES
-- ============================================================================

DROP FUNCTION IF EXISTS promote_to_admin(TEXT);
DROP FUNCTION IF EXISTS is_admin(UUID);
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS generate_order_number();
DROP FUNCTION IF EXISTS set_order_number();
DROP FUNCTION IF EXISTS update_updated_at();

-- ============================================================================
-- PASSO 4: REMOVER TABELAS (na ordem reversa de dependência)
-- ============================================================================

DROP TABLE IF EXISTS public.loyalty_points CASCADE;
DROP TABLE IF EXISTS public.affiliates CASCADE;
DROP TABLE IF EXISTS public.coupons CASCADE;
DROP TABLE IF EXISTS public.price_alerts CASCADE;
DROP TABLE IF EXISTS public.product_questions CASCADE;
DROP TABLE IF EXISTS public.favorites CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.vendors CASCADE;
DROP TABLE IF EXISTS public.brands CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ============================================================================
-- PASSO 5: CRIAR EXTENSÕES
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- PASSO 6: CRIAR TABELAS NA ORDEM CORRETA
-- ============================================================================

-- 1. Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User Roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'customer',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- 3. Categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Brands
CREATE TABLE public.brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Vendors
CREATE TABLE public.vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  store_name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  sku TEXT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  stock INTEGER DEFAULT 0,
  image_url TEXT,
  images TEXT[],
  specifications JSONB DEFAULT '{}',
  tags TEXT[],
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_on_sale BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  sale_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  coupon_code TEXT,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  status TEXT DEFAULT 'pending',
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Order Items
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  product_title TEXT NOT NULL,
  product_image TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  images TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Favorites
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 11. Product Questions
CREATE TABLE public.product_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  answer TEXT,
  answered_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  answered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Price Alerts
CREATE TABLE public.price_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  target_price DECIMAL(10,2) NOT NULL,
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 13. Coupons
CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  min_purchase_amount DECIMAL(10,2) DEFAULT 0,
  usage_limit INTEGER,
  usage_limit_per_user INTEGER DEFAULT 1,
  usage_count INTEGER DEFAULT 0,
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Affiliates
CREATE TABLE public.affiliates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  commission_rate DECIMAL(5,2) DEFAULT 5.00,
  balance DECIMAL(10,2) DEFAULT 0,
  total_earned DECIMAL(10,2) DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Loyalty Points
CREATE TABLE public.loyalty_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  points INTEGER DEFAULT 0,
  lifetime_points INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'bronze',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PASSO 7: CRIAR ÍNDICES
-- ============================================================================

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_brands_slug ON brands(slug);
CREATE INDEX idx_vendors_user_id ON vendors(user_id);
CREATE INDEX idx_vendors_slug ON vendors(slug);
CREATE INDEX idx_products_vendor_id ON products(vendor_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);

-- ============================================================================
-- PASSO 8: CRIAR FUNÇÕES
-- ============================================================================

CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT)
RETURNS void AS $$
DECLARE
  user_uuid UUID;
BEGIN
  SELECT id INTO user_uuid FROM auth.users WHERE email = user_email;
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado: %', user_email;
  END IF;
  INSERT INTO public.user_roles (user_id, role, is_active)
  VALUES (user_uuid, 'admin', true)
  ON CONFLICT (user_id, role) DO UPDATE SET is_active = true;
  RAISE NOTICE '✅ Usuário % promovido a admin!', user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = p_user_id AND role = 'admin' AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (NEW.id);
  INSERT INTO public.user_roles (user_id, role, is_active) VALUES (NEW.id, 'customer', true);
  INSERT INTO public.loyalty_points (user_id, points, lifetime_points, tier) VALUES (NEW.id, 0, 0, 'bronze');
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  year_part TEXT;
  sequence_part TEXT;
BEGIN
  year_part := TO_CHAR(NOW(), 'YYYY');
  SELECT LPAD((COALESCE(COUNT(*), 0) + 1)::TEXT, 6, '0') INTO sequence_part
  FROM orders WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());
  new_number := 'ORD-' || year_part || '-' || sequence_part;
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PASSO 9: CRIAR TRIGGERS
-- ============================================================================

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER set_order_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION set_order_number();

-- ============================================================================
-- PASSO 10: CONFIGURAR RLS
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_all" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles_select_all" ON user_roles FOR SELECT USING (true);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_select_active" ON products FOR SELECT USING (is_active = true OR is_admin(auth.uid()));
CREATE POLICY "products_insert_auth" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "products_update_auth" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "products_delete_auth" ON products FOR DELETE USING (auth.role() = 'authenticated');

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_select_own" ON orders FOR SELECT USING (user_id = auth.uid() OR is_admin(auth.uid()));
CREATE POLICY "orders_insert_own" ON orders FOR INSERT WITH CHECK (user_id = auth.uid());

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_select_approved" ON reviews FOR SELECT USING (is_approved = true OR user_id = auth.uid() OR is_admin(auth.uid()));
CREATE POLICY "reviews_insert_own" ON reviews FOR INSERT WITH CHECK (user_id = auth.uid());

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "favorites_manage_own" ON favorites FOR ALL USING (user_id = auth.uid());

-- ============================================================================
-- PASSO 11: INSERIR DADOS INICIAIS
-- ============================================================================

INSERT INTO categories (name, slug, description, icon, is_active, is_featured, display_order) VALUES
('Computadores', 'computadores', 'Desktops e All-in-One', '🖥️', true, true, 1),
('Notebooks', 'notebooks', 'Laptops e Ultrabooks', '💻', true, true, 2),
('Componentes', 'componentes', 'Hardware de PC', '🔧', true, true, 3),
('Periféricos', 'perifericos', 'Teclados e Mouses', '⌨️', true, true, 4),
('Smartphones', 'smartphones', 'Celulares', '📱', true, true, 5),
('Gaming', 'gaming', 'Equipamentos Gamers', '🎮', true, true, 6),
('Áudio', 'audio', 'Fones e Caixas', '🎧', true, true, 7),
('Redes', 'redes', 'Roteadores', '🌐', true, false, 8),
('CCTV', 'cctv', 'Câmeras CCTV e sistemas de vigilância', '📹', true, true, 9);

INSERT INTO brands (name, slug, is_active) VALUES
('Dell', 'dell', true),
('HP', 'hp', true),
('Lenovo', 'lenovo', true),
('Asus', 'asus', true),
('Samsung', 'samsung', true),
('Apple', 'apple', true),
('Logitech', 'logitech', true),
('Razer', 'razer', true),
('Hikvision', 'hikvision', true),
('Intelbras', 'intelbras', true);

INSERT INTO coupons (code, description, discount_type, discount_value, min_purchase_amount, usage_limit_per_user, expires_at, is_active) VALUES
('BEMVINDO10', '10% de desconto para novos clientes', 'percentage', 10.00, 1000.00, 1, NOW() + INTERVAL '90 days', true),
('FRETEGRATIS', 'Frete grátis acima de MT 2000', 'free_shipping', 0, 2000.00, 3, NOW() + INTERVAL '60 days', true);

INSERT INTO products (vendor_id, category_id, brand_id, sku, title, slug, description, price, compare_at_price, stock, image_url, tags, is_active, is_featured, is_on_sale, rating, review_count, view_count, sale_count, favorite_count, created_at, updated_at)
SELECT
  NULL,
  c.id,
  b.id,
  'cctv-hikvision-4mp',
  'Câmera CCTV Hikvision 4MP',
  'camera-cctv-hikvision-4mp',
  'Câmera de vigilância IP 4MP com visão noturna, PoE e gravação remota.',
  7500.00,
  8500.00,
  30,
  'https://example.com/images/camera-cctv-hikvision-4mp.jpg',
  ARRAY['cctv','segurança','hikvision'],
  true,
  true,
  false,
  4.7,
  12,
  0,
  0,
  0,
  NOW(),
  NOW()
FROM categories c
JOIN brands b ON b.slug = 'hikvision'
WHERE c.slug = 'cctv'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (vendor_id, category_id, brand_id, sku, title, slug, description, price, compare_at_price, stock, image_url, tags, is_active, is_featured, is_on_sale, rating, review_count, view_count, sale_count, favorite_count, created_at, updated_at)
SELECT
  NULL,
  c.id,
  b.id,
  'cctv-intelbras-kit-4',
  'Kit CCTV Intelbras 4 Câmeras',
  'kit-cctv-intelbras-4-cameras',
  'Kit completo de videovigilância Intelbras com 4 câmeras, gravador digital e acesso remoto.',
  21900.00,
  24900.00,
  15,
  'https://example.com/images/kit-cctv-intelbras-4-cameras.jpg',
  ARRAY['cctv','segurança','intelbras'],
  true,
  true,
  false,
  4.6,
  8,
  0,
  0,
  0,
  NOW(),
  NOW()
FROM categories c
JOIN brands b ON b.slug = 'intelbras'
WHERE c.slug = 'cctv'
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- PASSO 12: VERIFICAÇÃO FINAL
-- ============================================================================

DO $$
DECLARE
  table_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count FROM information_schema.tables WHERE table_schema = 'public';
  
  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════════════════════';
  RAISE NOTICE '✅ RESET E SETUP COMPLETO!';
  RAISE NOTICE '═══════════════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Tabelas criadas: %', table_count;
  RAISE NOTICE '📦 Categorias: 9';
  RAISE NOTICE '🏷️  Marcas: 10';
  RAISE NOTICE '🎟️  Cupons: 2';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Próximo passo:';
  RAISE NOTICE 'SELECT promote_to_admin(''seu-email@exemplo.com'');';
  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════════════════════';
END $$;
