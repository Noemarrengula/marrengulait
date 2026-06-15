-- ============================================
-- SEGURANÇA SUPABASE - Row Level Security
-- Execute no SQL Editor do Supabase Dashboard
-- ============================================

-- Verificar e criar tabelas básicas se não existirem
-- ATENÇÃO: Se as tabelas já existem, remove as linhas que dão erro

-- 1. HABILITAR RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 2. POLÍTICAS PARA PRODUCTS (públicas para leitura)
DROP POLICY IF EXISTS "Public can view products" ON products;
CREATE POLICY "Public can view products" ON products
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view categories" ON categories;
CREATE POLICY "Public can view categories" ON categories
FOR SELECT USING (true);

-- 3. POLÍTICAS PARA PROFILES
DROP POLICY IF EXISTS "Public can view profiles" ON profiles;
CREATE POLICY "Public can view profiles" ON profiles
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. POLÍTICAS PARA ORDERS
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create orders" ON orders;
CREATE POLICY "Users can create orders" ON orders
FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own orders" ON orders;
CREATE POLICY "Users can update own orders" ON orders
FOR UPDATE USING (auth.uid() = user_id);

-- 5. POLÍTICAS PARA ORDER_ITEMS
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
CREATE POLICY "Users can view own order items" ON order_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- 6. POLÍTICAS PARA REVIEWS
DROP POLICY IF EXISTS "Public can view reviews" ON reviews;
CREATE POLICY "Public can view reviews" ON reviews
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
CREATE POLICY "Users can create reviews" ON reviews
FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
CREATE POLICY "Users can update own reviews" ON reviews
FOR UPDATE USING (auth.uid() = user_id);

-- 7. CRIAR TABELA WISHLIST se não existir
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own wishlist" ON wishlist;
CREATE POLICY "Users can view own wishlist" ON wishlist
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can add to wishlist" ON wishlist;
CREATE POLICY "Users can add to wishlist" ON wishlist
FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove from wishlist" ON wishlist;
CREATE POLICY "Users can remove from wishlist" ON wishlist
FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- VERIFICAR
-- ============================================
SELECT 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
