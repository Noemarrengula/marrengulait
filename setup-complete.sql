-- ============================================
-- SCRIPT COMPLETO DE SETUP - MARRENGULA-IT
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- 1. TABELA DE PRODUTOS
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  old_price DECIMAL(10, 2),
  image_url TEXT,
  category TEXT,
  brand TEXT,
  rating DECIMAL(2, 1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 0,
  store_name TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Produtos são públicos" ON products;
CREATE POLICY "Produtos são públicos" ON products FOR SELECT USING (true);

-- 2. TABELA DE FAVORITOS
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários veem seus favoritos" ON favorites;
CREATE POLICY "Usuários veem seus favoritos" ON favorites FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem adicionar favoritos" ON favorites;
CREATE POLICY "Usuários podem adicionar favoritos" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem remover favoritos" ON favorites;
CREATE POLICY "Usuários podem remover favoritos" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- 3. TABELA DE PEDIDOS
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_address JSONB NOT NULL,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários veem seus pedidos" ON orders;
CREATE POLICY "Usuários veem seus pedidos" ON orders FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem criar pedidos" ON orders;
CREATE POLICY "Usuários podem criar pedidos" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. TABELA DE ITENS DO PEDIDO
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  product_snapshot JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários veem itens de seus pedidos" ON order_items;
CREATE POLICY "Usuários veem itens de seus pedidos" ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

-- 5. TABELA DE SOLICITAÇÕES DE SERVIÇOS
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

-- 6. TABELA DE NEWSLETTER
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

-- 7. INSERIR PRODUTOS DE EXEMPLO
INSERT INTO products (title, description, price, old_price, image_url, category, brand, rating, reviews_count, stock, store_name, featured) VALUES
('Laptop HP ProBook 450 G10', 'Intel Core i7 13th Gen, 16GB RAM, 512GB SSD, Windows 11 Pro', 89999.00, 105000.00, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800', 'Laptops', 'HP', 4.5, 127, 15, 'TechStore Maputo', true),
('NVIDIA GeForce RTX 4070 Ti', '12GB GDDR6X, Ray Tracing, DLSS 3.0', 72500.00, NULL, 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800', 'Hardware', 'NVIDIA', 5.0, 189, 8, 'Hardware Pro', true),
('Samsung 27" Monitor Curvo', '144Hz Gaming, 1ms, FreeSync Premium, WQHD', 18900.00, 22000.00, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800', 'Monitores', 'Samsung', 4.0, 567, 23, 'Display Tech', false),
('Teclado Mecânico RGB Logitech G915', 'TKL Wireless, Low Profile, LIGHTSPEED', 12500.00, NULL, 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800', 'Acessórios', 'Logitech', 5.0, 342, 45, 'Periféricos MZ', true),
('Dell XPS 15', 'Intel i9, 32GB RAM, 1TB SSD, RTX 4060', 145000.00, 160000.00, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800', 'Laptops', 'Dell', 4.8, 234, 7, 'Premium Tech', true),
('Mouse Razer DeathAdder V3', 'Wireless, 30K DPI, 90h bateria', 4500.00, 5200.00, 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800', 'Acessórios', 'Razer', 4.7, 891, 67, 'Gaming Store', false),
('SSD Samsung 990 PRO 2TB', 'NVMe PCIe 4.0, 7450MB/s leitura', 15800.00, NULL, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800', 'Hardware', 'Samsung', 5.0, 445, 34, 'Storage Pro', false),
('Webcam Logitech C920 HD Pro', 'Full HD 1080p, 30fps, Microfone estéreo', 3200.00, 3800.00, 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800', 'Acessórios', 'Logitech', 4.3, 678, 89, 'Periféricos MZ', false),
('MacBook Pro 14" M3', 'Apple M3 Pro, 18GB RAM, 512GB SSD', 185000.00, NULL, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', 'Laptops', 'Apple', 4.9, 456, 5, 'Apple Store MZ', true),
('Headset HyperX Cloud II', 'Gaming, 7.1 Surround, USB', 6800.00, 7500.00, 'https://images.unsplash.com/photo-1599669454699-248893623440?w=800', 'Acessórios', 'HyperX', 4.6, 1234, 56, 'Gaming Store', false),
('Processador AMD Ryzen 9 7950X', '16-Core, 32-Thread, 5.7GHz', 45000.00, NULL, 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800', 'Hardware', 'AMD', 4.8, 234, 12, 'Hardware Pro', true),
('Impressora HP LaserJet Pro', 'M404dn, Duplex automático, Rede', 28500.00, 32000.00, 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800', 'Impressoras', 'HP', 4.2, 345, 18, 'Office Tech', false)
ON CONFLICT DO NOTHING;

-- 8. VERIFICAÇÃO
SELECT 'Setup completo! Total de produtos:' as message, COUNT(*) as total FROM products;
