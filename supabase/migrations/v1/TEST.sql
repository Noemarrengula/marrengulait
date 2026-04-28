-- Test migration - execute this first
CREATE SCHEMA IF NOT EXISTS business;
CREATE SCHEMA IF NOT EXISTS system;

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

ALTER TABLE business.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "s_select" ON business.services FOR SELECT USING (is_active = true);

SELECT 'Test passed - schemas and basic table created' AS result;