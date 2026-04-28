-- ============================================================================
-- SCRIPT: Índices de Performance para Marrengula-IT
-- Executar no Supabase SQL Editor para melhorar a velocidade
-- ============================================================================

-- Índices para Products (principais - sempre executar)
DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
EXCEPTION WHEN undefined_column THEN NULL;
END $$;

DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);
EXCEPTION WHEN undefined_column THEN NULL;
END $$;

DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_products_on_sale ON public.products(on_sale);
EXCEPTION WHEN undefined_column THEN NULL;
END $$;

DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);
EXCEPTION WHEN undefined_column THEN NULL;
END $$;

DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
EXCEPTION WHEN undefined_column THEN NULL;
END $$;

-- Índices para Orders
DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
EXCEPTION WHEN undefined_column THEN NULL;
END $$;

DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
EXCEPTION WHEN undefined_column THEN NULL;
END $$;

DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
EXCEPTION WHEN undefined_column THEN NULL;
END $$;

DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_orders_payment_method ON public.orders(payment_method);
EXCEPTION WHEN undefined_column THEN NULL;
END $$;

-- Índices para Profiles
DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
EXCEPTION WHEN undefined_column THEN NULL;
END $$;

-- Índices para User Roles
DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- Índices para Order Items
DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
EXCEPTION WHEN undefined_column THEN NULL;
END $$;

-- Índices para Loyalty Points
DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_loyalty_points_user_id ON public.loyalty_points(user_id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- Índices para Affiliates
DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_affiliates_user_id ON public.affiliates(user_id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_affiliates_code ON public.affiliates(code);
EXCEPTION WHEN undefined_column THEN NULL;
END $$;

-- Índices para Price Alerts
DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_price_alerts_user_id ON public.price_alerts(user_id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- Índices para Reviews
DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- Índices para Product Questions
DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_product_questions_product_id ON public.product_questions(product_id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- Índices para Favorites
DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

SELECT '✅ Script executado com sucesso!' AS status;
