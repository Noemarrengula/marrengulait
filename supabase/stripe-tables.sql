-- ============================================
-- TABELAS PARA INTEGRAÇÃO STRIPE
-- ============================================

-- Tabela para guardar customers do Stripe
CREATE TABLE IF NOT EXISTS stripe_customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_customer_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela para guardar subscriptions (se necessário no futuro)
CREATE TABLE IF NOT EXISTS stripe_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
    stripe_customer_id VARCHAR(255),
    status VARCHAR(50),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EXTENSÃO À TABELA ORDERS PARA PAGAMENTOS
-- ============================================

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'other',
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS paypal_order_id VARCHAR(255);

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;

-- Stripe customers policies
CREATE POLICY "Users can view own stripe customer"
    ON stripe_customers FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stripe customer"
    ON stripe_customers FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Stripe subscriptions policies
CREATE POLICY "Users can view own subscriptions"
    ON stripe_subscriptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
    ON stripe_subscriptions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================
-- FUNÇÃO PARA WEBHOOK DO STRIPE
-- ============================================

CREATE OR REPLACE FUNCTION handle_stripe_payment_success()
RETURNS TRIGGER AS $$
DECLARE
    v_order_id UUID;
BEGIN
    IF NEW.type = 'payment_intent.succeeded' THEN
        -- Atualizar order com pagamento confirmado
        UPDATE orders
        SET 
            payment_status = 'paid',
            paid_at = NOW(),
            updated_at = NOW()
        WHERE stripe_payment_intent_id = NEW.data->>'object'->>'id';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNÇÃO PARA CRIAR STRIPE CUSTOMER
-- ============================================

CREATE OR REPLACE FUNCTION create_stripe_customer(p_user_id UUID, p_email VARCHAR)
RETURNS stripe_customers AS $$
DECLARE
    v_customer stripe_customers;
    v_stripe_id VARCHAR(255);
BEGIN
    -- Verificar se já existe
    SELECT * INTO v_customer
    FROM stripe_customers
    WHERE user_id = p_user_id;
    
    IF v_customer.id IS NOT NULL THEN
        RETURN v_customer;
    END IF;
    
    -- Criar customer no Stripe (via API externa)
    -- Por agora, apenas guardar localmente
    INSERT INTO stripe_customers (user_id, stripe_customer_id, email)
    VALUES (p_user_id, 'cus_' || gen_random_uuid(), p_email)
    RETURNING * INTO v_customer;
    
    RETURN v_customer;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- VERIFICAR CRIAÇÃO
-- ============================================

SELECT 'Stripe tables created successfully' AS status;
