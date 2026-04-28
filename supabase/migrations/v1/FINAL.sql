-- MARRENGULA-IT MIGRATION v010 FINAL
CREATE SCHEMA IF NOT EXISTS business;
CREATE SCHEMA IF NOT EXISTS system;

-- Clients
CREATE TABLE IF NOT EXISTS business.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT, nuit TEXT, address TEXT,
    city TEXT DEFAULT 'Maputo', province TEXT DEFAULT 'Maputo', country TEXT DEFAULT 'Mozambique',
    contact_person TEXT, contact_email TEXT, contact_phone TEXT, preferencial_payment TEXT,
    notes TEXT, is_vip BOOLEAN DEFAULT false, is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services
CREATE TABLE IF NOT EXISTS business.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL, name TEXT NOT NULL, description TEXT, category TEXT NOT NULL,
    base_price NUMERIC NOT NULL, price_basic NUMERIC NOT NULL, price_professional NUMERIC NOT NULL, price_enterprise NUMERIC NOT NULL,
    unit TEXT DEFAULT 'unidade', duration_minutes INTEGER,
    is_active BOOLEAN DEFAULT true, is_featured BOOLEAN DEFAULT false, sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quotes
CREATE TABLE IF NOT EXISTS business.quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_number TEXT UNIQUE NOT NULL, client_id UUID, user_id UUID, service_id UUID,
    service_level TEXT DEFAULT 'basic', quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC NOT NULL, total_price NUMERIC NOT NULL, notes TEXT,
    validity_days INTEGER DEFAULT 15, valid_until TIMESTAMP WITH TIME ZONE, status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS business.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL, quote_id UUID, client_id UUID, user_id UUID,
    total_amount NUMERIC NOT NULL, payment_method TEXT, payment_reference TEXT,
    payment_status TEXT DEFAULT 'pending', status TEXT DEFAULT 'pending', notes TEXT,
    scheduled_date DATE, completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tickets
CREATE TABLE IF NOT EXISTS business.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number TEXT UNIQUE NOT NULL, client_id UUID, user_id UUID,
    category TEXT NOT NULL, priority TEXT DEFAULT 'medium', subject TEXT NOT NULL, description TEXT NOT NULL,
    status TEXT DEFAULT 'open', assigned_to UUID, resolution TEXT, client_rating INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), closed_at TIMESTAMP WITH TIME ZONE
);

-- System
CREATE TABLE IF NOT EXISTS system.logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID, action TEXT NOT NULL,
    entity_type TEXT, entity_id UUID, details JSONB DEFAULT '{}',
    ip_address TEXT, user_agent TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS system.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, title TEXT NOT NULL, message TEXT, data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false, read_at TIMESTAMP WITH TIME ZONE, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Columns
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS avg_rating DECIMAL(3,2) DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;

-- Seed Services
INSERT INTO business.services (code, name, description, category, base_price, price_basic, price_professional, price_enterprise, unit, duration_minutes) 
VALUES
    ('INST-REDE', 'Instalacao de Rede', 'Rede local ate 5 pontos', 'Redes', 5000, 5000, 8000, 12000, 'projeto', 480),
    ('INST-WIFI', 'Configuracao WiFi', 'Setup wireless', 'Redes', 2500, 2500, 4000, 6000, 'unidade', 120),
    ('INST-CCTV', 'Instalacao CCTV', 'Sistema de camaras', 'Seguranca', 15000, 15000, 25000, 40000, 'projeto', 1440),
    ('MANUT-PC', 'Manutencao PC', 'Limpeza e reparacao', 'Suporte', 1500, 1500, 2500, 4000, 'unidade', 180),
    ('INST-SERVIDOR', 'Configuracao Servidor', 'Setup servidor', 'Infraestrutura', 20000, 20000, 35000, 50000, 'projeto', 1440),
    ('CONS-TI', 'Consultoria TI', 'Consulta tecnica', 'Consultoria', 3000, 3000, 5000, 8000, 'hora', 60),
    ('DEV-WEB', 'Desenvolvimento Web', 'Website', 'Desenvolvimento', 25000, 25000, 45000, 75000, 'projeto', 2880),
    ('BACKUP', 'Solucao Backup', 'Backup automatico', 'Armazenamento', 8000, 8000, 15000, 25000, 'projeto', 480)
ON CONFLICT (code) DO NOTHING;

-- Functions
CREATE OR REPLACE FUNCTION business.generate_quote_number() RETURNS TEXT AS $$
DECLARE n TEXT;
BEGIN LOOP n := 'QT-' || TO_CHAR(NOW(),'YYMMDD') || '-' || LPAD((floor(random()*99999+1)::INTEGER)::TEXT,5,'0');
IF NOT EXISTS (SELECT 1 FROM business.quotes WHERE quote_number=n) THEN RETURN n; END IF; END LOOP;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION business.generate_ticket_number() RETURNS TEXT AS $$
DECLARE n TEXT;
BEGIN LOOP n := 'TK-' || TO_CHAR(NOW(),'YYMMDD') || '-' || LPAD((floor(random()*99999+1)::INTEGER)::TEXT,5,'0');
IF NOT EXISTS (SELECT 1 FROM business.tickets WHERE ticket_number=n) THEN RETURN n; END IF; END LOOP;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION business.calculate_quote(p_service_id UUID, p_quantity INTEGER DEFAULT 1, p_level TEXT DEFAULT 'basic', p_user_id UUID DEFAULT NULL)
RETURNS TABLE (quote_id UUID, quote_number TEXT, service_name TEXT, service_level TEXT, quantity INTEGER, unit_price NUMERIC, total_price NUMERIC, valid_until TIMESTAMP WITH TIME ZONE)
AS $$
DECLARE v RECORD; v_up NUMERIC; v_tp NUMERIC; v_qid UUID; v_qn TEXT; v_vu TIMESTAMP WITH TIME ZONE;
BEGIN SELECT * INTO v FROM business.services WHERE id=p_service_id AND is_active=true;
IF NOT FOUND THEN RAISE EXCEPTION 'Service not found'; END IF;
v_up := CASE p_level WHEN 'basic' THEN v.price_basic WHEN 'professional' THEN v.price_professional WHEN 'enterprise' THEN v.price_enterprise ELSE v.price_basic END;
v_tp := v_up * p_quantity; v_vu := NOW() + INTERVAL '15 days'; v_qn := business.generate_quote_number();
INSERT INTO business.quotes (quote_number, user_id, service_id, service_level, quantity, unit_price, total_price, validity_days, valid_until, status)
VALUES (v_qn, p_user_id, p_service_id, p_level, p_quantity, v_up, v_tp, 15, v_vu, 'pending') RETURNING id INTO v_qid;
quote_id := v_qid; quote_number := v_qn; service_name := v.name; service_level := p_level;
quantity := p_quantity; unit_price := v_up; total_price := v_tp; valid_until := v_vu; RETURN NEXT;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION business.create_ticket(p_user_id UUID, p_category TEXT, p_subject TEXT, p_description TEXT, p_priority TEXT DEFAULT 'medium')
RETURNS TABLE (ticket_id UUID, ticket_number TEXT, status TEXT)
AS $$
DECLARE v_cid UUID; v_tid UUID; v_tn TEXT;
BEGIN SELECT id INTO v_cid FROM business.clients WHERE user_id=p_user_id;
IF NOT FOUND THEN INSERT INTO business.clients (user_id) VALUES (p_user_id) RETURNING id INTO v_cid; END IF;
v_tn := business.generate_ticket_number();
INSERT INTO business.tickets (ticket_number, client_id, user_id, category, priority, subject, description, status)
VALUES (v_tn, v_cid, p_user_id, p_category, p_priority, p_subject, p_description, 'open') RETURNING id INTO v_tid;
ticket_id := v_tid; ticket_number := v_tn; status := 'open'; RETURN NEXT;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION system.log_event(p_action TEXT, p_entity_type TEXT DEFAULT NULL, p_entity_id UUID DEFAULT NULL, p_details JSONB DEFAULT '{}')
RETURNS VOID AS $$ BEGIN INSERT INTO system.logs (action, entity_type, entity_id, details) VALUES (p_action, p_entity_type, p_entity_id, p_details); END; $$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE business.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE business.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE business.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE business.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE system.logs ENABLE ROW LEVEL SECURITY;

-- Verify
SELECT schemaname, tablename FROM pg_tables WHERE schemaname IN ('business', 'system') ORDER BY schemaname, tablename;