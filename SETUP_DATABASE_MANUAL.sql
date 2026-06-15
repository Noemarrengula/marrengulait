-- ============================================================================
-- INSTRUÇÕES DE CONFIGURAÇÃO DA BASE DE DADOS
-- ============================================================================
-- 
-- Por favor, execute este script diretamente no SQL Editor do Supabase:
-- 1. Aceda a: https://app.supabase.com
-- 2. Selecione seu projeto: jmefqzhoumdcgcxtdssu
-- 3. Vá para SQL Editor
-- 4. Cole o conteúdo deste ficheiro
-- 5. Clique em "Run"
--
-- ============================================================================

-- PARTE 1: ENUMS E TABELAS DE AUTENTICAÇÃO
-- ============================================================================

CREATE TYPE app_role AS ENUM ('admin', 'vendor', 'user');

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Índices de Utilização
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- PARTE 2: TABELAS DO E-COMMERCE
-- ============================================================================

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  old_price DECIMAL(10, 2),
  image_url TEXT,
  category TEXT,
  brand TEXT,
  stock INTEGER DEFAULT 0,
  store_name TEXT,
  featured BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  delivery_address TEXT NOT NULL,
  delivery_city TEXT NOT NULL,
  delivery_province TEXT,
  delivery_postal_code TEXT,
  payment_method TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  total_amount DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  product_title TEXT NOT NULL,
  product_image TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  store_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para E-commerce
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- PARTE 3: FUNCIONALIDADES AVANÇADAS
-- ============================================================================

CREATE TABLE IF NOT EXISTS product_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  answer TEXT,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  answered_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  old_price DECIMAL(10, 2),
  new_price DECIMAL(10, 2) NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recently_viewed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE TABLE IF NOT EXISTS loyalty_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INTEGER DEFAULT 0,
  lifetime_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS points_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  target_price DECIMAL(10, 2) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  notified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE TABLE IF NOT EXISTS product_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  badge_name TEXT NOT NULL,
  badge_color TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('credit_card', 'debit_card', 'paypal', 'stripe', 'wallet')),
  details JSONB NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices Avançados
CREATE INDEX IF NOT EXISTS idx_product_questions_product_id ON product_questions(product_id);
CREATE INDEX IF NOT EXISTS idx_recently_viewed_user_id ON recently_viewed(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_points_user_id ON loyalty_points(user_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_user_id ON points_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_user_id ON price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_product_id ON price_alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_product_badges_product_id ON product_badges(product_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);

-- PARTE 4: AFILIADOS
-- ============================================================================

CREATE TABLE IF NOT EXISTS affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  affiliate_code TEXT NOT NULL UNIQUE,
  commission_rate DECIMAL(5, 2) DEFAULT 5.00,
  total_clicks INTEGER DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  total_earnings DECIMAL(10, 2) DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_affiliates_user_id ON affiliates(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_code ON affiliates(affiliate_code);

-- PARTE 5: FUNÇÕES SQL
-- ============================================================================

-- Função para verificar papéis
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = _user_id AND role = _role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para rastrear visualizações
CREATE OR REPLACE FUNCTION track_product_view(p_product_id UUID, p_user_id UUID DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
  UPDATE products SET views_count = views_count + 1 WHERE id = p_product_id;
  
  IF p_user_id IS NOT NULL THEN
    INSERT INTO recently_viewed (user_id, product_id, viewed_at)
    VALUES (p_user_id, p_product_id, NOW())
    ON CONFLICT (user_id, product_id) DO UPDATE SET viewed_at = NOW();
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para criar pedidos
CREATE OR REPLACE FUNCTION create_order(
  p_customer_name TEXT,
  p_customer_email TEXT,
  p_delivery_address TEXT,
  p_delivery_city TEXT,
  p_payment_method TEXT,
  p_user_id UUID DEFAULT NULL,
  p_customer_phone TEXT DEFAULT NULL,
  p_delivery_province TEXT DEFAULT NULL,
  p_delivery_postal_code TEXT DEFAULT NULL,
  p_notes TEXT DEFAULT NULL,
  p_items JSONB DEFAULT '[]'::jsonb
)
RETURNS TABLE (order_id UUID, success BOOLEAN, message TEXT) AS $$
DECLARE
  v_order_id UUID;
  v_item JSONB;
  v_total DECIMAL(10, 2) := 0;
BEGIN
  INSERT INTO orders (
    user_id, customer_name, customer_email, customer_phone,
    delivery_address, delivery_city, delivery_province,
    delivery_postal_code, payment_method, notes
  ) VALUES (
    p_user_id, p_customer_name, p_customer_email, p_customer_phone,
    p_delivery_address, p_delivery_city, p_delivery_province,
    p_delivery_postal_code, p_payment_method, p_notes
  ) RETURNING id INTO v_order_id;

  FOR v_item IN SELECT jsonb_array_elements(p_items)
  LOOP
    INSERT INTO order_items (
      order_id, product_id, product_title, product_image,
      quantity, unit_price, store_name
    ) VALUES (
      v_order_id,
      (v_item->>'product_id')::UUID,
      v_item->>'product_title',
      v_item->>'product_image',
      (v_item->>'quantity')::INTEGER,
      (v_item->>'unit_price')::DECIMAL(10, 2),
      v_item->>'store_name'
    );
    
    v_total := v_total + ((v_item->>'quantity')::INTEGER * (v_item->>'unit_price')::DECIMAL(10, 2));
  END LOOP;

  UPDATE orders SET total_amount = v_total WHERE id = v_order_id;

  RETURN QUERY SELECT v_order_id, TRUE, 'Pedido criado com sucesso'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para criar afiliados
CREATE OR REPLACE FUNCTION create_affiliate(target_user_id UUID)
RETURNS TABLE (affiliate_id UUID, affiliate_code TEXT) AS $$
DECLARE
  v_code TEXT;
  v_affiliate_id UUID;
BEGIN
  v_code := 'AFF_' || SUBSTR(target_user_id::TEXT, 1, 8) || '_' || TO_CHAR(NOW(), 'YYMMDDHHmm');
  
  INSERT INTO affiliates (user_id, affiliate_code)
  VALUES (target_user_id, v_code)
  RETURNING id INTO v_affiliate_id;
  
  RETURN QUERY SELECT v_affiliate_id, v_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PARTE 6: ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE recently_viewed ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;

-- Policies para Profiles
CREATE POLICY "Profiles são públicas" ON profiles FOR SELECT USING (true);
CREATE POLICY "Utilizadores podem atualizar seu próprio perfil" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Utilizadores podem inserir seu próprio perfil" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies para User Roles
CREATE POLICY "User roles visíveis para admins e owner" ON user_roles FOR SELECT USING (
  has_role(auth.uid(), 'admin') OR auth.uid() = user_id
);
CREATE POLICY "Apenas admins podem inserir roles" ON user_roles FOR INSERT WITH CHECK (
  has_role(auth.uid(), 'admin')
);
CREATE POLICY "Apenas admins podem atualizar roles" ON user_roles FOR UPDATE USING (
  has_role(auth.uid(), 'admin')
);
CREATE POLICY "Apenas admins podem deletar roles" ON user_roles FOR DELETE USING (
  has_role(auth.uid(), 'admin')
);

-- Policies para Produtos
CREATE POLICY "Produtos públicos para leitura" ON products FOR SELECT USING (true);
CREATE POLICY "Apenas admins/vendors criam produtos" ON products FOR INSERT WITH CHECK (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'vendor')
);
CREATE POLICY "Apenas admins/vendors atualizam" ON products FOR UPDATE USING (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'vendor')
);
CREATE POLICY "Apenas admins deletam produtos" ON products FOR DELETE USING (
  has_role(auth.uid(), 'admin')
);

-- Policies para Orders
CREATE POLICY "Utilizadores veem seus pedidos" ON orders FOR SELECT USING (
  auth.uid() = user_id OR has_role(auth.uid(), 'admin')
);
CREATE POLICY "Utilizadores criam pedidos" ON orders FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL
);
CREATE POLICY "Admins atualizam pedidos" ON orders FOR UPDATE USING (
  has_role(auth.uid(), 'admin')
);

-- Policies para Order Items
CREATE POLICY "Vê itens de seus pedidos" ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id AND 
    (orders.user_id = auth.uid() OR has_role(auth.uid(), 'admin'))
  )
);

-- Policies para Product Questions
CREATE POLICY "Perguntas públicas" ON product_questions FOR SELECT USING (true);
CREATE POLICY "Autenticados fazem perguntas" ON product_questions FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL
);

-- Policies para Recently Viewed
CREATE POLICY "Vê seu histórico" ON recently_viewed FOR SELECT USING (
  auth.uid() = user_id
);
CREATE POLICY "Insere seu histórico" ON recently_viewed FOR INSERT WITH CHECK (
  auth.uid() = user_id
);
CREATE POLICY "Atualiza seu histórico" ON recently_viewed FOR UPDATE USING (
  auth.uid() = user_id
);

-- Policies para Loyalty Points
CREATE POLICY "Vê seus pontos" ON loyalty_points FOR SELECT USING (
  auth.uid() = user_id OR has_role(auth.uid(), 'admin')
);

-- Policies para Points Transactions
CREATE POLICY "Vê suas transações" ON points_transactions FOR SELECT USING (
  auth.uid() = user_id OR has_role(auth.uid(), 'admin')
);

-- Policies para Price Alerts
CREATE POLICY "Vê seus alertas" ON price_alerts FOR SELECT USING (
  auth.uid() = user_id
);
CREATE POLICY "Cria alertas" ON price_alerts FOR INSERT WITH CHECK (
  auth.uid() = user_id
);
CREATE POLICY "Modifica seus alertas" ON price_alerts FOR UPDATE USING (
  auth.uid() = user_id
);
CREATE POLICY "Delete seus alertas" ON price_alerts FOR DELETE USING (
  auth.uid() = user_id
);

-- Policies para Payment Methods
CREATE POLICY "Vê seus métodos de pagamento" ON payment_methods FOR SELECT USING (
  auth.uid() = user_id
);
CREATE POLICY "Adiciona métodos de pagamento" ON payment_methods FOR INSERT WITH CHECK (
  auth.uid() = user_id
);
CREATE POLICY "Atualiza seus métodos de pagamento" ON payment_methods FOR UPDATE USING (
  auth.uid() = user_id
);
CREATE POLICY "Delete seus métodos de pagamento" ON payment_methods FOR DELETE USING (
  auth.uid() = user_id
);

-- Policies para Affiliates
CREATE POLICY "Afiliados veem seus dados" ON affiliates FOR SELECT USING (
  auth.uid() = user_id OR has_role(auth.uid(), 'admin')
);
CREATE POLICY "Sistema cria afiliados" ON affiliates FOR INSERT WITH CHECK (
  auth.uid() = user_id
);
CREATE POLICY "Afiliados atualizam seus dados" ON affiliates FOR UPDATE USING (
  auth.uid() = user_id OR has_role(auth.uid(), 'admin')
);

-- PARTE 7: TRIGGERS PARA AUTOMAÇÃO
-- ============================================================================

-- Trigger profiles
CREATE OR REPLACE FUNCTION update_profiles_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_update_timestamp ON profiles;
CREATE TRIGGER profiles_update_timestamp
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_profiles_timestamp();

-- Trigger orders
CREATE OR REPLACE FUNCTION update_orders_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_update_timestamp ON orders;
CREATE TRIGGER orders_update_timestamp
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_orders_timestamp();

-- Trigger products
CREATE OR REPLACE FUNCTION update_products_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_update_timestamp ON products;
CREATE TRIGGER products_update_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_products_timestamp();

-- Trigger para sincronizar novo utilizador
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, user_id)
  VALUES (NEW.id, NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- CONFIGURAÇÃO COMPLETA!
-- ============================================================================
-- 
-- A base de dados está agora totalmente configurada e pronta para usar.
-- Todos as tabelas, funções, índices, RLS policies e triggers foram criados.
--
-- Para testar a integração, execute seu projeto React:
--   npm run dev
--
-- ============================================================================
