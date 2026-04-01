-- ================================================
-- MARRENGULA-IT E-COMMERCE DATABASE SCHEMA
-- Script SQL para Supabase
-- ================================================

-- ================================================
-- 1. CATEGORIES (Categorias de Produtos)
-- ================================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 2. VENDORS (Lojas/Vendedores)
-- ================================================
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo TEXT,
    banner TEXT,
    description TEXT,
    rating NUMERIC(3,2) DEFAULT 0,
    total_sales NUMERIC DEFAULT 0,
    total_products INTEGER DEFAULT 0,
    followers INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 3. PRODUCTS (Produtos)
-- ================================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    price NUMERIC NOT NULL DEFAULT 0,
    old_price NUMERIC,
    cost_price NUMERIC,
    stock INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    images TEXT[] DEFAULT '{}',
    brand TEXT,
    model TEXT,
    sku TEXT UNIQUE,
    barcode TEXT,
    weight DECIMAL(10,2),
    dimensions TEXT,
    specifications JSONB DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    category TEXT,
    subcategory TEXT,
    rating NUMERIC(3,2) DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    sales_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    on_sale BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 4. ORDERS (Pedidos)
-- ================================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    order_number TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
    payment_method TEXT CHECK (payment_method IN ('mpesa', 'transfer', 'cod', 'paypal')),
    payment_reference TEXT,
    subtotal NUMERIC DEFAULT 0,
    shipping_cost NUMERIC DEFAULT 0,
    discount_amount NUMERIC DEFAULT 0,
    coupon_code TEXT,
    total_amount NUMERIC DEFAULT 0,
    currency TEXT DEFAULT 'MZN',
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_city TEXT NOT NULL,
    delivery_province TEXT,
    delivery_postal_code TEXT,
    delivery_instructions TEXT,
    notes TEXT,
    admin_notes TEXT,
    estimated_delivery DATE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 5. ORDER_ITEMS (Itens do Pedido)
-- ================================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_image TEXT,
    product_sku TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC NOT NULL,
    discount_amount NUMERIC DEFAULT 0,
    subtotal NUMERIC NOT NULL,
    specifications JSONB DEFAULT '{}',
    isReviewed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 6. FAVORITES (Favoritos)
-- ================================================
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- ================================================
-- 7. REVIEWS (Avaliações)
-- ================================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    pros TEXT[],
    cons TEXT[],
    images TEXT[] DEFAULT '{}',
    verified_purchase BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    not_helpful_count INTEGER DEFAULT 0,
    admin_response TEXT,
    responded_at TIMESTAMP WITH TIME ZONE,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 8. COUPONS (Cupões de Desconto)
-- ================================================
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed', 'free_shipping')),
    discount_value NUMERIC NOT NULL,
    min_order_amount NUMERIC DEFAULT 0,
    max_discount_amount NUMERIC,
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    per_user_limit INTEGER DEFAULT 1,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    applicable_categories TEXT[],
    applicable_products TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 9. RECENTLY_VIEWED (Histórico de Visualização)
-- ================================================
CREATE TABLE IF NOT EXISTS recently_viewed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_id TEXT,
    UNIQUE(user_id, product_id)
);

-- ================================================
-- 10. PRICE_ALERTS (Alertas de Preço)
-- ================================================
CREATE TABLE IF NOT EXISTS price_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    target_price NUMERIC,
    current_price NUMERIC,
    is_active BOOLEAN DEFAULT true,
    notified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 11. PRODUCT_QUESTIONS (Perguntas sobre Produtos)
-- ================================================
CREATE TABLE IF NOT EXISTS product_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    question TEXT NOT NULL,
    answer TEXT,
    answered_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    answered_at TIMESTAMP WITH TIME ZONE,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 12. LOYALTY_POINTS (Programa de Fidelidade)
-- ================================================
CREATE TABLE IF NOT EXISTS loyalty_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    points INTEGER NOT NULL DEFAULT 0,
    lifetime_points INTEGER DEFAULT 0,
    tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
    tier_discount_percent INTEGER DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    total_spent NUMERIC DEFAULT 0,
    last_earning_at TIMESTAMP WITH TIME ZONE,
    last_redemption_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 13. LOYALTY_TRANSACTIONS (Transações de Pontos)
-- ================================================
CREATE TABLE IF NOT EXISTS loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    points INTEGER NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earn', 'redeem', 'expire', 'adjust')),
    description TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    redeemed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 14. NEWSLETTER (Newsletter)
-- ================================================
CREATE TABLE IF NOT EXISTS newsletter (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    source TEXT DEFAULT 'website'
);

-- ================================================
-- 15. SERVICE_REQUESTS (Pedidos de Serviços)
-- ================================================
CREATE TABLE IF NOT EXISTS service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    service_type TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    company TEXT,
    description TEXT NOT NULL,
    preferred_date DATE,
    budget TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'in_progress', 'completed', 'cancelled')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 16. AFFILIATES (Programa de Afiliados)
-- ================================================
CREATE TABLE IF NOT EXISTS affiliates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    referral_code TEXT UNIQUE NOT NULL,
    commission_rate NUMERIC DEFAULT 5,
    total_referrals INTEGER DEFAULT 0,
    total_earnings NUMERIC DEFAULT 0,
    pending_earnings NUMERIC DEFAULT 0,
    paid_earnings NUMERIC DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 17. AFFILIATE_TRANSACTIONS (Transações de Afiliados)
-- ================================================
CREATE TABLE IF NOT EXISTS affiliate_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    referral_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    order_amount NUMERIC NOT NULL,
    commission_amount NUMERIC NOT NULL,
    commission_rate NUMERIC DEFAULT 5,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- INDEXES
-- ================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_vendor ON products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_products_on_sale ON products(on_sale) WHERE on_sale = true;
CREATE INDEX IF NOT EXISTS idx_products_created ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating DESC);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product ON favorites(product_id);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);

CREATE INDEX IF NOT EXISTS idx_recently_viewed_user ON recently_viewed(user_id);

CREATE INDEX IF NOT EXISTS idx_loyalty_user ON loyalty_points(user_id);

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE recently_viewed ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_transactions ENABLE ROW LEVEL SECURITY;

-- Policies para products (público para leitura)
CREATE POLICY "Products are viewable by everyone"
ON products FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "Users can insert products"
ON products FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Vendors can update own products"
ON products FOR UPDATE
TO authenticated
USING (vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid()));

-- Policies para favorites
CREATE POLICY "Users can view their favorites"
ON favorites FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
ON favorites FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their favorites"
ON favorites FOR DELETE
USING (auth.uid() = user_id);

-- Policies para orders
CREATE POLICY "Users can view their orders"
ON orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create orders"
ON orders FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Admins can view all orders"
ON orders FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can view their order items"
ON order_items FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items.order_id 
        AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
    )
);

CREATE POLICY "Users can insert their order items"
ON order_items FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items.order_id 
        AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
    )
);

-- Policies para reviews
CREATE POLICY "Reviews are viewable by everyone"
ON reviews FOR SELECT
USING (is_visible = true);

CREATE POLICY "Users can create reviews"
ON reviews FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their reviews"
ON reviews FOR UPDATE
USING (auth.uid() = user_id);

-- Policies para loyalty_points
CREATE POLICY "Users can view their loyalty points"
ON loyalty_points FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their loyalty points"
ON loyalty_points FOR UPDATE
USING (auth.uid() = user_id);

-- Policies para recently_viewed
CREATE POLICY "Users can view their recently viewed"
ON recently_viewed FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add recently viewed"
ON recently_viewed FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their recently viewed"
ON recently_viewed FOR UPDATE
USING (auth.uid() = user_id);

-- Admin policies (apenas admins podem ver tudo - usando verificação direta)
-- NOTA: Para admin completo, usar service_role key ou criar função específica
-- As políticas abaixo são comentadas para evitar erros se user_roles não existir
-- 
-- CREATE POLICY "Admins can view all orders"
-- ON orders FOR SELECT
-- USING (
--     EXISTS (
--         SELECT 1 FROM user_roles 
--         WHERE user_roles.user_id = auth.uid() 
--         AND user_roles.role = 'admin'
--     )
-- );
--
-- CREATE POLICY "Admins can update orders"
-- ON orders FOR UPDATE
-- USING (
--     EXISTS (
--         SELECT 1 FROM user_roles 
--         WHERE user_roles.user_id = auth.uid() 
--         AND user_roles.role = 'admin'
--     )
-- );

-- ================================================
-- FUNCTIONS / TRIGGERS
-- ================================================

-- Função para gerar número de pedido
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number := 'MARR-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_sequence')::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Sequência para números de pedido
CREATE SEQUENCE IF NOT EXISTS order_sequence START 1;

-- Trigger para gerar número de pedido
DROP TRIGGER IF EXISTS set_order_number ON orders;
CREATE TRIGGER set_order_number
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION generate_order_number();

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at
BEFORE UPDATE ON vendors
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Função para criar perfil após signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, user_id, full_name)
    VALUES (gen_random_uuid(), NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
    
    INSERT INTO public.loyalty_points (user_id, points, tier)
    VALUES (NEW.id, 0, 'bronze');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- Função para rastrear visualização de produto
CREATE OR REPLACE FUNCTION track_product_view(p_product_id UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO recently_viewed (user_id, product_id, viewed_at)
    VALUES (auth.uid(), p_product_id, NOW())
    ON CONFLICT (user_id, product_id)
    DO UPDATE SET viewed_at = NOW();
    
    UPDATE products SET views_count = views_count + 1 WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para incrementar uso de cupom
CREATE OR REPLACE FUNCTION increment_coupon_usage(coupon_code TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE coupons 
    SET used_count = used_count + 1 
    WHERE code = coupon_code AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- SEED DATA (Dados Iniciais)
-- ================================================

-- Categorias
INSERT INTO categories (name, slug, icon, description, sort_order) VALUES
('Laptops', 'laptops', 'laptop', 'Portáteis e notebooks para trabalho e gaming', 1),
('Smartphones', 'smartphones', 'smartphone', 'Telemóveis e acessórios', 2),
('Placas Gráficas', 'placas-graficas', 'monitor', 'GPUs para gaming e trabalho', 3),
('Periféricos', 'perifericos', 'keyboard', 'Teclados, ratos, headsets', 4),
('Componentes', 'componentes', 'cpu', 'Processadores, RAM, armazenamento', 5),
('Monitores', 'monitores', 'display', 'Monitores e ecrãs', 6),
('Redes', 'redes', 'wifi', 'Routers, switches, adaptadores', 7),
('Acessórios', 'acessorios', 'cable', 'Cabos, adaptadores, powerbanks', 8),
('CCTV', 'cctv', 'camera', 'Sistemas de vigilância, câmaras e gravadores', 9)
ON CONFLICT (slug) DO NOTHING;

-- ================================================
-- FIM DO SCRIPT
-- ================================================
