-- ============================================================================
-- SCRIPT: Adicionar colunas de pagamento à tabela orders
-- Executar no Supabase SQL Editor
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

SELECT '✅ Colunas de pagamento adicionadas à tabela orders!' AS status;
