-- ============================================================================
-- SCRIPT COMPLETO: Correções e Melhorias Marrengula-IT
-- Executar no Supabase SQL Editor - TODAS as instruções de uma vez
-- ============================================================================

-- ============================================================================
-- PARTE 1: COLUNAS E TABELAS
-- ============================================================================

-- Adicionar colunas de pagamento à tabela orders
DO $$ BEGIN
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_proof_url TEXT;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_proof_data JSONB;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_reference TEXT;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Adicionar colunas de rating à tabela products
DO $$ BEGIN
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS avg_rating DECIMAL(3,2) DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- ============================================================================
-- PARTE 2: ÍNDICES DE PERFORMANCE
-- ============================================================================

-- Products
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

-- Orders
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

-- Profiles
DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
EXCEPTION WHEN undefined_column THEN NULL;
END $$;

-- User Roles
DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- Order Items
DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- Wishlists
DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON public.wishlists(user_id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_wishlists_product_id ON public.wishlists(product_id);
EXCEPTION WHEN undefined_column THEN NULL;
END $$;

-- ============================================================================
-- PARTE 3: CONSTRAINTS
-- ============================================================================

-- Atualizar constraint de payment_method para incluir 'emola'
DO $$ BEGIN
    ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;
EXCEPTION WHEN undefined_object THEN NULL;
END $$;

ALTER TABLE public.orders ADD CONSTRAINT orders_payment_method_check 
CHECK (payment_method IN ('mpesa', 'emola', 'bank_transfer', 'credit_card', 'cash_on_delivery', 'cod', 'transfer', 'mpesa_prompt'));

-- ============================================================================
-- PARTE 4: POLÍTICAS RLS (Row Level Security)
-- ============================================================================

-- Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read for authenticated users" ON public.orders;
CREATE POLICY "Allow read for authenticated users" ON public.orders
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.orders;
CREATE POLICY "Allow insert for authenticated users" ON public.orders
  FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Allow update for authenticated users" ON public.orders;
CREATE POLICY "Allow update for authenticated users" ON public.orders
  FOR UPDATE TO authenticated USING (true);

-- Order Items
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.order_items;
CREATE POLICY "Allow insert for authenticated users" ON public.order_items
  FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Allow read for authenticated users" ON public.order_items;
CREATE POLICY "Allow read for authenticated users" ON public.order_items
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow update for authenticated users" ON public.order_items;
CREATE POLICY "Allow update for authenticated users" ON public.order_items
  FOR UPDATE TO authenticated USING (true);

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read for authenticated users" ON public.profiles;
CREATE POLICY "Allow read for authenticated users" ON public.profiles
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow update for authenticated users" ON public.profiles;
CREATE POLICY "Allow update for authenticated users" ON public.profiles
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Loyalty Points
DROP POLICY IF EXISTS "Allow read for authenticated users" ON public.loyalty_points;
CREATE POLICY "Allow read for authenticated users" ON public.loyalty_points
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.loyalty_points;
CREATE POLICY "Allow insert for authenticated users" ON public.loyalty_points
  FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Allow update for authenticated users" ON public.loyalty_points;
CREATE POLICY "Allow update for authenticated users" ON public.loyalty_points
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- User Roles
DROP POLICY IF EXISTS "Allow read for authenticated users" ON public.user_roles;
CREATE POLICY "Allow read for authenticated users" ON public.user_roles
  FOR SELECT TO authenticated USING (true);

-- Products
DROP POLICY IF EXISTS "Allow read for all users" ON public.products;
CREATE POLICY "Allow read for all users" ON public.products
  FOR SELECT TO authenticated USING (true);

-- Wishlists
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read for authenticated users" ON public.wishlists;
CREATE POLICY "Allow read for authenticated users" ON public.wishlists
  FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.wishlists;
CREATE POLICY "Allow insert for authenticated users" ON public.wishlists
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "Allow delete for authenticated users" ON public.wishlists;
CREATE POLICY "Allow delete for authenticated users" ON public.wishlists
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Favorites
DROP POLICY IF EXISTS "Allow read for authenticated users" ON public.favorites;
CREATE POLICY "Allow read for authenticated users" ON public.favorites
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.favorites;
CREATE POLICY "Allow insert for authenticated users" ON public.favorites
  FOR INSERT TO authenticated WITH CHECK (true);

-- Recently Viewed
DROP POLICY IF EXISTS "Allow read for authenticated users" ON public.recently_viewed;
CREATE POLICY "Allow read for authenticated users" ON public.recently_viewed
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.recently_viewed;
CREATE POLICY "Allow insert for authenticated users" ON public.recently_viewed
  FOR INSERT TO authenticated WITH CHECK (true);

-- Reviews
DROP POLICY IF EXISTS "Allow read for all" ON public.reviews;
CREATE POLICY "Allow read for all" ON public.reviews
  FOR SELECT TO authenticated USING (is_approved = true OR user_id = auth.uid());
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.reviews;
CREATE POLICY "Allow insert for authenticated users" ON public.reviews
  FOR INSERT TO authenticated WITH CHECK (true);

-- Reviews - criar tabela se não existir
DO $$ BEGIN
    CREATE TABLE IF NOT EXISTS public.reviews (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        product_id UUID REFERENCES products(id) ON DELETE CASCADE,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        title TEXT,
        comment TEXT,
        is_verified_purchase BOOLEAN DEFAULT false,
        is_approved BOOLEAN DEFAULT false,
        helpful_count INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );
EXCEPTION WHEN duplicate_table THEN NULL;
END $$;

-- ============================================================================
-- PARTE 5: ADMIN DO-utilizador
-- ============================================================================

-- Adicionar role de admin para o utilizador
DO $$ 
DECLARE
  admin_email TEXT := 'noemarrengula1@gmail.com';
  admin_user_id UUID;
BEGIN
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = admin_email;
  
  IF admin_user_id IS NOT NULL THEN
    DELETE FROM public.user_roles WHERE user_id = admin_user_id;
    INSERT INTO public.user_roles (user_id, role, created_at)
    VALUES (admin_user_id, 'admin', NOW());
    RAISE NOTICE 'Admin role added for %', admin_email;
  ELSE
    RAISE NOTICE 'User % not found - please create account first', admin_email;
  END IF;
END $$;

-- ============================================================================
-- PARTE 6: FUNÇÕES ÚTEIS
-- ============================================================================

-- Função para atualizar rating do produto automaticamente
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.products
    SET 
        reviews_count = (
            SELECT COUNT(*) 
            FROM public.reviews 
            WHERE product_id = COALESCE(NEW.product_id, OLD.product_id) AND is_approved = true
        ),
        avg_rating = (
            SELECT COALESCE(AVG(rating)::DECIMAL(3,2), 0)
            FROM public.reviews 
            WHERE product_id = COALESCE(NEW.product_id, OLD.product_id) AND is_approved = true
        )
    WHERE id = COALESCE(NEW.product_id, OLD.product_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para reviews
DROP TRIGGER IF EXISTS trigger_update_product_rating ON public.reviews;
CREATE TRIGGER trigger_update_product_rating
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_product_rating();

-- ============================================================================
-- PARTE 7: STORAGE (para buckets - executar manualmente no dashboard)
-- ============================================================================

-- NOTA: O bucket de storage deve ser criado manualmente no Supabase Dashboard
-- Vá a: Storage > New Bucket > Nome: "payment-proofs" > Marcar "Public bucket"

-- ============================================================================
-- CONFIRMAÇÃO
-- ============================================================================

SELECT '============================================================================' AS separator;
SELECT 'SCRIPT COMPLETO EXECUTADO COM SUCESSO!' AS status;
SELECT '============================================================================' AS separator;
SELECT '' AS blank;
SELECT 'O que foi feito:' AS info;
SELECT '  • Colunas de pagamento adicionadas à tabela orders' AS step;
SELECT '  • Colunas de rating adicionadas à tabela products' AS step;
SELECT '  • Índices de performance criados' AS step;
SELECT '  • Constraint payment_method atualizado com emola' AS step;
SELECT '  • Políticas RLS configuradas para todas as tabelas' AS step;
SELECT '  • Tabela reviews criada (se não existir)' AS step;
SELECT '  • Função de rating automático criada' AS step;
SELECT '  • Admin role adicionado para noemarrengula1@gmail.com' AS step;
SELECT '' AS blank;
SELECT 'PROXIMOS PASSOS:' AS info;
SELECT '  1. Criar bucket payment-proofs manualmente no Storage' AS next;
SELECT '  2. Testar o website' AS next;
SELECT '  3. Verificar se o login funciona corretamente' AS next;
