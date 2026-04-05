-- ============================================
-- DIAGNÓSTICO E CORREÇÃO DE RLS
-- Execute no SQL Editor do Supabase
-- ============================================

-- 1. VERIFICAR QUAIS TABELAS TÊM DADOS
SELECT 'products' as table_name, count(*) as row_count FROM products
UNION ALL
SELECT 'categories', count(*) FROM categories
UNION ALL
SELECT 'reviews', count(*) FROM reviews;

-- 2. VERIFICAR POLÍTICAS EXISTENTES
SELECT 
  schemaname,
  tablename, 
  policyname, 
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 3. REMOVER TODAS AS POLÍTICAS ANTIGAS E CRIAR NOVAS
-- ATENÇÃO: Isto pode afectar permissões existentes

-- PRODUCTS - Permitir leitura pública para todos
DROP POLICY IF EXISTS "Public can view products" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
CREATE POLICY "Allow public read" ON products
FOR SELECT USING (true);

-- PRODUCTS - Permitir escrita apenas para authenticated users (admin)
DROP POLICY IF EXISTS "Admin can insert products" ON products;
DROP POLICY IF EXISTS "Admin can update products" ON products;
DROP POLICY IF EXISTS "Admin can delete products" ON products;
CREATE POLICY "Allow admin all" ON products
FOR ALL USING (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'vendor')
  )
);

-- CATEGORIES
DROP POLICY IF EXISTS "Public can view categories" ON categories;
DROP POLICY IF EXISTS "Enable read access for all users" ON categories;
CREATE POLICY "Allow public read categories" ON categories
FOR SELECT USING (true);

-- REVIEWS - Ler todos, escrever só com login
DROP POLICY IF EXISTS "Public can view reviews" ON reviews;
DROP POLICY IF EXISTS "Enable read access for all users" ON reviews;
CREATE POLICY "Allow public read reviews" ON reviews
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
CREATE POLICY "Allow authenticated create reviews" ON reviews
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
CREATE POLICY "Allow authenticated update own reviews" ON reviews
FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own reviews" ON reviews;
CREATE POLICY "Allow authenticated delete own reviews" ON reviews
FOR DELETE USING (auth.uid() = user_id);

-- PROFILES
DROP POLICY IF EXISTS "Public can view profiles" ON profiles;
CREATE POLICY "Allow public read profiles" ON profiles
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Allow authenticated manage own profile" ON profiles
FOR ALL USING (auth.uid() = user_id);

-- ORDERS
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Allow authenticated read own orders" ON orders
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create orders" ON orders;
CREATE POLICY "Allow authenticated create orders" ON orders
FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own orders" ON orders;
CREATE POLICY "Allow authenticated update own orders" ON orders
FOR UPDATE USING (auth.uid() = user_id);

-- ORDER_ITEMS
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
CREATE POLICY "Allow authenticated read own order items" ON order_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- WISHLIST / FAVORITES
DROP POLICY IF EXISTS "Users can view own wishlist" ON wishlist;
DROP POLICY IF EXISTS "Users can add to wishlist" ON wishlist;
DROP POLICY IF EXISTS "Users can remove from wishlist" ON wishlist;
DROP POLICY IF EXISTS "Enable read access for all users" ON wishlist;

CREATE POLICY "Allow authenticated manage own wishlist" ON wishlist
FOR ALL USING (auth.uid() = user_id);

-- VENDORS
DROP POLICY IF EXISTS "Public can view vendors" ON vendors;
CREATE POLICY "Allow public read vendors" ON vendors
FOR SELECT USING (true);

-- COUPONS
DROP POLICY IF EXISTS "Public can view coupons" ON coupons;
CREATE POLICY "Allow public read active coupons" ON coupons
FOR SELECT USING (is_active = true);

-- 4. GARANTIR QUE RLS ESTÁ ATIVO
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- 5. VERIFICAR RESULTADO
SELECT 
  tablename, 
  rowsecurity,
  rowsegcount
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('products', 'categories', 'reviews', 'profiles', 'orders', 'wishlist')
ORDER BY tablename;
