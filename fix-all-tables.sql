-- ============================================
-- CORRIGIR TODAS AS TABELAS E ROLES
-- ============================================

-- 1. VERIFICAR E CORRIGIR ROLE DO ADMIN
DELETE FROM user_roles WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'noemarrengula1@gmail.com'
);

INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'noemarrengula1@gmail.com';

-- 2. CRIAR TABELAS FALTANTES (service_requests e newsletter_subscribers)
CREATE TABLE IF NOT EXISTS service_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_type TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_created_at ON service_requests(created_at DESC);

ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Qualquer um pode solicitar serviço" ON service_requests;
CREATE POLICY "Qualquer um pode solicitar serviço" ON service_requests FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins veem solicitações" ON service_requests;
CREATE POLICY "Admins veem solicitações" ON service_requests FOR SELECT USING (true);

-- 3. CRIAR TABELA NEWSLETTER
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  active BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Qualquer um pode subscrever" ON newsletter_subscribers;
CREATE POLICY "Qualquer um pode subscrever" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins veem inscritos" ON newsletter_subscribers;
CREATE POLICY "Admins veem inscritos" ON newsletter_subscribers FOR SELECT USING (true);

-- 4. CRIAR TABELA ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number TEXT,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  shipping_address TEXT,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários veem seus pedidos" ON orders;
CREATE POLICY "Usuários veem seus pedidos" ON orders FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins veem todos pedidos" ON orders;
CREATE POLICY "Admins veem todos pedidos" ON orders FOR SELECT USING (true);

-- 5. VERIFICAR RESULTADO
SELECT 
  'Role corrigida!' as message,
  u.email,
  ur.role
FROM auth.users u
JOIN user_roles ur ON u.id = ur.user_id
WHERE u.email = 'noemarrengula1@gmail.com';
