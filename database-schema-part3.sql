-- ============================================================================
-- ESTRUTURA ESCALÁVEL E-COMMERCE - PARTE 3
-- Row Level Security (RLS) e Dados Iniciais
-- ============================================================================

-- ============================================================================
-- 16. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_public" ON profiles;
CREATE POLICY "profiles_select_public" ON profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- User Roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_roles_select_all" ON user_roles;
CREATE POLICY "user_roles_select_all" ON user_roles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "user_roles_manage_admin" ON user_roles;
CREATE POLICY "user_roles_manage_admin" ON user_roles
  FOR ALL USING (is_admin(auth.uid()));

-- Addresses
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "addresses_select_own" ON addresses;
CREATE POLICY "addresses_select_own" ON addresses
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "addresses_insert_own" ON addresses;
CREATE POLICY "addresses_insert_own" ON addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "addresses_update_own" ON addresses;
CREATE POLICY "addresses_update_own" ON addresses
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "addresses_delete_own" ON addresses;
CREATE POLICY "addresses_delete_own" ON addresses
  FOR DELETE USING (auth.uid() = user_id);

-- Categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "categories_select_active" ON categories;
CREATE POLICY "categories_select_active" ON categories
  FOR SELECT USING (is_active = true OR is_admin(auth.uid()));

DROP POLICY IF EXISTS "categories_manage_admin" ON categories;
CREATE POLICY "categories_manage_admin" ON categories
  FOR ALL USING (is_admin(auth.uid()));

-- Brands
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "brands_select_active" ON brands;
CREATE POLICY "brands_select_active" ON brands
  FOR SELECT USING (is_active = true OR is_admin(auth.uid()));

DROP POLICY IF EXISTS "brands_manage_admin" ON brands;
CREATE POLICY "brands_manage_admin" ON brands
  FOR ALL USING (is_admin(auth.uid()));

-- Vendors
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "vendors_select_active" ON vendors;
CREATE POLICY "vendors_select_active" ON vendors
  FOR SELECT USING (is_active = true OR user_id = auth.uid() OR is_admin(auth.uid()));

DROP POLICY IF EXISTS "vendors_update_own" ON vendors;
CREATE POLICY "vendors_update_own" ON vendors
  FOR UPDATE USING (user_id = auth.uid() OR is_admin(auth.uid()));

DROP POLICY IF EXISTS "vendors_manage_admin" ON vendors;
CREATE POLICY "vendors_manage_admin" ON vendors
  FOR ALL USING (is_admin(auth.uid()));

-- Products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products_select_active" ON products;
CREATE POLICY "products_select_active" ON products
  FOR SELECT USING (
    is_active = true 
    OR vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
    OR is_admin(auth.uid())
  );

DROP POLICY IF EXISTS "products_insert_vendor" ON products;
CREATE POLICY "products_insert_vendor" ON products
  FOR INSERT WITH CHECK (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
    OR is_admin(auth.uid())
  );

DROP POLICY IF EXISTS "products_update_vendor" ON products;
CREATE POLICY "products_update_vendor" ON products
  FOR UPDATE USING (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
    OR is_admin(auth.uid())
  );

DROP POLICY IF EXISTS "products_delete_vendor" ON products;
CREATE POLICY "products_delete_vendor" ON products
  FOR DELETE USING (
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
    OR is_admin(auth.uid())
  );

-- Product Variants
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "product_variants_select_all" ON product_variants;
CREATE POLICY "product_variants_select_all" ON product_variants
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "product_variants_manage_vendor" ON product_variants;
CREATE POLICY "product_variants_manage_vendor" ON product_variants
  FOR ALL USING (
    product_id IN (
      SELECT id FROM products 
      WHERE vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
    )
    OR is_admin(auth.uid())
  );

-- Product Images
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "product_images_select_all" ON product_images;
CREATE POLICY "product_images_select_all" ON product_images
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "product_images_manage_vendor" ON product_images;
CREATE POLICY "product_images_manage_vendor" ON product_images
  FOR ALL USING (
    product_id IN (
      SELECT id FROM products 
      WHERE vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
    )
    OR is_admin(auth.uid())
  );

-- Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "orders_select_own" ON orders;
CREATE POLICY "orders_select_own" ON orders
  FOR SELECT USING (
    user_id = auth.uid() 
    OR is_admin(auth.uid())
    OR id IN (
      SELECT DISTINCT order_id FROM order_items 
      WHERE vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "orders_insert_own" ON orders;
CREATE POLICY "orders_insert_own" ON orders
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "orders_update_own" ON orders;
CREATE POLICY "orders_update_own" ON orders
  FOR UPDATE USING (
    user_id = auth.uid() 
    OR is_admin(auth.uid())
  );

-- Order Items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "order_items_select_related" ON order_items;
CREATE POLICY "order_items_select_related" ON order_items
  FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
    OR vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
    OR is_admin(auth.uid())
  );

DROP POLICY IF EXISTS "order_items_insert_own" ON order_items;
CREATE POLICY "order_items_insert_own" ON order_items
  FOR INSERT WITH CHECK (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );

-- Reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reviews_select_approved" ON reviews;
CREATE POLICY "reviews_select_approved" ON reviews
  FOR SELECT USING (
    is_approved = true 
    OR user_id = auth.uid() 
    OR is_admin(auth.uid())
  );

DROP POLICY IF EXISTS "reviews_insert_own" ON reviews;
CREATE POLICY "reviews_insert_own" ON reviews
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "reviews_update_own" ON reviews;
CREATE POLICY "reviews_update_own" ON reviews
  FOR UPDATE USING (
    user_id = auth.uid() 
    OR is_admin(auth.uid())
  );

DROP POLICY IF EXISTS "reviews_delete_own" ON reviews;
CREATE POLICY "reviews_delete_own" ON reviews
  FOR DELETE USING (
    user_id = auth.uid() 
    OR is_admin(auth.uid())
  );

-- Product Questions
ALTER TABLE product_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "product_questions_select_public" ON product_questions;
CREATE POLICY "product_questions_select_public" ON product_questions
  FOR SELECT USING (is_public = true OR user_id = auth.uid() OR is_admin(auth.uid()));

DROP POLICY IF EXISTS "product_questions_insert_auth" ON product_questions;
CREATE POLICY "product_questions_insert_auth" ON product_questions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "product_questions_update_own" ON product_questions;
CREATE POLICY "product_questions_update_own" ON product_questions
  FOR UPDATE USING (user_id = auth.uid() OR is_admin(auth.uid()));

-- Coupons
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "coupons_select_active" ON coupons;
CREATE POLICY "coupons_select_active" ON coupons
  FOR SELECT USING (
    (is_active = true AND NOW() BETWEEN starts_at AND COALESCE(expires_at, NOW() + INTERVAL '100 years'))
    OR is_admin(auth.uid())
  );

DROP POLICY IF EXISTS "coupons_manage_admin" ON coupons;
CREATE POLICY "coupons_manage_admin" ON coupons
  FOR ALL USING (is_admin(auth.uid()));

-- Loyalty Points
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "loyalty_points_select_own" ON loyalty_points;
CREATE POLICY "loyalty_points_select_own" ON loyalty_points
  FOR SELECT USING (user_id = auth.uid() OR is_admin(auth.uid()));

DROP POLICY IF EXISTS "loyalty_points_update_system" ON loyalty_points;
CREATE POLICY "loyalty_points_update_system" ON loyalty_points
  FOR UPDATE USING (is_admin(auth.uid()));

-- Loyalty Transactions
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "loyalty_transactions_select_own" ON loyalty_transactions;
CREATE POLICY "loyalty_transactions_select_own" ON loyalty_transactions
  FOR SELECT USING (user_id = auth.uid() OR is_admin(auth.uid()));

-- Wishlists
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "wishlists_select_own_or_public" ON wishlists;
CREATE POLICY "wishlists_select_own_or_public" ON wishlists
  FOR SELECT USING (user_id = auth.uid() OR is_public = true);

DROP POLICY IF EXISTS "wishlists_manage_own" ON wishlists;
CREATE POLICY "wishlists_manage_own" ON wishlists
  FOR ALL USING (user_id = auth.uid());

-- Wishlist Items
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "wishlist_items_select_related" ON wishlist_items;
CREATE POLICY "wishlist_items_select_related" ON wishlist_items
  FOR SELECT USING (
    wishlist_id IN (
      SELECT id FROM wishlists 
      WHERE user_id = auth.uid() OR is_public = true
    )
  );

DROP POLICY IF EXISTS "wishlist_items_manage_own" ON wishlist_items;
CREATE POLICY "wishlist_items_manage_own" ON wishlist_items
  FOR ALL USING (
    wishlist_id IN (SELECT id FROM wishlists WHERE user_id = auth.uid())
  );

-- Favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "favorites_manage_own" ON favorites;
CREATE POLICY "favorites_manage_own" ON favorites
  FOR ALL USING (user_id = auth.uid());

-- Price Alerts
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "price_alerts_manage_own" ON price_alerts;
CREATE POLICY "price_alerts_manage_own" ON price_alerts
  FOR ALL USING (user_id = auth.uid());

-- Stock Alerts
ALTER TABLE stock_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "stock_alerts_manage_own" ON stock_alerts;
CREATE POLICY "stock_alerts_manage_own" ON stock_alerts
  FOR ALL USING (user_id = auth.uid());

-- Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_manage_own" ON notifications;
CREATE POLICY "notifications_manage_own" ON notifications
  FOR ALL USING (user_id = auth.uid());

-- Affiliates
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "affiliates_select_own" ON affiliates;
CREATE POLICY "affiliates_select_own" ON affiliates
  FOR SELECT USING (user_id = auth.uid() OR is_admin(auth.uid()));

DROP POLICY IF EXISTS "affiliates_update_own" ON affiliates;
CREATE POLICY "affiliates_update_own" ON affiliates
  FOR UPDATE USING (user_id = auth.uid() OR is_admin(auth.uid()));

-- ============================================================================
-- 17. DADOS INICIAIS
-- ============================================================================

-- Categorias principais
INSERT INTO categories (name, slug, description, icon, is_active, is_featured, display_order) VALUES
('Computadores', 'computadores', 'Desktops, All-in-One e Workstations', '🖥️', true, true, 1),
('Notebooks', 'notebooks', 'Laptops, Ultrabooks e Chromebooks', '💻', true, true, 2),
('Componentes', 'componentes', 'Hardware e componentes de PC', '🔧', true, true, 3),
('Periféricos', 'perifericos', 'Teclados, Mouses e Acessórios', '⌨️', true, true, 4),
('Smartphones', 'smartphones', 'Celulares e Tablets', '📱', true, true, 5),
('Gaming', 'gaming', 'Equipamentos para Gamers', '🎮', true, true, 6),
('Áudio e Vídeo', 'audio-video', 'Fones, Caixas de Som e Webcams', '🎧', true, true, 7),
('Redes', 'redes', 'Roteadores, Switches e Modems', '🌐', true, true, 8),
('CCTV', 'cctv', 'Sistemas de videovigilância e câmeras de segurança', '📹', true, true, 9),
('Armazenamento', 'armazenamento', 'HDs, SSDs e Pendrives', '💾', true, true, 10),
('Monitores', 'monitores', 'Monitores e Displays', '🖥️', true, true, 10),
('Impressoras', 'impressoras', 'Impressoras e Scanners', '🖨️', true, false, 11),
('Software', 'software', 'Programas e Licenças', '💿', true, false, 12),
('Servidores', 'servidores', 'Servidores e Storage Empresarial', '🖥️', true, false, 13),
('Segurança', 'seguranca', 'Câmeras e Sistemas de Segurança', '📹', true, false, 14),
('Smart Home', 'smart-home', 'Automação Residencial', '🏠', true, false, 15)
ON CONFLICT (slug) DO NOTHING;

-- Subcategorias de Componentes
INSERT INTO categories (name, slug, description, parent_id, is_active, display_order)
SELECT 'Processadores', 'processadores', 'CPUs Intel e AMD', id, true, 1
FROM categories WHERE slug = 'componentes'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_id, is_active, display_order)
SELECT 'Placas-Mãe', 'placas-mae', 'Motherboards', id, true, 2
FROM categories WHERE slug = 'componentes'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_id, is_active, display_order)
SELECT 'Memória RAM', 'memoria-ram', 'Memórias DDR4 e DDR5', id, true, 3
FROM categories WHERE slug = 'componentes'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_id, is_active, display_order)
SELECT 'Placas de Vídeo', 'placas-video', 'GPUs NVIDIA e AMD', id, true, 4
FROM categories WHERE slug = 'componentes'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_id, is_active, display_order)
SELECT 'Fontes', 'fontes', 'Fontes de Alimentação', id, true, 5
FROM categories WHERE slug = 'componentes'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_id, is_active, display_order)
SELECT 'Gabinetes', 'gabinetes', 'Cases e Gabinetes', id, true, 6
FROM categories WHERE slug = 'componentes'
ON CONFLICT (slug) DO NOTHING;

-- Marcas populares
INSERT INTO brands (name, slug, is_active, display_order) VALUES
('Dell', 'dell', true, 1),
('HP', 'hp', true, 2),
('Lenovo', 'lenovo', true, 3),
('Asus', 'asus', true, 4),
('Acer', 'acer', true, 5),
('Apple', 'apple', true, 6),
('Samsung', 'samsung', true, 7),
('LG', 'lg', true, 8),
('Sony', 'sony', true, 9),
('Microsoft', 'microsoft', true, 10),
('Logitech', 'logitech', true, 11),
('Razer', 'razer', true, 12),
('Corsair', 'corsair', true, 13),
('Kingston', 'kingston', true, 14),
('Seagate', 'seagate', true, 15),
('Western Digital', 'western-digital', true, 16),
('Intel', 'intel', true, 17),
('AMD', 'amd', true, 18),
('NVIDIA', 'nvidia', true, 19),
('TP-Link', 'tp-link', true),
('Hikvision', 'hikvision', true),
('Intelbras', 'intelbras', true)
ON CONFLICT (slug) DO NOTHING;

-- Cupons de boas-vindas
INSERT INTO coupons (code, description, discount_type, discount_value, min_purchase_amount, usage_limit_per_user, starts_at, expires_at, is_active) VALUES
('BEMVINDO10', 'Desconto de 10% para novos clientes', 'percentage', 10.00, 1000.00, 1, NOW(), NOW() + INTERVAL '90 days', true),
('FRETEGRATIS', 'Frete grátis em compras acima de MT 2000', 'free_shipping', 0, 2000.00, 3, NOW(), NOW() + INTERVAL '60 days', true),
('PRIMEIRACOMPRA', 'MT 200 de desconto na primeira compra', 'fixed', 200.00, 1500.00, 1, NOW(), NOW() + INTERVAL '120 days', true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- 18. VIEWS ÚTEIS
-- ============================================================================

-- View de produtos com informações completas
CREATE OR REPLACE VIEW products_full AS
SELECT 
  p.*,
  c.name as category_name,
  c.slug as category_slug,
  b.name as brand_name,
  b.slug as brand_slug,
  v.store_name,
  v.rating as vendor_rating,
  v.is_verified as vendor_verified
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN brands b ON p.brand_id = b.id
LEFT JOIN vendors v ON p.vendor_id = v.id;

-- View de pedidos com totais
CREATE OR REPLACE VIEW orders_summary AS
SELECT 
  o.*,
  COUNT(oi.id) as item_count,
  SUM(oi.quantity) as total_items
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id;

-- View de estatísticas de vendedor
CREATE OR REPLACE VIEW vendor_stats AS
SELECT 
  v.id,
  v.store_name,
  COUNT(DISTINCT p.id) as product_count,
  COUNT(DISTINCT o.id) as order_count,
  COALESCE(SUM(o.total_amount), 0) as total_revenue,
  COALESCE(AVG(r.rating), 0) as avg_rating,
  COUNT(DISTINCT r.id) as review_count
FROM vendors v
LEFT JOIN products p ON v.id = p.vendor_id
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id AND o.status = 'delivered'
LEFT JOIN reviews r ON p.id = r.product_id AND r.is_approved = true
GROUP BY v.id, v.store_name;

-- ============================================================================
-- ✅ SETUP COMPLETO E ESCALÁVEL!
-- ============================================================================
-- 
-- Próximos passos:
-- 1. Criar admin: SELECT promote_to_admin('seu-email@exemplo.com');
-- 2. Criar vendor de teste
-- 3. Adicionar produtos
-- 4. Testar: npm run test:integration
-- 5. Iniciar: npm run dev
-- 
-- ============================================================================
