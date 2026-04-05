-- ============================================
-- CORREÇÃO COMPLETA SUPABASE - RLS POLICIES
-- Marrengula-IT E-commerce Platform
-- ============================================

-- ============================================
-- PARTE 1: APAGAR TODAS AS POLÍTICAS EXISTENTES
-- ============================================

-- Apagar políticas da tabela products
DROP POLICY IF EXISTS "Public read all products" ON products CASCADE;
DROP POLICY IF EXISTS "Allow admin all" ON products CASCADE;
DROP POLICY IF EXISTS "Allow authenticated full access products" ON products CASCADE;
DROP POLICY IF EXISTS "Allow authenticated read products" ON products CASCADE;
DROP POLICY IF EXISTS "Allow public read" ON products CASCADE;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products CASCADE;
DROP POLICY IF EXISTS "Public read products" ON products CASCADE;
DROP POLICY IF EXISTS "Public can view products" ON products CASCADE;

-- Apagar políticas da tabela profiles
DROP POLICY IF EXISTS "Public read profiles" ON profiles CASCADE;
DROP POLICY IF EXISTS "Allow all access to profiles" ON profiles CASCADE;
DROP POLICY IF EXISTS "Allow public read profiles" ON profiles CASCADE;
DROP POLICY IF EXISTS "Allow authenticated manage own profile" ON profiles CASCADE;
DROP POLICY IF EXISTS "Public can view profiles" ON profiles CASCADE;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles CASCADE;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles CASCADE;

-- Apagar políticas da tabela wishlist
DROP POLICY IF EXISTS "Public read wishlist" ON wishlist CASCADE;
DROP POLICY IF EXISTS "Allow all access wishlist" ON wishlist CASCADE;
DROP POLICY IF EXISTS "Allow authenticated manage own wishlist" ON wishlist CASCADE;
DROP POLICY IF EXISTS "Enable read access for all users" ON wishlist CASCADE;
DROP POLICY IF EXISTS "Users can view own wishlist" ON wishlist CASCADE;
DROP POLICY IF EXISTS "Users can add to wishlist" ON wishlist CASCADE;
DROP POLICY IF EXISTS "Users can remove from wishlist" ON wishlist CASCADE;

-- Apagar políticas da tabela orders
DROP POLICY IF EXISTS "Users read own orders" ON orders CASCADE;
DROP POLICY IF EXISTS "Users can view own orders" ON orders CASCADE;
DROP POLICY IF EXISTS "Users can create orders" ON orders CASCADE;
DROP POLICY IF EXISTS "Users can update own orders" ON orders CASCADE;

-- Apagar políticas da tabela order_items
DROP POLICY IF EXISTS "Users read own order items" ON order_items CASCADE;
DROP POLICY IF EXISTS "Users can view own order items" ON order_items CASCADE;

-- Apagar políticas da tabela reviews
DROP POLICY IF EXISTS "Public read reviews" ON reviews CASCADE;
DROP POLICY IF EXISTS "Public can view reviews" ON reviews CASCADE;
DROP POLICY IF EXISTS "Users create reviews" ON reviews CASCADE;
DROP POLICY IF EXISTS "Users can create reviews" ON reviews CASCADE;
DROP POLICY IF EXISTS "Users update own reviews" ON reviews CASCADE;
DROP POLICY IF EXISTS "Users can update own reviews" ON reviews CASCADE;

-- Apagar políticas da tabela favorites
DROP POLICY IF EXISTS "Users read own favorites" ON favorites CASCADE;
DROP POLICY IF EXISTS "Users can view own favorites" ON favorites CASCADE;
DROP POLICY IF EXISTS "Users add favorites" ON favorites CASCADE;
DROP POLICY IF EXISTS "Users can add to favorites" ON favorites CASCADE;
DROP POLICY IF EXISTS "Users remove own favorites" ON favorites CASCADE;
DROP POLICY IF EXISTS "Users can remove from favorites" ON favorites CASCADE;

-- Apagar políticas da tabela categories
DROP POLICY IF EXISTS "Public read categories" ON categories CASCADE;
DROP POLICY IF EXISTS "Public can view categories" ON categories CASCADE;

-- Apagar políticas da tabela vendors
DROP POLICY IF EXISTS "Public read vendors" ON vendors CASCADE;
DROP POLICY IF EXISTS "Public can view vendors" ON vendors CASCADE;

-- Apagar políticas da tabela coupons
DROP POLICY IF EXISTS "Public read coupons" ON coupons CASCADE;
DROP POLICY IF EXISTS "Public can view coupons" ON coupons CASCADE;

-- ============================================
-- PARTE 2: CRIAR NOVAS POLÍTICAS
-- ============================================

-- PRODUCTS: leitura pública
CREATE POLICY "products_public_read" ON products FOR SELECT USING (true);

-- PROFILES: leitura pública e acesso total
CREATE POLICY "profiles_public_read" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_all_access" ON profiles FOR ALL USING (true);

-- CATEGORIES: leitura pública
CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (true);

-- WISHLIST: leitura pública e acesso total
CREATE POLICY "wishlist_public_read" ON wishlist FOR SELECT USING (true);
CREATE POLICY "wishlist_all_access" ON wishlist FOR ALL USING (true);

-- ORDERS: acesso do próprio utilizador
CREATE POLICY "orders_user_read" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders_user_insert" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_user_update" ON orders FOR UPDATE USING (auth.uid() = user_id);

-- ORDER_ITEMS: acesso através das orders do próprio
CREATE POLICY "order_items_user_read" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- REVIEWS: leitura pública, criação/atualização pelo próprio
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_user_insert" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_user_update" ON reviews FOR UPDATE USING (auth.uid() = user_id);

-- FAVORITES: acesso do próprio utilizador
CREATE POLICY "favorites_user_read" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "favorites_user_insert" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_user_delete" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- VENDORS: leitura pública
CREATE POLICY "vendors_public_read" ON vendors FOR SELECT USING (true);

-- COUPONS: leitura pública
CREATE POLICY "coupons_public_read" ON coupons FOR SELECT USING (true);

-- ============================================
-- PARTE 3: VERIFICAÇÃO
-- ============================================
SELECT tablename, policyname, cmd FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename, policyname;
