-- ================================================
-- MARRENGULA-IT DATABASE SCHEMA - BUSINESS
-- Migration v1.002: Schema business
-- ================================================

-- ================================================
-- 1. CRIAR SCHEMA BUSINESS
-- ================================================
CREATE SCHEMA IF NOT EXISTS business;

-- ================================================
-- 2. BUSINESS.CLIENTS (Clientes Marrengula-IT)
-- ================================================
CREATE TABLE IF NOT EXISTS business.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT,
    nuit TEXT,
    address TEXT,
    city TEXT DEFAULT 'Maputo',
    province TEXT DEFAULT 'Maputo',
    country TEXT DEFAULT 'Moçambique',
    contact_person TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    preferencial_payment TEXT CHECK (preferencial_payment IN ('mpesa', 'emola', 'transfer', 'cod')),
    notes TEXT,
    is_vip BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 3. BUSINESS.SERVICES (Serviços TI Oferecidos)
-- ================================================
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
    unit TEXT DEFAULT 'unidade' CHECK (unit IN ('unidade', 'hora', 'dia', 'metro', 'projeto')),
    duration_minutes INTEGER,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 4. BUSINESS.QUOTES (Orçamentos)
-- ================================================
CREATE TABLE IF NOT EXISTS business.quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_number TEXT UNIQUE NOT NULL,
    client_id UUID REFERENCES business.clients(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    service_id UUID REFERENCES business.services(id) ON DELETE SET NULL,
    service_level TEXT DEFAULT 'basic' CHECK (service_level IN ('basic', 'professional', 'enterprise')),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC NOT NULL,
    total_price NUMERIC NOT NULL,
    notes TEXT,
    validity_days INTEGER DEFAULT 15,
    valid_until TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'converted', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 5. BUSINESS.ORDERS (Pedidos de Serviços)
-- ================================================
CREATE TABLE IF NOT EXISTS business.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    quote_id UUID REFERENCES business.quotes(id) ON DELETE SET NULL,
    client_id UUID REFERENCES business.clients(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    total_amount NUMERIC NOT NULL,
    payment_method TEXT CHECK (payment_method IN ('mpesa', 'emola', 'transfer', 'cod')),
    payment_reference TEXT,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'confirmed', 'cancelled')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    notes TEXT,
    scheduled_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 6. BUSINESS.TICKETS (Suporte Técnico)
-- ================================================
CREATE TABLE IF NOT EXISTS business.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number TEXT UNIQUE NOT NULL,
    client_id UUID REFERENCES business.clients(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    category TEXT NOT NULL CHECK (category IN ('support', 'billing', 'technical', 'sales', 'other')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    assigned_to UUID REFERENCES auth.users(id),
    resolution TEXT,
    client_rating INTEGER CHECK (client_rating BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE
);

-- ================================================
-- Funções Auxiliares - BUSINESS
-- ================================================

-- Gerar número de orçamento único
CREATE OR REPLACE FUNCTION business.generate_quote_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
BEGIN
    LOOP
        new_number := 'QT-' || TO_CHAR(NOW(), 'YYMMDD') || '-' || LPAD((floor(random() * 99999 + 1)::INTEGER)::TEXT, 5, '0');
        IF NOT EXISTS (SELECT 1 FROM business.quotes WHERE quote_number = new_number) THEN
            RETURN new_number;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Gerar número de ticket único
CREATE OR REPLACE FUNCTION business.generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
BEGIN
    LOOP
        new_number := 'TK-' || TO_CHAR(NOW(), 'YYMMDD') || '-' || LPAD((floor(random() * 99999 + 1)::INTEGER)::TEXT, 5, '0');
        IF NOT EXISTS (SELECT 1 FROM business.tickets WHERE ticket_number = new_number) THEN
            RETURN new_number;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Gerar número de pedido de serviço único
CREATE OR REPLACE FUNCTION business.generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
BEGIN
    LOOP
        new_number := 'SV-' || TO_CHAR(NOW(), 'YYMMDD') || '-' || LPAD((floor(random() * 99999 + 1)::INTEGER)::TEXT, 5, '0');
        IF NOT EXISTS (SELECT 1 FROM business.orders WHERE order_number = new_number) THEN
            RETURN new_number;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- Função Principal: Calcular Orçamento
-- ================================================
CREATE OR REPLACE FUNCTION business.calculate_quote(
    p_service_id UUID,
    p_quantity INTEGER DEFAULT 1,
    p_level TEXT DEFAULT 'basic',
    p_user_id UUID DEFAULT NULL
)
RETURNS TABLE (
    quote_id UUID,
    quote_number TEXT,
    service_name TEXT,
    service_level TEXT,
    quantity INTEGER,
    unit_price NUMERIC,
    total_price NUMERIC,
    valid_until TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    v_service RECORD;
    v_unit_price NUMERIC;
    v_total_price NUMERIC;
    v_quote_id UUID;
    v_quote_number TEXT;
    v_valid_until TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Buscar informações do serviço
    SELECT * INTO v_service FROM business.services WHERE id = p_service_id AND is_active = true;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Serviço não encontrado ou inativo';
    END IF;

    -- Calcular preço baseado no nível
    v_unit_price := CASE p_level
        WHEN 'basic' THEN v_service.price_basic
        WHEN 'professional' THEN v_service.price_professional
        WHEN 'enterprise' THEN v_service.price_enterprise
        ELSE v_service.price_basic
    END;

    v_total_price := v_unit_price * p_quantity;
    v_valid_until := NOW() + INTERVAL '15 days';
    v_quote_number := business.generate_quote_number();

    -- Inserir orçamento
    INSERT INTO business.quotes (
        quote_number, user_id, service_id, service_level,
        quantity, unit_price, total_price, validity_days, valid_until, status
    ) VALUES (
        v_quote_number, p_user_id, p_service_id, p_level,
        p_quantity, v_unit_price, v_total_price, 15, v_valid_until, 'pending'
    ) RETURNING id INTO v_quote_id;

    -- Retornar resultado
    quote_id := v_quote_id;
    quote_number := v_quote_number;
    service_name := v_service.name;
    service_level := p_level;
    quantity := p_quantity;
    unit_price := v_unit_price;
    total_price := v_total_price;
    valid_until := v_valid_until;

    RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- Função: Criar Pedido a partir de Orçamento
-- ================================================
CREATE OR REPLACE FUNCTION business.create_order(
    p_quote_id UUID,
    p_payment_method TEXT DEFAULT 'mpesa',
    p_notes TEXT DEFAULT NULL
)
RETURNS TABLE (
    order_id UUID,
    order_number TEXT,
    total_amount NUMERIC,
    status TEXT
) AS $$
DECLARE
    v_quote RECORD;
    v_order_id UUID;
    v_order_number TEXT;
BEGIN
    -- Buscar orçamento
    SELECT * INTO v_quote FROM business.quotes WHERE id = p_quote_id AND status = 'pending';
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Orçamento não encontrado ou já processado';
    END IF;

    v_order_number := business.generate_order_number();

    -- Criar pedido
    INSERT INTO business.orders (
        order_number, quote_id, client_id, user_id,
        total_amount, payment_method, notes, status
    ) VALUES (
        v_order_number, p_quote_id, v_quote.client_id, v_quote.user_id,
        v_quote.total_price, p_payment_method, p_notes, 'pending'
    ) RETURNING id INTO v_order_id;

    -- Atualizar status do orçamento
    UPDATE business.quotes SET status = 'converted' WHERE id = p_quote_id;

    -- Retornar resultado
    order_id := v_order_id;
    order_number := v_order_number;
    total_amount := v_quote.total_price;
    status := 'pending';

    RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- Função: Criar Ticket de Suporte
-- ================================================
CREATE OR REPLACE FUNCTION business.create_ticket(
    p_user_id UUID,
    p_category TEXT,
    p_subject TEXT,
    p_description TEXT,
    p_priority TEXT DEFAULT 'medium'
)
RETURNS TABLE (
    ticket_id UUID,
    ticket_number TEXT,
    status TEXT
) AS $$
DECLARE
    v_client_id UUID;
    v_ticket_id UUID;
    v_ticket_number TEXT;
BEGIN
    -- Buscar ou criar cliente
    SELECT id INTO v_client_id FROM business.clients WHERE user_id = p_user_id;
    IF NOT FOUND THEN
        INSERT INTO business.clients (user_id) VALUES (p_user_id) RETURNING id INTO v_client_id;
    END IF;

    v_ticket_number := business.generate_ticket_number();

    INSERT INTO business.tickets (
        ticket_number, client_id, user_id, category,
        priority, subject, description, status
    ) VALUES (
        v_ticket_number, v_client_id, p_user_id, p_category,
        p_priority, p_subject, p_description, 'open'
    ) RETURNING id INTO v_ticket_id;

    ticket_id := v_ticket_id;
    ticket_number := v_ticket_number;
    status := 'open';

    RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- Função: Obter Dados do Cliente
-- ================================================
CREATE OR REPLACE FUNCTION business.get_client_data(p_user_id UUID)
RETURNS TABLE (
    client_id UUID,
    company_name TEXT,
    city TEXT,
    total_quotes INTEGER,
    total_orders INTEGER,
    open_tickets INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.company_name,
        c.city,
        COALESCE(q.count, 0)::INTEGER,
        COALESCE(o.count, 0)::INTEGER,
        COALESCE(t.count, 0)::INTEGER
    FROM business.clients c
    LEFT JOIN (SELECT client_id, COUNT(*) count FROM business.quotes GROUP BY client_id) q ON c.id = q.client_id
    LEFT JOIN (SELECT client_id, COUNT(*) count FROM business.orders GROUP BY client_id) o ON c.id = o.client_id
    LEFT JOIN (SELECT client_id, COUNT(*) count FROM business.tickets WHERE status = 'open' GROUP BY client_id) t ON c.id = t.client_id
    WHERE c.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- INDEXES
-- ================================================
CREATE INDEX IF NOT EXISTS idx_business_clients_user ON business.clients(user_id);
CREATE INDEX IF NOT EXISTS idx_business_services_category ON business.services(category);
CREATE INDEX IF NOT EXISTS idx_business_services_active ON business.services(is_active);
CREATE INDEX IF NOT EXISTS idx_business_quotes_user ON business.quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_business_quotes_status ON business.quotes(status);
CREATE INDEX IF NOT EXISTS idx_business_orders_user ON business.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_business_orders_status ON business.orders(status);
CREATE INDEX IF NOT EXISTS idx_business_tickets_user ON business.tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_business_tickets_status ON business.tickets(status);

-- ================================================
-- SEED: Serviços Padrão
-- ================================================
INSERT INTO business.services (code, name, description, category, base_price, price_basic, price_professional, price_enterprise, unit, duration_minutes) VALUES
    ('INST-REDE', 'Instalação de Rede', 'Instalação de rede local (LAN) até 5 pontos', 'Redes', 5000, 5000, 8000, 12000, 'projeto', 480),
    ('INST-WIFI', 'Configuração WiFi', 'Setup e configuração de rede wireless', 'Redes', 2500, 2500, 4000, 6000, 'unidade', 120),
    ('INST-CCTV', 'Instalação CCTV', 'Instalação de sistema de câmaras de vigilância', 'Segurança', 15000, 15000, 25000, 40000, 'projeto', 1440),
    ('MANUT-PC', 'Manutenção de PC', 'Limpeza, diagnóstico e reparação de computador', 'Suporte', 1500, 1500, 2500, 4000, 'unidade', 180),
    ('INST-SERVIDOR', 'Configuração de Servidor', 'Setup e configuração de servidor', 'Infraestrutura', 20000, 20000, 35000, 50000, 'projeto', 1440),
    ('CONS-TI', 'Consultoria de TI', 'Consulta técnica e recomendações', 'Consultoria', 3000, 3000, 5000, 8000, 'hora', 60),
    ('DEV-WEB', 'Desenvolvimento Web', 'Criação de website personalizado', 'Desenvolvimento', 25000, 25000, 45000, 75000, 'projeto', 2880),
    ('BACKUP', 'Solução de Backup', 'Configuração de backup automático', 'Armazenamento', 8000, 8000, 15000, 25000, 'projeto', 480)
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    updated_at = NOW();

SELECT '✅ Schema Business criado com sucesso!' AS status;