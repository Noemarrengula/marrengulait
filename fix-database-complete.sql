-- ============================================================================
-- SCRIPT DE CORREÇÃO E EXPANSÃO - MARRENGULA-IT
-- Executar no Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- 1. CORRIGIR TABELA PRODUCTS - Adicionar store_name
-- ============================================================================

-- Adicionar coluna store_name se não existir
DO $$ BEGIN
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS store_name TEXT DEFAULT 'MarrengulaIT';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Atualizar valores existentes
UPDATE public.products SET store_name = 'MarrengulaIT' WHERE store_name IS NULL;

-- ============================================================================
-- 2. CRIAR TABELAS EM FALTA
-- ============================================================================

-- Tabela price_history
CREATE TABLE IF NOT EXISTS public.price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    old_price DECIMAL(10,2) NOT NULL,
    new_price DECIMAL(10,2) NOT NULL,
    changed_by UUID REFERENCES auth.users(id),
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para price_history
CREATE INDEX IF NOT EXISTS idx_price_history_product_id ON public.price_history(product_id);
CREATE INDEX IF NOT EXISTS idx_price_history_created_at ON public.price_history(created_at DESC);

-- Tabela points_transactions
CREATE TABLE IF NOT EXISTS public.points_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    points INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    transaction_type TEXT NOT NULL, -- 'earn', 'redeem', 'expire', 'adjust'
    description TEXT,
    reference_type TEXT,
    reference_id UUID,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para points_transactions
CREATE INDEX IF NOT EXISTS idx_points_transactions_user_id ON public.points_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_created_at ON public.points_transactions(created_at DESC);

-- Tabela product_badges
CREATE TABLE IF NOT EXISTS public.product_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    color TEXT DEFAULT '#6366f1',
    background_color TEXT DEFAULT '#e0e7ff',
    icon TEXT,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Badges padrão
INSERT INTO public.product_badges (name, slug, color, background_color, icon, description) VALUES
    ('Novo', 'novo', '#10b981', '#d1fae5', 'sparkles', 'Produto recém adicionado'),
    ('Promoção', 'promocao', '#ef4444', '#fee2e2', 'percent', 'Em promoção especial'),
    ('Mais Vendido', 'mais-vendido', '#f59e0b', '#fef3c7', 'trending-up', 'Produto mais vendido'),
    ('Favorito', 'favorito', '#ec4899', '#fce7f3', 'heart', 'Escolha dos clientes'),
    ('Frete Grátis', 'frete-gratis', '#3b82f6', '#dbeafe', 'truck', 'Frete grátis disponível'),
    ('Exclusivo', 'exclusivo', '#8b5cf6', '#ede9fe', 'star', 'Produto exclusivo'),
    ('Últimas Unidades', 'ultimas-unidades', '#f97316', '#ffedd5', 'alert-triangle', 'Estoque limitado')
ON CONFLICT (slug) DO NOTHING;

-- Tabela product_badge_assignments
CREATE TABLE IF NOT EXISTS public.product_badge_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    badge_id UUID REFERENCES product_badges(id) ON DELETE CASCADE NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, badge_id)
);

-- Índices para product_badge_assignments
CREATE INDEX IF NOT EXISTS idx_product_badge_assignments_product_id ON public.product_badge_assignments(product_id);
CREATE INDEX IF NOT EXISTS idx_product_badge_assignments_badge_id ON public.product_badge_assignments(badge_id);

-- Tabela payment_methods
CREATE TABLE IF NOT EXISTS public.payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL, -- 'mpesa', 'emola', 'credit_card', 'bank_transfer'
    provider TEXT, -- 'm-pesa', 'e-mola'
    is_default BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    -- Detalhes específicos por tipo
    mpesa_number TEXT,
    emola_number TEXT,
    bank_name TEXT,
    bank_account TEXT,
    bank_nib TEXT,
    
    -- Para cartões (armazenados de forma segura)
    card_last_four TEXT,
    card_brand TEXT,
    card_exp_month INTEGER,
    card_exp_year INTEGER,
    
    -- Metadados
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para payment_methods
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON public.payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_type ON public.payment_methods(type);

-- ============================================================================
-- 3. TABELAS ADICIONAIS PARA GESTÃO COMPLETA
-- ============================================================================

-- Tabela de configuração da loja
CREATE TABLE IF NOT EXISTS public.store_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key TEXT NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    group_name TEXT DEFAULT 'general',
    is_public BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Configurações padrão
INSERT INTO public.store_settings (setting_key, setting_value, group_name, is_public) VALUES
    ('store_name', '{"value": "MarrengulaIT"}', 'general', true),
    ('store_logo', '{"value": ""}', 'general', true),
    ('store_banner', '{"value": ""}', 'general', true),
    ('contact_email', '{"value": "contato@marrengulait.co.mz"}', 'contact', true),
    ('contact_phone', '{"value": "+258 84/85 XXX XXXX"}', 'contact', true),
    ('whatsapp', '{"value": ""}', 'contact', true),
    ('address', '{"value": "Maputo, Moçambique"}', 'contact', true),
    ('currency', '{"value": "MZN"}', 'regional', true),
    ('tax_rate', '{"value": 0}', 'regional', true),
    ('min_order_value', '{"value": 0}', 'orders', true),
    ('free_shipping_threshold', '{"value": 5000}', 'shipping', true),
    ('default_shipping_cost', '{"value": 350}', 'shipping', true)
ON CONFLICT (setting_key) DO NOTHING;

-- Tabela de logs de auditoria
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- 'create', 'update', 'delete', 'login', etc
    entity_type TEXT NOT NULL, -- 'product', 'order', 'user', etc
    entity_id UUID,
    old_value JSONB,
    new_value JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);

-- Tabela de sliders/banners principais
CREATE TABLE IF NOT EXISTS public.main_sliders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    mobile_image_url TEXT,
    link_type TEXT DEFAULT 'none', -- 'none', 'product', 'category', 'url'
    link_value TEXT,
    button_text TEXT,
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. POLÍTICAS RLS PARA AS NOVAS TABELAS
-- ============================================================================

-- price_history
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read for authenticated users" ON public.price_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow insert for authenticated users" ON public.price_history FOR INSERT TO authenticated WITH CHECK (true);

-- points_transactions
ALTER TABLE public.points_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions" ON public.points_transactions FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Allow insert for authenticated users" ON public.points_transactions FOR INSERT TO authenticated WITH CHECK (true);

-- product_badges
ALTER TABLE public.product_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read for all" ON public.product_badges FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage badges" ON public.product_badges FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- product_badge_assignments
ALTER TABLE public.product_badge_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read for all" ON public.product_badge_assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage assignments" ON public.product_badge_assignments FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- payment_methods
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own payment methods" ON public.payment_methods FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can manage own payment methods" ON public.payment_methods FOR ALL TO authenticated USING (user_id = auth.uid());

-- store_settings
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public settings readable by all" ON public.store_settings FOR SELECT TO authenticated USING (is_public = true);
CREATE POLICY "Admins can manage settings" ON public.store_settings FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view all logs" ON public.audit_logs FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- main_sliders
ALTER TABLE public.main_sliders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read for all" ON public.main_sliders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage sliders" ON public.main_sliders FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- ============================================================================
-- 5. FUNÇÕES ÚTEIS
-- ============================================================================

-- Função para registrar auditoria
CREATE OR REPLACE FUNCTION public.log_audit_action(
    p_action TEXT,
    p_entity_type TEXT,
    p_entity_id UUID,
    p_old_value JSONB DEFAULT NULL,
    p_new_value JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, old_value, new_value)
    VALUES (auth.uid(), p_action, p_entity_type, p_entity_id, p_old_value, p_new_value)
    RETURNING id INTO v_log_id;
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para atualizar store_name em products
CREATE OR REPLACE FUNCTION public.update_product_store_name()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE public.products SET store_name = NEW.store_name WHERE id = NEW.product_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PRINT DE CONFIRMAÇÃO
-- ============================================================================
SELECT '✅ Script de correção executado com sucesso!' AS status;

SELECT 'Tabelas criadas:' AS info
UNION ALL SELECT '  - price_history'
UNION ALL SELECT '  - points_transactions'
UNION ALL SELECT '  - product_badges'
UNION ALL SELECT '  - product_badge_assignments'
UNION ALL SELECT '  - payment_methods'
UNION ALL SELECT '  - store_settings'
UNION ALL SELECT '  - audit_logs'
UNION ALL SELECT '  - main_sliders';
