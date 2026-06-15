-- ============================================================================
-- SETUP INCREMENTAL SUPABASE - MARRENGULA-IT
-- Este script verifica e cria apenas o que está faltando
-- ============================================================================

-- PASSO 1: Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- PASSO 2: Verificar e criar tabelas base
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'Moçambique',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role TEXT NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  store_name TEXT NOT NULL,
  store_description TEXT,
  store_logo TEXT,
  store_banner TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  store_name TEXT DEFAULT 'MarrengulaIT',
  image_url TEXT,
  brand TEXT,
  model TEXT,
  featured BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_country TEXT DEFAULT 'Moçambique',
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  status TEXT DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  coupon_code TEXT,
  notes TEXT,
  tracking_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_title TEXT NOT NULL,
  product_image TEXT,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  verified_purchase BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  answer TEXT,
  answered_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  answered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.price_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  target_price DECIMAL(10,2) NOT NULL,
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  min_purchase DECIMAL(10,2) DEFAULT 0,
  max_discount DECIMAL(10,2),
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.affiliates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  commission_rate DECIMAL(5,2) DEFAULT 5.00,
  balance DECIMAL(10,2) DEFAULT 0,
  total_earned DECIMAL(10,2) DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.loyalty_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  lifetime_points INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'bronze',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  badge_icon TEXT,
  badge_color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PASSO 3: Adicionar constraints únicos (ignorar se já existem)
DO $$ 
BEGIN
    ALTER TABLE categories ADD CONSTRAINT categories_name_key UNIQUE (name);
EXCEPTION WHEN duplicate_table THEN NULL;
END $$;

DO $$ 
BEGIN
    ALTER TABLE categories ADD CONSTRAINT categories_slug_key UNIQUE (slug);
EXCEPTION WHEN duplicate_table THEN NULL;
END $$;

DO $$ 
BEGIN
    ALTER TABLE coupons ADD CONSTRAINT coupons_code_key UNIQUE (code);
EXCEPTION WHEN duplicate_table THEN NULL;
END $$;

-- PASSO 4: Índices
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);

-- PASSO 5: Função promote_to_admin
CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT)
RETURNS void AS $$
DECLARE
  user_uuid UUID;
BEGIN
  SELECT id INTO user_uuid FROM auth.users WHERE email = user_email;
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado: %', user_email;
  END IF;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (user_uuid, 'admin')
  ON CONFLICT (user_id) DO UPDATE SET role = 'admin', updated_at = NOW();
  RAISE NOTICE 'Usuário % promovido a admin!', user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASSO 6: Trigger para novos usuários
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, user_id) VALUES (NEW.id, NEW.id);
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer');
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- PASSO 7: RLS básico
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products_public" ON products;
CREATE POLICY "products_public" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "products_auth" ON products;
CREATE POLICY "products_auth" ON products FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "orders_own" ON orders;
CREATE POLICY "orders_own" ON orders FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_roles_read" ON user_roles;
CREATE POLICY "user_roles_read" ON user_roles FOR SELECT USING (true);

-- PASSO 8: Dados iniciais
INSERT INTO categories (name, slug, description, icon) VALUES
('Hardware', 'hardware', 'Componentes', '💻'),
('Software', 'software', 'Programas', '💿'),
('Smartphones', 'smartphones', 'Celulares', '📱'),
('Notebooks', 'notebooks', 'Laptops', '💻'),
('Acessórios', 'acessorios', 'Periféricos', '🔌'),
('Gaming', 'gaming', 'Games', '🎮'),
('Redes', 'redes', 'Rede', '🌐'),
('Servidores', 'servidores', 'Servidores', '🖥️')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO product_badges (badge_name, badge_description, badge_icon, badge_color) VALUES
('Novo', 'Produto novo', '🆕', '#10b981'),
('Promoção', 'Em promoção', '🔥', '#ef4444'),
('Mais Vendido', 'Mais vendido', '⭐', '#f59e0b'),
('Frete Grátis', 'Frete grátis', '🚚', '#3b82f6'),
('Exclusivo', 'Exclusivo', '💎', '#8b5cf6')
ON CONFLICT DO NOTHING;

-- PASSO 9: Verificação final
SELECT 
    'Tabelas criadas' as status,
    COUNT(*) as total
FROM information_schema.tables 
WHERE table_schema = 'public';

-- ============================================================================
-- ✅ SETUP COMPLETO!
-- ============================================================================
