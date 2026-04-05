-- ============================================
-- SCRIPT COMPLETO DE CORREÇÃO SUPABASE
-- Marrengula-IT E-commerce Platform
-- Executar no SQL Editor do Supabase Dashboard
-- ============================================

-- ============================================
-- PASSO 1: POLÍTICAS PARA PRODUCTS
-- ============================================
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public read all products" ON products;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
CREATE POLICY "Public read all products" ON products FOR SELECT USING (true);

-- ============================================
-- PASSO 2: POLÍTICAS PARA PROFILES
-- ============================================
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public read profiles" ON profiles;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);

DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow all access to profiles" ON profiles;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
CREATE POLICY "Allow all access to profiles" ON profiles FOR ALL USING (true);

-- ============================================
-- PASSO 3: POLÍTICAS PARA CATEGORIES
-- ============================================
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public read categories" ON categories;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);

-- ============================================
-- PASSO 4: POLÍTICAS PARA WISHLIST
-- ============================================
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public read wishlist" ON wishlist;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
CREATE POLICY "Public read wishlist" ON wishlist FOR SELECT USING (true);

DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow all access wishlist" ON wishlist;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
CREATE POLICY "Allow all access wishlist" ON wishlist FOR ALL USING (true);

-- ============================================
-- PASSO 5: POLÍTICAS PARA ORDERS
-- ============================================
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users read own orders" ON orders;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
CREATE POLICY "Users read own orders" ON orders FOR SELECT USING (auth.uid() = user_id);

DO $$
BEGIN
  DROP POLICY IF EXISTS "Users create orders" ON orders;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
CREATE POLICY "Users create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

DO $$
BEGIN
  DROP POLICY IF EXISTS "Users update own orders" ON orders;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
CREATE POLICY "Users update own orders" ON orders FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- PASSO 6: POLÍTICAS PARA ORDER_ITEMS
-- ============================================
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users read own order items" ON order_items;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
CREATE POLICY "Users read own order items" ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- ============================================
-- PASSO 7: POLÍTICAS PARA REVIEWS
-- ============================================
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public read reviews" ON reviews;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);

DO $$
BEGIN
  DROP POLICY IF EXISTS "Users create reviews" ON reviews;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
CREATE POLICY "Users create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

DO $$
BEGIN
  DROP POLICY IF EXISTS "Users update own reviews" ON reviews;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
CREATE POLICY "Users update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- PASSO 8: POLÍTICAS PARA FAVORITES
-- ============================================
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  DROP POLICY IF EXISTS "Users read own favorites" ON favorites;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
CREATE POLICY "Users read own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);

DO $$
BEGIN
  DROP POLICY IF EXISTS "Users add favorites" ON favorites;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
CREATE POLICY "Users add favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

DO $$
BEGIN
  DROP POLICY IF EXISTS "Users remove own favorites" ON favorites;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
CREATE POLICY "Users remove own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- PASSO 9: POLÍTICAS PARA VENDORS
-- ============================================
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public read vendors" ON vendors;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
CREATE POLICY "Public read vendors" ON vendors FOR SELECT USING (true);

-- ============================================
-- PASSO 10: POLÍTICAS PARA COUPONS
-- ============================================
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public read coupons" ON coupons;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
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
