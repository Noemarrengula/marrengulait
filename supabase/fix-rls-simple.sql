-- ============================================
-- CORREÇÃO RLS SIMPLIFICADA
-- ============================================

-- PRODUCTS - Leitura pública
DROP POLICY IF EXISTS "Public can view products" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
CREATE POLICY "Allow public read" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can insert products" ON products;
DROP POLICY IF EXISTS "Admin can update products" ON products;
DROP POLICY IF EXISTS "Admin can delete products" ON products;
CREATE POLICY "Allow admin all" ON products FOR ALL USING (
  auth.role() = 'authenticated' AND 
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'vendor'))
);

-- CATEGORIES
DROP POLICY IF EXISTS "Public can view categories" ON categories;
CREATE POLICY "Allow public read categories" ON categories FOR SELECT USING (true);

-- REVIEWS
DROP POLICY IF EXISTS "Public can view reviews" ON reviews;
CREATE POLICY "Allow public read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Allow authenticated create reviews" ON reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- PROFILES
DROP POLICY IF EXISTS "Public can view profiles" ON profiles;
CREATE POLICY "Allow public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Allow authenticated manage own profile" ON profiles FOR ALL USING (auth.uid() = user_id);

-- ORDERS
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Allow authenticated read own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ORDER_ITEMS
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
CREATE POLICY "Allow authenticated read own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- WISHLIST
DROP POLICY IF EXISTS "Users can view own wishlist" ON wishlist;
CREATE POLICY "Allow authenticated manage own wishlist" ON wishlist FOR ALL USING (auth.uid() = user_id);

-- Verificar se RLS está ativo
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = true;
