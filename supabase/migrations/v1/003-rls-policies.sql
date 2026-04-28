-- ================================================
-- MARRENGULA-IT DATABASE SCHEMA - SYSTEM & RLS
-- Migration v1.003: Schema system + Security Policies
-- ================================================

-- ================================================
-- 1. CRIAR SCHEMA SYSTEM
-- ================================================
CREATE SCHEMA IF NOT EXISTS system;

-- ================================================
-- 2. SYSTEM.LOGS (Registo de Eventos)
-- ================================================
CREATE TABLE IF NOT EXISTS system.logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    details JSONB DEFAULT '{}',
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 3. SYSTEM.NOTIFICATIONS (Alertas)
-- ================================================
CREATE TABLE IF NOT EXISTS system.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- Funções - SYSTEM
-- ================================================

-- Função para registar logs
CREATE OR REPLACE FUNCTION system.log_event(
    p_action TEXT,
    p_entity_type TEXT DEFAULT NULL,
    p_entity_id UUID DEFAULT NULL,
    p_details JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO system.logs (action, entity_type, entity_id, details)
    VALUES (p_action, p_entity_type, p_entity_id, p_details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================

-- 1. PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 2. PRODUCTS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by all" ON public.products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Vendors can manage own products" ON public.products
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.vendors WHERE user_id = auth.uid() AND id = vendor_id)
    );

CREATE POLICY "Admins can manage all products" ON public.products
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 3. ORDERS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own orders" ON public.orders
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all orders" ON public.orders
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 4. ORDER_ITEMS
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Order items viewable by owners and admins" ON public.order_items
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
        OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 5. CART_ITEMS
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own cart" ON public.cart_items
    FOR ALL USING (user_id = auth.uid());

-- 6. FAVORITES
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own favorites" ON public.favorites
    FOR ALL USING (user_id = auth.uid());

-- 7. REVIEWS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved reviews" ON public.reviews
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can insert reviews" ON public.reviews
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own reviews" ON public.reviews
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all reviews" ON public.reviews
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 8. COUPONS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active coupons" ON public.coupons
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage coupons" ON public.coupons
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 9. PAYMENTS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own payments" ON public.payments
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins view all payments" ON public.payments
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 10. BUSINESS.CLIENTS
ALTER TABLE business.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own client data" ON business.clients
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own client data" ON business.clients
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own client data" ON business.clients
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all clients" ON business.clients
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 11. BUSINESS.QUOTES
ALTER TABLE business.quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own quotes" ON business.quotes
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users create quotes via function" ON business.quotes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users update own quotes if pending" ON business.quotes
    FOR UPDATE USING (user_id = auth.uid() AND status = 'pending');

CREATE POLICY "Admins view all quotes" ON business.quotes
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 12. BUSINESS.ORDERS
ALTER TABLE business.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own service orders" ON business.orders
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users create orders via function" ON business.orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins view all service orders" ON business.orders
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 13. BUSINESS.TICKETS
ALTER TABLE business.tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own tickets" ON business.tickets
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users create tickets via function" ON business.tickets
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users update own tickets" ON business.tickets
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins view all tickets" ON business.tickets
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins update tickets" ON business.tickets
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 14. BUSINESS.SERVICES
ALTER TABLE business.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active services" ON business.services
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage services" ON business.services
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 15. SYSTEM.LOGS
ALTER TABLE system.logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view logs" ON system.logs
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 16. SYSTEM.NOTIFICATIONS
ALTER TABLE system.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own notifications" ON system.notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users update own notifications" ON system.notifications
    FOR UPDATE USING (user_id = auth.uid());

-- ================================================
-- Funções para obter perfil do utilizador
-- ================================================

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
BEGIN
    RETURN COALESCE(
        (SELECT role FROM public.profiles WHERE id = auth.uid()),
        'client'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- Trigger para logs automáticos
-- ================================================

CREATE OR REPLACE FUNCTION system.auto_log()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO system.logs (action, entity_type, entity_id, details)
    VALUES (
        TG_OP,
        TG_TABLE_NAME,
        NEW.id,
        jsonb_build_array(row_to_json(NEW))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- INDEXES - SYSTEM
-- ================================================
CREATE INDEX IF NOT EXISTS idx_system_logs_user ON system.logs(user_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_action ON system.logs(action);
CREATE INDEX IF NOT EXISTS idx_system_logs_created ON system.logs(created_at);
CREATE INDEX IF NOT EXISTS idx_system_notifications_user ON system.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_system_notifications_read ON system.notifications(is_read);

SELECT '✅ Schema System e RLS criados com sucesso!' AS status;
