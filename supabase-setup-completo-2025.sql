-- ============================================================================
-- MARRENGULA-IT - SETUP COMPLETO DO ZERO (2025)
-- Sistema E-commerce com Pagamentos para Moçambique
-- ============================================================================

-- PASSO 1: LIMPAR TUDO
-- ============================================================================
DO $$ 
DECLARE r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
    FOR r IN (SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public') LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS public.' || quote_ident(r.routine_name) || ' CASCADE';
    END LOOP;
END $$;

-- PASSO 2: EXTENSÕES
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- PASSO 3: TABELAS PRINCIPAIS
-- ============================================================================

-- Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Roles
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('customer', 'vendor', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brands
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  sku TEXT UNIQUE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(12,2) NOT NULL CHECK (price >= 0),
  compare_at_price DECIMAL(12,2),
  cost_price DECIMAL(12,2),
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  low_stock_threshold INTEGER DEFAULT 5,
  image_url TEXT,
  images TEXT[],
  specifications JSONB DEFAULT '{}',
  features TEXT[],
  tags TEXT[],
  weight DECIMAL(10,2),
  dimensions JSONB,
  warranty_months INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  sale_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Methods (M-Pesa, Banco, etc)
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  type TEXT NOT NULL CHECK (type IN ('mobile_money', 'bank_transfer', 'cash', 'card')),
  provider TEXT,
  config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  subtotal DECIMAL(12,2) NOT NULL,
  shipping_cost DECIMAL(12,2) DEFAULT 0,
  tax DECIMAL(12,2) DEFAULT 0,
  discount DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL,
  payment_method_id UUID REFERENCES payment_methods(id),
  payment_method_name TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'paid', 'failed', 'refunded')),
  payment_reference TEXT,
  payment_details JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  tracking_number TEXT,
  notes TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_title TEXT NOT NULL,
  product_sku TEXT,
  product_image TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(12,2) NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  images TEXT[],
  is_verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favorites
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Coupons
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_purchase_amount DECIMAL(12,2) DEFAULT 0,
  max_discount_amount DECIMAL(12,2),
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Messages
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PASSO 4: FUNÇÕES
-- ============================================================================

-- Gerar número de pedido
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'MG' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger para número de pedido
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number_trigger
BEFORE INSERT ON orders
FOR EACH ROW EXECUTE FUNCTION set_order_number();

-- Atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Criar perfil ao registrar
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, created_at)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NOW());
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Verificar se é admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = $1 AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Promover para admin
CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  target_user_id UUID;
BEGIN
  SELECT id INTO target_user_id FROM auth.users WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  INSERT INTO user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASSO 5: RLS (Row Level Security)
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Usuários podem ver próprio perfil" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Usuários podem atualizar próprio perfil" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins podem ver todos perfis" ON profiles FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Admins podem atualizar todos perfis" ON profiles FOR UPDATE USING (is_admin(auth.uid()));

-- User Roles
CREATE POLICY "Usuários podem ver próprias roles" ON user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins podem gerenciar roles" ON user_roles FOR ALL USING (is_admin(auth.uid()));

-- Categories (público para leitura)
CREATE POLICY "Todos podem ver categorias ativas" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admins podem gerenciar categorias" ON categories FOR ALL USING (is_admin(auth.uid()));

-- Brands (público para leitura)
CREATE POLICY "Todos podem ver marcas ativas" ON brands FOR SELECT USING (is_active = true);
CREATE POLICY "Admins podem gerenciar marcas" ON brands FOR ALL USING (is_admin(auth.uid()));

-- Products (público para leitura)
CREATE POLICY "Todos podem ver produtos ativos" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Admins podem gerenciar produtos" ON products FOR ALL USING (is_admin(auth.uid()));

-- Payment Methods (público para leitura)
CREATE POLICY "Todos podem ver métodos de pagamento ativos" ON payment_methods FOR SELECT USING (is_active = true);
CREATE POLICY "Admins podem gerenciar métodos de pagamento" ON payment_methods FOR ALL USING (is_admin(auth.uid()));

-- Orders
CREATE POLICY "Usuários podem ver próprios pedidos" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem criar pedidos" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins podem gerenciar todos pedidos" ON orders FOR ALL USING (is_admin(auth.uid()));

-- Order Items
CREATE POLICY "Usuários podem ver itens de próprios pedidos" ON order_items FOR SELECT 
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));
CREATE POLICY "Admins podem gerenciar todos itens" ON order_items FOR ALL USING (is_admin(auth.uid()));

-- Reviews
CREATE POLICY "Todos podem ver reviews aprovadas" ON reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Usuários podem criar reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar próprias reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins podem gerenciar reviews" ON reviews FOR ALL USING (is_admin(auth.uid()));

-- Favorites
CREATE POLICY "Usuários podem gerenciar próprios favoritos" ON favorites FOR ALL USING (auth.uid() = user_id);

-- Coupons (público para leitura de ativos)
CREATE POLICY "Todos podem ver cupons ativos" ON coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Admins podem gerenciar cupons" ON coupons FOR ALL USING (is_admin(auth.uid()));

-- Newsletter
CREATE POLICY "Qualquer um pode se inscrever" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins podem gerenciar newsletter" ON newsletter_subscribers FOR ALL USING (is_admin(auth.uid()));

-- Contact Messages
CREATE POLICY "Qualquer um pode enviar mensagem" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins podem gerenciar mensagens" ON contact_messages FOR ALL USING (is_admin(auth.uid()));

-- PASSO 6: DADOS INICIAIS
-- ============================================================================

-- Métodos de Pagamento para Moçambique
INSERT INTO payment_methods (code, name, description, type, provider, icon, display_order) VALUES
('mpesa', 'M-Pesa', 'Pagamento via M-Pesa (Vodacom)', 'mobile_money', 'vodacom', '📱', 1),
('emola', 'e-Mola', 'Pagamento via e-Mola (Mcel)', 'mobile_money', 'mcel', '📱', 2),
('mkesh', 'Mkesh', 'Pagamento via Mkesh (Movitel)', 'mobile_money', 'movitel', '📱', 3),
('bank_transfer', 'Transferência Bancária', 'Transferência para conta bancária', 'bank_transfer', null, '🏦', 4),
('cash_on_delivery', 'Pagamento na Entrega', 'Pague quando receber o produto', 'cash', null, '💵', 5);

-- Categorias Principais
INSERT INTO categories (name, slug, icon, display_order) VALUES
('Smartphones', 'smartphones', '📱', 1),
('Computadores', 'computadores', '💻', 2),
('Tablets', 'tablets', '📱', 3),
('Acessórios', 'acessorios', '🎧', 4),
('Gaming', 'gaming', '🎮', 5),
('Smart Home', 'smart-home', '🏠', 6),
('Áudio & Vídeo', 'audio-video', '🔊', 7),
('Redes', 'redes', '📡', 8);

-- Marcas Populares
INSERT INTO brands (name, slug) VALUES
('Samsung', 'samsung'),
('Apple', 'apple'),
('Xiaomi', 'xiaomi'),
('Huawei', 'huawei'),
('Lenovo', 'lenovo'),
('HP', 'hp'),
('Dell', 'dell'),
('Asus', 'asus'),
('Sony', 'sony'),
('LG', 'lg');

-- ============================================================================
-- SETUP COMPLETO! 
-- Próximo passo: Execute SELECT promote_to_admin('seu-email@exemplo.com');
-- ============================================================================
