-- ================================================
-- MARRENGULA-IT DATABASE SCHEMA - CORE
-- Migration v1.001: Schema base + Auth
-- ================================================

-- ================================================
-- 1. PROFILES (Extensão do auth.users)
-- ================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    avatar TEXT,
    role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin', 'vendor')),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para criar profile automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ================================================
-- 2. CATEGORIES (Categorias de Produtos)
-- ================================================
CREATE TABLE IF NOT EXISTS public.categories (
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
-- 3. VENDORS (Lojas/Vendedores)
-- ================================================
CREATE TABLE IF NOT EXISTS public.vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
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
-- 4. PRODUCTS (Produtos)
-- ================================================
CREATE TABLE IF NOT EXISTS public.products (
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
    avg_rating DECIMAL(3,2) DEFAULT 0,
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
-- 5. ORDERS (Pedidos)
-- ================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    order_number TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
    payment_method TEXT CHECK (payment_method IN ('mpesa', 'emola', 'transfer', 'cod', 'paypal', 'stripe')),
    payment_reference TEXT,
    subtotal NUMERIC DEFAULT 0,
    shipping_cost NUMERIC DEFAULT 0,
    discount_amount NUMERIC DEFAULT 0,
    coupon_code TEXT,
    total_amount NUMERIC DEFAULT 0,
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    shipping_address TEXT,
    shipping_city TEXT,
    shipping_province TEXT,
    notes TEXT,
    tracking_number TEXT,
    estimated_delivery DATE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 6. ORDER_ITEMS (Itens do Pedido)
-- ================================================
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC NOT NULL,
    total_price NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 7. CART_ITEMS (Carrinho)
-- ================================================
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- ================================================
-- 8. FAVORITES (Favoritos/Wishlist)
-- ================================================
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- ================================================
-- 9. REVIEWS (Reviews de Produtos)
-- ================================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title TEXT,
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 10. COUPONS (Cupões de Desconto)
-- ================================================
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC NOT NULL,
    min_order_amount NUMERIC DEFAULT 0,
    max_discount_amount NUMERIC,
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 11. AFFILIATE_COMMISSIONS
-- ================================================
CREATE TABLE IF NOT EXISTS public.affiliate_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    commission_amount NUMERIC NOT NULL,
    commission_rate NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paid_at TIMESTAMP WITH TIME ZONE
);

-- ================================================
-- 12. PAYMENTS (Pagamentos)
-- ================================================
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL,
    payment_method TEXT NOT NULL,
    payment_reference TEXT,
    proof_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 13. PUBLIC_WISHLISTS
-- ================================================
CREATE TABLE IF NOT EXISTS public.public_wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT DEFAULT 'Minha Lista',
    share_token TEXT UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- Funções Auxiliares
-- ================================================

-- Gerar número de pedido único
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    counter INTEGER := 1;
BEGIN
    LOOP
        new_number := 'MRG-' || TO_CHAR(NOW(), 'YYMMDD') || '-' || LPAD((floor(random() * 999999 + 1)::INTEGER)::TEXT, 6, '0');
        IF NOT EXISTS (SELECT 1 FROM public.orders WHERE order_number = new_number) THEN
            RETURN new_number;
        END IF;
        counter := counter + 1;
        IF counter > 100 THEN
            RAISE EXCEPTION 'Failed to generate unique order number';
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- INDEXES PARA PERFORMANCE
-- ================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_vendor ON public.products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id);

-- ================================================
-- SEED: Categorias Padrão
-- ================================================
INSERT INTO public.categories (name, slug, icon, description, sort_order) VALUES
    ('Computadores', 'computadores', 'monitor', 'Desktops, laptops e componentes', 1),
    ('Periféricos', 'perifericos', 'keyboard', 'Teclados, ratos, headphones', 2),
    ('Smartphones', 'smartphones', 'smartphone', 'Telemóveis e acessórios', 3),
    ('Redes', 'redes', 'wifi', 'Routers, switches e adaptadores', 4),
    ('Armazenamento', 'armazenamento', 'hard-drive', 'Discos HDD, SSD e pen drives', 5),
    ('Eletrónica', 'eletronica', 'cpu', 'Componentes eletrónicos diversos', 6),
    ('CCTV', 'cctv', 'video', 'Câmaras e sistemas de vigilância', 7),
    ('Cabos', 'cabos', 'cable', 'Cabos e adaptadores', 8),
    ('Acessórios', 'acessorios', 'package', 'Acessórios gerais', 9),
    ('Serviços TI', 'servicos-ti', 'wrench', 'Serviços de tecnologia', 10)
ON CONFLICT (slug) DO NOTHING;

SELECT '✅ Schema Core criado com sucesso!' AS status;