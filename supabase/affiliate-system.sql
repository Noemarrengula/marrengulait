-- ================================================
-- FASE B: ATUALIZAR SISTEMA DE AFILIADOS
-- Execute este SQL no Supabase SQL Editor
-- ================================================

-- 1. Adicionar colunas que faltam
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS total_clicks INTEGER DEFAULT 0;
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS total_conversions INTEGER DEFAULT 0;

-- 2. Criar função para criar afiliado
CREATE OR REPLACE FUNCTION create_affiliate(target_user_id UUID)
RETURNS affiliates
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_affiliate affiliates;
    generated_code TEXT;
BEGIN
    SELECT * INTO new_affiliate FROM affiliates WHERE user_id = target_user_id;
    IF new_affiliate IS NOT NULL THEN
        RETURN new_affiliate;
    END IF;
    generated_code := 'AFF' || UPPER(SUBSTRING(target_user_id::TEXT, 1, 6));
    INSERT INTO affiliates (user_id, referral_code, commission_rate, total_clicks, total_conversions, total_earnings, is_active)
    VALUES (target_user_id, generated_code, 15, 0, 0, 0, true)
    RETURNING * INTO new_affiliate;
    RETURN new_affiliate;
END;
$$;

-- 3. Criar índice
CREATE INDEX IF NOT EXISTS idx_affiliates_referral_code ON affiliates(referral_code);

-- 4. Atualizar afiliados existentes com código e 15% comissão
UPDATE affiliates SET 
    referral_code = 'AFF' || UPPER(SUBSTRING(user_id::TEXT, 1, 6)),
    commission_rate = 15,
    total_clicks = COALESCE(total_clicks, 0),
    total_conversions = COALESCE(total_conversions, 0)
WHERE referral_code IS NULL;

-- 5. Verificar resultado
SELECT id, user_id, referral_code, commission_rate, total_clicks, total_conversions, total_earnings FROM affiliates LIMIT 5;
