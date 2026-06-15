-- MARRENGULA-IT MIGRATION v010
CREATE SCHEMA IF NOT EXISTS business;
CREATE SCHEMA IF NOT EXISTS system;

CREATE TABLE IF NOT EXISTS business.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT,
    nuit TEXT,
    address TEXT,
    city TEXT DEFAULT 'Maputo',
    province TEXT DEFAULT 'Maputo',
    country TEXT DEFAULT 'Mozambique',
    contact_person TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    preferencial_payment TEXT,
    notes TEXT,
    is_vip BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS business.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    base_price NUMERIC NOT NULL,
    price_basic NUMERIC NOT NULL,
    price_professional NUMERIC NOT NULL,
    price_enterprise NUMERIC NOT NULL,
    unit TEXT DEFAULT 'unidade',
    duration_minutes INTEGER,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS business.quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_number TEXT UNIQUE NOT NULL,
    client_id UUID REFERENCES business.clients(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    service_id UUID REFERENCES business.services(id) ON DELETE SET NULL,
    service_level TEXT DEFAULT 'basic',
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC NOT NULL,
    total_price NUMERIC NOT NULL,
    notes TEXT,
    validity_days INTEGER DEFAULT 15,
    valid_until TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS business.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    quote_id UUID REFERENCES business.quotes(id) ON DELETE SET NULL,
    client_id UUID REFERENCES business.clients(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    total_amount NUMERIC NOT NULL,
    payment_method TEXT,
    payment_reference TEXT,
    payment_status TEXT DEFAULT 'pending',
    status TEXT DEFAULT 'pending',
    notes TEXT,
    scheduled_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS business.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number TEXT UNIQUE NOT NULL,
    client_id UUID REFERENCES business.clients(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    category TEXT NOT NULL,
    priority TEXT DEFAULT 'medium',
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'open',
    assigned_to UUID REFERENCES auth.users(id),
    resolution TEXT,
    client_rating INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE
);

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

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS avg_rating DECIMAL(3,2) DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;

INSERT INTO business.services (code, name, description, category, base_price, price_basic, price_professional, price_enterprise, unit, duration_minutes) 
VALUES
    ('INST-REDE', 'Instalacao de Rede', 'Instalacao de rede local ate 5 pontos', 'Redes', 5000, 5000, 8000, 12000, 'projeto', 480),
    ('INST-WIFI', 'Configuracao WiFi', 'Setup de rede wireless', 'Redes', 2500, 2500, 4000, 6000, 'unidade', 120),
    ('INST-CCTV', 'Instalacao CCTV', 'Sistema de camaras', 'Seguranca', 15000, 15000, 25000, 40000, 'projeto', 1440),
    ('MANUT-PC', 'Manutencao de PC', 'Limpeza e reparacao', 'Suporte', 1500, 1500, 2500, 4000, 'unidade', 180),
    ('INST-SERVIDOR', 'Configuracao de Servidor', 'Setup de servidor', 'Infraestrutura', 20000, 20000, 35000, 50000, 'projeto', 1440),
    ('CONS-TI', 'Consultoria de TI', 'Consulta tecnica', 'Consultoria', 3000, 3000, 5000, 8000, 'hora', 60),
    ('DEV-WEB', 'Desenvolvimento Web', 'Website', 'Desenvolvimento', 25000, 25000, 45000, 75000, 'projeto', 2880),
    ('BACKUP', 'Solucao de Backup', 'Backup automatico', 'Armazenamento', 8000, 8000, 15000, 25000, 'projeto', 480)
ON CONFLICT (code) DO NOTHING;

CREATE OR REPLACE FUNCTION business.generate_quote_number()
RETURNS TEXT AS $$
DECLARE new_number TEXT;
BEGIN
    LOOP
        new_number := 'QT-' || TO_CHAR(NOW(), 'YYMMDD') || '-' || LPAD((floor(random() * 99999 + 1)::INTEGER)::TEXT, 5, '0');
        IF NOT EXISTS (SELECT 1 FROM business.quotes WHERE quote_number = new_number) THEN RETURN new_number; END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION business.generate_ticket_number()
RETURNS TEXT AS $$
DECLARE new_number TEXT;
BEGIN
    LOOP
        new_number := 'TK-' || TO_CHAR(NOW(), 'YYMMDD') || '-' || LPAD((floor(random() * 99999 + 1)::INTEGER)::TEXT, 5, '0');
        IF NOT EXISTS (SELECT 1 FROM business.tickets WHERE ticket_number = new_number) THEN RETURN new_number; END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION business.calculate_quote(p_service_id UUID, p_quantity INTEGER DEFAULT 1, p_level TEXT DEFAULT 'basic', p_user_id UUID DEFAULT NULL)
RETURNS TABLE (quote_id UUID, quote_number TEXT, service_name TEXT, service_level TEXT, quantity INTEGER, unit_price NUMERIC, total_price NUMERIC, valid_until TIMESTAMP WITH TIME ZONE)
AS $$
DECLARE v_service RECORD; v_unit_price NUMERIC; v_total_price NUMERIC; v_quote_id UUID; v_quote_number TEXT; v_valid_until TIMESTAMP WITH TIME ZONE;
BEGIN
    SELECT * INTO v_service FROM business.services WHERE id = p_service_id AND is_active = true;
    IF NOT FOUND THEN RAISE EXCEPTION 'Service not found'; END IF;
    v_unit_price := CASE p_level WHEN 'basic' THEN v_service.price_basic WHEN 'professional' THEN v_service.price_professional WHEN 'enterprise' THEN v_service.price_enterprise ELSE v_service.price_basic END;
    v_total_price := v_unit_price * p_quantity;
    v_valid_until := NOW() + INTERVAL '15 days';
    v_quote_number := business.generate_quote_number();
    INSERT INTO business.quotes (quote_number, user_id, service_id, service_level, quantity, unit_price, total_price, validity_days, valid_until, status)
    VALUES (v_quote_number, p_user_id, p_service_id, p_level, p_quantity, v_unit_price, v_total_price, 15, v_valid_until, 'pending')
    RETURNING id INTO v_quote_id;
    quote_id := v_quote_id; quote_number := v_quote_number; service_name := v_service.name; service_level := p_level;
    quantity := p_quantity; unit_price := v_unit_price; total_price := v_total_price; valid_until := v_valid_until;
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION business.create_ticket(p_user_id UUID, p_category TEXT, p_subject TEXT, p_description TEXT, p_priority TEXT DEFAULT 'medium')
RETURNS TABLE (ticket_id UUID, ticket_number TEXT, status TEXT)
AS $$
DECLARE v_client_id UUID; v_ticket_id UUID; v_ticket_number TEXT;
BEGIN
    SELECT id INTO v_client_id FROM business.clients WHERE user_id = p_user_id;
    IF NOT FOUND THEN INSERT INTO business.clients (user_id) VALUES (p_user_id) RETURNING id INTO v_client_id; END IF;
    v_ticket_number := business.generate_ticket_number();
    INSERT INTO business.tickets (ticket_number, client_id, user_id, category, priority, subject, description, status)
    VALUES (v_ticket_number, v_client_id, p_user_id, p_category, p_priority, p_subject, p_description, 'open')
    RETURNING id INTO v_ticket_id;
    ticket_id := v_ticket_id; ticket_number := v_ticket_number; status := 'open';
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION system.log_event(p_action TEXT, p_entity_type TEXT DEFAULT NULL, p_entity_id UUID DEFAULT NULL, p_details JSONB DEFAULT '{}')
RETURNS VOID AS $$
BEGIN INSERT INTO system.logs (action, entity_type, entity_id, details) VALUES (p_action, p_entity_type, p_entity_id, p_details); END;
$$ LANGUAGE plpgsql;

ALTER TABLE business.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "c_select" ON business.clients FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "c_insert" ON business.clients FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "c_update" ON business.clients FOR UPDATE USING (user_id = auth.uid());

ALTER TABLE business.quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "q_select" ON business.quotes FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "q_insert" ON business.quotes FOR INSERT WITH CHECK (true);

ALTER TABLE business.tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "t_select" ON business.tickets FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "t_insert" ON business.tickets FOR INSERT WITH CHECK (true);

ALTER TABLE business.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "s_select" ON business.services FOR SELECT USING (is_active = true);

ALTER TABLE system.logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "l_select" ON system.logs FOR SELECT USING (auth.uid() IS NOT NULL);

SELECT schemaname, tablename FROM pg_tables WHERE schemaname IN ('business', 'system') ORDER BY schemaname, tablename;