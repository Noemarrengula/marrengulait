-- ============================================================================
-- ESTRUTURA ESCALÁVEL E-COMMERCE - PARTE 2
-- Índices, Triggers, Funções e RLS
-- ============================================================================

-- ============================================================================
-- 13. ÍNDICES PARA PERFORMANCE
-- ============================================================================

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);

-- User Roles
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_active ON user_roles(is_active) WHERE is_active = true;

-- Addresses
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_default ON addresses(user_id, is_default) WHERE is_default = true;

-- Categories
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_categories_featured ON categories(is_featured) WHERE is_featured = true;

-- Brands
CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);
CREATE INDEX IF NOT EXISTS idx_brands_active ON brands(is_active) WHERE is_active = true;

-- Vendors
CREATE INDEX IF NOT EXISTS idx_vendors_user_id ON vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_slug ON vendors(slug);
CREATE INDEX IF NOT EXISTS idx_vendors_active ON vendors(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_vendors_verified ON vendors(is_verified) WHERE is_verified = true;
CREATE INDEX IF NOT EXISTS idx_vendors_rating ON vendors(rating DESC);

-- Products (índices compostos para queries comuns)
CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_sale ON products(is_on_sale) WHERE is_on_sale = true;
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating DESC);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_sale_count ON products(sale_count DESC);

-- Índice full-text para busca
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING gin(to_tsvector('portuguese', title || ' ' || COALESCE(description, '')));

-- Índice para tags
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING gin(tags);

-- Product Variants
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);

-- Product Images
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_primary ON product_images(product_id, is_primary) WHERE is_primary = true;

-- Orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_user_status ON orders(user_id, status);

-- Order Items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_vendor_id ON order_items(vendor_id);

-- Reviews
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved) WHERE is_approved = true;
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- Product Questions
CREATE INDEX IF NOT EXISTS idx_product_questions_product_id ON product_questions(product_id);
CREATE INDEX IF NOT EXISTS idx_product_questions_answered ON product_questions(answered_at) WHERE answered_at IS NOT NULL;

-- Coupons
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_coupons_expires_at ON coupons(expires_at);

-- Loyalty Points
CREATE INDEX IF NOT EXISTS idx_loyalty_points_user_id ON loyalty_points(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_points_tier ON loyalty_points(tier);

-- Favorites
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product_id ON favorites(product_id);

-- Wishlists
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_wishlist_id ON wishlist_items(wishlist_id);

-- Price Alerts
CREATE INDEX IF NOT EXISTS idx_price_alerts_user_id ON price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_product_id ON price_alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_active ON price_alerts(is_active) WHERE is_active = true;

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Product Views
CREATE INDEX IF NOT EXISTS idx_product_views_product_id ON product_views(product_id);
CREATE INDEX IF NOT EXISTS idx_product_views_created_at ON product_views(created_at DESC);

-- Search Queries
CREATE INDEX IF NOT EXISTS idx_search_queries_query ON search_queries(query);
CREATE INDEX IF NOT EXISTS idx_search_queries_created_at ON search_queries(created_at DESC);

-- ============================================================================
-- 14. FUNÇÕES ÚTEIS
-- ============================================================================

-- Gerar número de pedido único
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  year_part TEXT;
  sequence_part TEXT;
BEGIN
  year_part := TO_CHAR(NOW(), 'YYYY');
  
  SELECT LPAD((COUNT(*) + 1)::TEXT, 6, '0')
  INTO sequence_part
  FROM orders
  WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());
  
  new_number := 'ORD-' || year_part || '-' || sequence_part;
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Calcular rating médio de produto
CREATE OR REPLACE FUNCTION calculate_product_rating(p_product_id UUID)
RETURNS DECIMAL(3,2) AS $$
DECLARE
  avg_rating DECIMAL(3,2);
BEGIN
  SELECT COALESCE(AVG(rating), 0)
  INTO avg_rating
  FROM reviews
  WHERE product_id = p_product_id AND is_approved = true;
  
  RETURN ROUND(avg_rating, 2);
END;
$$ LANGUAGE plpgsql;

-- Verificar se usuário é admin
CREATE OR REPLACE FUNCTION is_admin(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = p_user_id 
    AND role = 'admin' 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Promover usuário a admin
CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT)
RETURNS void AS $$
DECLARE
  user_uuid UUID;
BEGIN
  SELECT id INTO user_uuid FROM auth.users WHERE email = user_email;
  
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado: %', user_email;
  END IF;
  
  INSERT INTO public.user_roles (user_id, role, is_active)
  VALUES (user_uuid, 'admin', true)
  ON CONFLICT (user_id, role) 
  DO UPDATE SET is_active = true, granted_at = NOW();
  
  RAISE NOTICE 'Usuário % promovido a admin com sucesso!', user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Adicionar pontos de fidelidade
CREATE OR REPLACE FUNCTION add_loyalty_points(
  p_user_id UUID,
  p_points INTEGER,
  p_reason TEXT,
  p_reference_type TEXT DEFAULT NULL,
  p_reference_id UUID DEFAULT NULL
)
RETURNS void AS $$
DECLARE
  current_balance INTEGER;
  new_balance INTEGER;
BEGIN
  -- Obter saldo atual
  SELECT COALESCE(points, 0) INTO current_balance
  FROM loyalty_points
  WHERE user_id = p_user_id;
  
  new_balance := current_balance + p_points;
  
  -- Atualizar ou criar registro de pontos
  INSERT INTO loyalty_points (user_id, points, lifetime_points)
  VALUES (p_user_id, new_balance, p_points)
  ON CONFLICT (user_id)
  DO UPDATE SET 
    points = new_balance,
    lifetime_points = loyalty_points.lifetime_points + p_points,
    updated_at = NOW();
  
  -- Registrar transação
  INSERT INTO loyalty_transactions (
    user_id, points, balance_after, reason, reference_type, reference_id
  ) VALUES (
    p_user_id, p_points, new_balance, p_reason, p_reference_type, p_reference_id
  );
END;
$$ LANGUAGE plpgsql;

-- Atualizar tier de fidelidade
CREATE OR REPLACE FUNCTION update_loyalty_tier()
RETURNS TRIGGER AS $$
DECLARE
  new_tier loyalty_tier_type;
BEGIN
  -- Lógica de tiers baseada em pontos lifetime
  IF NEW.lifetime_points >= 10000 THEN
    new_tier := 'diamond';
  ELSIF NEW.lifetime_points >= 5000 THEN
    new_tier := 'platinum';
  ELSIF NEW.lifetime_points >= 2000 THEN
    new_tier := 'gold';
  ELSIF NEW.lifetime_points >= 500 THEN
    new_tier := 'silver';
  ELSE
    new_tier := 'bronze';
  END IF;
  
  NEW.tier := new_tier;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Atualizar contadores de produto
CREATE OR REPLACE FUNCTION update_product_counters()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Atualizar rating e review_count
    IF TG_TABLE_NAME = 'reviews' AND NEW.is_approved THEN
      UPDATE products
      SET 
        rating = calculate_product_rating(NEW.product_id),
        review_count = review_count + 1
      WHERE id = NEW.product_id;
    END IF;
    
    -- Atualizar favorite_count
    IF TG_TABLE_NAME = 'favorites' THEN
      UPDATE products
      SET favorite_count = favorite_count + 1
      WHERE id = NEW.product_id;
    END IF;
    
  ELSIF TG_OP = 'DELETE' THEN
    -- Atualizar ao deletar
    IF TG_TABLE_NAME = 'reviews' AND OLD.is_approved THEN
      UPDATE products
      SET 
        rating = calculate_product_rating(OLD.product_id),
        review_count = GREATEST(review_count - 1, 0)
      WHERE id = OLD.product_id;
    END IF;
    
    IF TG_TABLE_NAME = 'favorites' THEN
      UPDATE products
      SET favorite_count = GREATEST(favorite_count - 1, 0)
      WHERE id = OLD.product_id;
    END IF;
    
  ELSIF TG_OP = 'UPDATE' THEN
    -- Atualizar ao mudar aprovação de review
    IF TG_TABLE_NAME = 'reviews' AND OLD.is_approved != NEW.is_approved THEN
      UPDATE products
      SET 
        rating = calculate_product_rating(NEW.product_id),
        review_count = review_count + (CASE WHEN NEW.is_approved THEN 1 ELSE -1 END)
      WHERE id = NEW.product_id;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Criar profile e role para novos usuários
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Criar profile
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  
  -- Criar role padrão
  INSERT INTO public.user_roles (user_id, role, is_active)
  VALUES (NEW.id, 'customer', true);
  
  -- Criar registro de pontos de fidelidade
  INSERT INTO public.loyalty_points (user_id, points, lifetime_points, tier)
  VALUES (NEW.id, 0, 0, 'bronze');
  
  -- Criar wishlist padrão
  INSERT INTO public.wishlists (user_id, name, is_default)
  VALUES (NEW.id, 'Minha Lista', true);
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atualizar timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Gerar número de pedido automaticamente
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Calcular total do pedido
CREATE OR REPLACE FUNCTION calculate_order_total()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_amount := NEW.subtotal + NEW.shipping_cost + NEW.tax - NEW.discount;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Registrar histórico de status do pedido
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO order_status_history (order_id, status, changed_by)
    VALUES (NEW.id, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Atualizar estoque após pedido
CREATE OR REPLACE FUNCTION update_stock_after_order()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Reduzir estoque
    UPDATE products
    SET stock = stock - NEW.quantity
    WHERE id = NEW.product_id;
    
    -- Atualizar contador de vendas
    UPDATE products
    SET sale_count = sale_count + NEW.quantity
    WHERE id = NEW.product_id;
    
  ELSIF TG_OP = 'DELETE' THEN
    -- Devolver estoque (em caso de cancelamento)
    UPDATE products
    SET stock = stock + OLD.quantity
    WHERE id = OLD.product_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 15. TRIGGERS
-- ============================================================================

-- Trigger para novos usuários
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Trigger para loyalty tier
DROP TRIGGER IF EXISTS update_loyalty_tier_trigger ON loyalty_points;
CREATE TRIGGER update_loyalty_tier_trigger
  BEFORE UPDATE ON loyalty_points
  FOR EACH ROW
  EXECUTE FUNCTION update_loyalty_tier();

-- Triggers para contadores de produto
DROP TRIGGER IF EXISTS update_product_counters_reviews ON reviews;
CREATE TRIGGER update_product_counters_reviews
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_counters();

DROP TRIGGER IF EXISTS update_product_counters_favorites ON favorites;
CREATE TRIGGER update_product_counters_favorites
  AFTER INSERT OR DELETE ON favorites
  FOR EACH ROW
  EXECUTE FUNCTION update_product_counters();

-- Trigger para número de pedido
DROP TRIGGER IF EXISTS set_order_number_trigger ON orders;
CREATE TRIGGER set_order_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Trigger para total do pedido
DROP TRIGGER IF EXISTS calculate_order_total_trigger ON orders;
CREATE TRIGGER calculate_order_total_trigger
  BEFORE INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION calculate_order_total();

-- Trigger para histórico de status
DROP TRIGGER IF EXISTS log_order_status_change_trigger ON orders;
CREATE TRIGGER log_order_status_change_trigger
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION log_order_status_change();

-- Trigger para atualizar estoque
DROP TRIGGER IF EXISTS update_stock_after_order_trigger ON order_items;
CREATE TRIGGER update_stock_after_order_trigger
  AFTER INSERT OR DELETE ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION update_stock_after_order();

-- ============================================================================
-- CONTINUA NO PRÓXIMO ARQUIVO (RLS)...
-- ============================================================================
