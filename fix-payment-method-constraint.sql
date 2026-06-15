-- ============================================================================
-- SCRIPT: Corrigir constraint de payment_method na tabela orders
-- Executar no Supabase SQL Editor
-- ============================================================================

-- Primeiro, verificar a constraint atual
-- DROP a constraint antiga se existir e recriar com o novo valor

DO $$ BEGIN
    ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;
EXCEPTION WHEN undefined_object THEN NULL;
END $$;

-- Recriar a constraint com o valor 'emola' incluído
ALTER TABLE public.orders ADD CONSTRAINT orders_payment_method_check 
CHECK (payment_method IN ('mpesa', 'emola', 'bank_transfer', 'credit_card', 'cash_on_delivery', 'cod', 'transfer'));

SELECT '✅ Constraint payment_method atualizada com sucesso!' AS status;
SELECT 'Valores permitidos: mpesa, emola, bank_transfer, credit_card, cash_on_delivery, cod, transfer' AS info;
