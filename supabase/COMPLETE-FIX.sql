-- ============================================
-- SCRIPT COMPLETO DE CORREÇÃO SUPABASE
-- Marrengula-IT E-commerce Platform
-- ============================================

-- Primeiro, ver políticas existentes
SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public';

-- ============================================
-- APAGAR TODAS AS POLÍTICAS EXISTENTES
-- ============================================
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- ============================================
-- CRIAR POLÍTICAS LIMPAS
-- ============================================

-- Products
CREATE POLICY "public_read_products" ON products FOR SELECT USING (true);

-- Profiles
CREATE POLICY "public_read_profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "all_access_profiles" ON profiles FOR ALL USING (true);

-- Categories
CREATE POLICY "public_read_categories" ON categories FOR SELECT USING (true);

-- Wishlist
CREATE POLICY "public_read_wishlist" ON wishlist FOR SELECT USING (true);
CREATE POLICY "all_access_wishlist" ON wishlist FOR ALL USING (true);

-- Orders
CREATE POLICY "user_read_orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_create_orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_update_orders" ON orders FOR UPDATE USING (auth.uid() = user_id);

-- Order Items
CREATE POLICY "user_read_order_items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Reviews
CREATE POLICY "public_read_reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "user_create_reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_update_reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);

-- Favorites
CREATE POLICY "user_read_favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_add_favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_remove_favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- Vendors
CREATE POLICY "public_read_vendors" ON vendors FOR SELECT USING (true);

-- Coupons
CREATE POLICY "public_read_coupons" ON coupons FOR SELECT USING (true);

-- ============================================
-- VERIFICAR
-- ============================================
SELECT policyname, tablename, cmd FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename;
