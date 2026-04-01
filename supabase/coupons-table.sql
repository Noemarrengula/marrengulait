-- ============================================
-- TABELA DE CUPÕES (atualizar existente)
-- ============================================

-- Verificar se a tabela existe
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'coupons';

-- Se existir, adicionar colunas em falta
ALTER TABLE coupons 
ADD COLUMN IF NOT EXISTS min_purchase DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_uses INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS current_uses INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS valid_from TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS valid_until TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS applicable_categories TEXT[] DEFAULT NULL,
ADD COLUMN IF NOT EXISTS applicable_products UUID[] DEFAULT NULL;

-- Criar tabela se não existir
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    min_purchase DECIMAL(10,2) DEFAULT 0,
    max_uses INTEGER DEFAULT NULL,
    current_uses INTEGER DEFAULT 0,
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    applicable_categories TEXT[] DEFAULT NULL,
    applicable_products UUID[] DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_coupon_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_coupon_updated_at ON coupons;
CREATE TRIGGER update_coupon_updated_at
    BEFORE UPDATE ON coupons
    FOR EACH ROW
    EXECUTE FUNCTION update_coupon_updated_at();

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active coupons" ON coupons;
DROP POLICY IF EXISTS "Admin can manage coupons" ON coupons;

CREATE POLICY "Anyone can view active coupons"
    ON coupons FOR SELECT
    USING (
        is_active = TRUE 
        AND (valid_from IS NULL OR valid_from <= NOW())
        AND (valid_until IS NULL OR valid_until >= NOW())
        AND (max_uses IS NULL OR current_uses < max_uses)
    );

CREATE POLICY "Admin can manage coupons"
    ON coupons FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

-- ============================================
-- FUNÇÃO PARA VALIDAR CUPÃO
-- ============================================

CREATE OR REPLACE FUNCTION validate_coupon(
    p_code VARCHAR,
    p_subtotal DECIMAL,
    p_product_ids UUID[] DEFAULT NULL,
    p_category VARCHAR DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_coupon coupons%ROWTYPE;
    v_discount DECIMAL(10,2);
    v_is_valid BOOLEAN := FALSE;
    v_error_message TEXT := NULL;
BEGIN
    -- Buscar cupão
    SELECT * INTO v_coupon
    FROM coupons
    WHERE UPPER(code) = UPPER(p_code)
    AND is_active = TRUE;

    -- Verificar se cupão existe
    IF v_coupon.id IS NULL THEN
        RETURN jsonb_build_object(
            'is_valid', FALSE,
            'error_message', 'Cupão não encontrado'
        );
    END IF;

    -- Verificar data de início
    IF v_coupon.valid_from > NOW() THEN
        RETURN jsonb_build_object(
            'is_valid', FALSE,
            'error_message', 'Este cupão ainda não está ativo'
        );
    END IF;

    -- Verificar data de expiração
    IF v_coupon.valid_until IS NOT NULL AND v_coupon.valid_until < NOW() THEN
        RETURN jsonb_build_object(
            'is_valid', FALSE,
            'error_message', 'Este cupão já expirou'
        );
    END IF;

    -- Verificar limite de usos
    IF v_coupon.max_uses IS NOT NULL AND v_coupon.current_uses >= v_coupon.max_uses THEN
        RETURN jsonb_build_object(
            'is_valid', FALSE,
            'error_message', 'Este cupão já atingiu o limite de utilizações'
        );
    END IF;

    -- Verificar compra mínima
    IF v_coupon.min_purchase > 0 AND p_subtotal < v_coupon.min_purchase THEN
        RETURN jsonb_build_object(
            'is_valid', FALSE,
            'error_message', 'O valor mínimo de compra é ' || v_coupon.min_purchase
        );
    END IF;

    -- Calcular desconto
    IF v_coupon.discount_type = 'percentage' THEN
        v_discount := p_subtotal * (v_coupon.discount_value / 100);
    ELSE
        v_discount := v_coupon.discount_value;
    END IF;

    -- Não permitir desconto maior que o subtotal
    IF v_discount > p_subtotal THEN
        v_discount := p_subtotal;
    END IF;

    RETURN jsonb_build_object(
        'is_valid', TRUE,
        'coupon_id', v_coupon.id,
        'code', v_coupon.code,
        'discount_type', v_coupon.discount_type,
        'discount_value', v_coupon.discount_value,
        'discount_amount', v_discount,
        'error_message', NULL
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNÇÃO PARA APLICAR CUPÃO (incrementa uso)
-- ============================================

CREATE OR REPLACE FUNCTION apply_coupon(p_code VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
    v_updated INTEGER;
BEGIN
    UPDATE coupons
    SET current_uses = current_uses + 1
    WHERE UPPER(code) = UPPER(p_code)
    AND is_active = TRUE
    AND (max_uses IS NULL OR current_uses < max_uses);

    GET DIAGNOSTICS v_updated = ROW_COUNT;
    
    RETURN v_updated > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- DADOS DE EXEMPLO
-- ============================================

INSERT INTO coupons (code, discount_type, discount_value, min_purchase, max_uses, valid_from, valid_until, is_active)
VALUES 
    ('BEMVINDO10', 'percentage', 10.00, 0, 1000, NOW(), NOW() + INTERVAL '90 days', TRUE),
    ('FRETE30', 'percentage', 30.00, 500, 500, NOW(), NOW() + INTERVAL '30 days', TRUE),
    ('BLACKFRIDAY', 'percentage', 25.00, 0, NULL, NOW(), NOW() + INTERVAL '7 days', TRUE),
    ('PRIMEIRACOMPRA', 'fixed', 100.00, 500, 100, NOW(), NOW() + INTERVAL '180 days', TRUE)
ON CONFLICT (code) DO NOTHING;

-- Verificar resultado
SELECT * FROM coupons;
