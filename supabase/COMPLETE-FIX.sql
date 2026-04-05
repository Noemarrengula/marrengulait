-- ============================================
-- SCRIPT COMPLETO DE CORREÇÃO SUPABASE
-- Marrengula-IT E-commerce Platform
-- Executar no SQL Editor do Supabase Dashboard
-- ============================================

-- ============================================
-- PASSO 1: REMOVER POLÍTICAS PROBLEMÁTICAS
-- ============================================

-- Products
DROP POLICY IF EXISTS "Allow admin all" ON products;
DROP POLICY IF EXISTS "Allow authenticated full access products" ON products;
DROP POLICY IF EXISTS "Allow authenticated read products" ON products;
DROP POLICY IF EXISTS "Allow public read" ON products;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Public read products" ON products;
DROP POLICY IF EXISTS "Public can view products" ON products;

-- Profiles
DROP POLICY IF EXISTS "Allow public read profiles" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated manage own profile" ON profiles;
DROP POLICY IF EXISTS "Public can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Wishlist
DROP POLICY IF EXISTS "Allow authenticated manage own wishlist" ON wishlist;
DROP POLICY IF EXISTS "Enable read access for all users" ON wishlist;
DROP POLICY IF EXISTS "Allow public read wishlist" ON wishlist;
DROP POLICY IF EXISTS "Allow all access wishlist" ON wishlist;
DROP POLICY IF EXISTS "Users can view own wishlist" ON wishlist;
DROP POLICY IF EXISTS "Users can add to wishlist" ON wishlist;
DROP POLICY IF EXISTS "Users can remove from wishlist" ON wishlist;

-- Orders
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;

-- Order Items
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;

-- Reviews
DROP POLICY IF EXISTS "Public can view reviews" ON reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;

-- Favorites
DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can add to favorites" ON favorites;
DROP POLICY IF EXISTS "Users can remove from favorites" ON favorites;

-- ============================================
-- PASSO 2: CRIAR TABELA WISHLIST SE NÃO EXISTIR
-- ============================================
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ============================================
-- PASSO 3: GARANTIR RLS ATIVO EM TODAS AS TABELAS
-- ============================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PASSO 4: POLÍTICAS PARA PRODUCTS
-- ============================================
DROP POLICY IF EXISTS "Public read all products" ON products;
CREATE POLICY "Public read all products" ON products FOR SELECT USING (true);

-- ============================================
-- PASSO 5: POLÍTICAS PARA PROFILES
-- ============================================
DROP POLICY IF EXISTS "Public read profiles" ON profiles;
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow all access to profiles" ON profiles;
CREATE POLICY "Allow all access to profiles" ON profiles FOR ALL USING (true);

-- ============================================
-- PASSO 6: POLÍTICAS PARA CATEGORIES
-- ============================================
DROP POLICY IF EXISTS "Public read categories" ON categories;
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);

-- ============================================
-- PASSO 7: POLÍTICAS PARA WISHLIST
-- ============================================
DROP POLICY IF EXISTS "Public read wishlist" ON wishlist;
CREATE POLICY "Public read wishlist" ON wishlist FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow all access wishlist" ON wishlist;
CREATE POLICY "Allow all access wishlist" ON wishlist FOR ALL USING (true);

-- ============================================
-- PASSO 8: POLÍTICAS PARA ORDERS
-- ============================================
DROP POLICY IF EXISTS "Users read own orders" ON orders;
CREATE POLICY "Users read own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users create orders" ON orders;
CREATE POLICY "Users create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users update own orders" ON orders;
CREATE POLICY "Users update own orders" ON orders FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- PASSO 9: POLÍTICAS PARA ORDER_ITEMS
-- ============================================
DROP POLICY IF EXISTS "Users read own order items" ON order_items;
CREATE POLICY "Users read own order items" ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- ============================================
-- PASSO 10: POLÍTICAS PARA REVIEWS
-- ============================================
DROP POLICY IF EXISTS "Public read reviews" ON reviews;
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users create reviews" ON reviews;
CREATE POLICY "Users create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users update own reviews" ON reviews;
CREATE POLICY "Users update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- PASSO 11: POLÍTICAS PARA FAVORITES
-- ============================================
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read own favorites" ON favorites;
CREATE POLICY "Users read own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users add favorites" ON favorites;
CREATE POLICY "Users add favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users remove own favorites" ON favorites;
CREATE POLICY "Users remove own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- PASSO 12: POLÍTICAS PARA VENDORS
-- ============================================
DROP POLICY IF EXISTS "Public read vendors" ON vendors;
CREATE POLICY "Public read vendors" ON vendors FOR SELECT USING (true);

-- ============================================
-- PASSO 13: POLÍTICAS PARA COUPONS
-- ============================================
DROP POLICY IF EXISTS "Public read coupons" ON coupons;
CREATE POLICY "Public read coupons" ON coupons FOR SELECT USING (true);

-- ============================================
-- VERIFICAÇÃO FINAL
-- ============================================
SELECT 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Verificar políticas criadas
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  cmd, 
  qual 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
