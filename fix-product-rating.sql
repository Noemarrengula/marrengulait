-- ============================================================================
-- SCRIPT: Adicionar colunas de rating à tabela products
-- Executar no Supabase SQL Editor
-- ============================================================================

-- Adicionar colunas se não existirem
DO $$ BEGIN
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS avg_rating DECIMAL(3,2) DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Criar função para atualizar rating automaticamente
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.products
    SET 
        reviews_count = (
            SELECT COUNT(*) 
            FROM public.reviews 
            WHERE product_id = NEW.product_id AND is_approved = true
        ),
        avg_rating = (
            SELECT COALESCE(AVG(rating)::DECIMAL(3,2), 0)
            FROM public.reviews 
            WHERE product_id = NEW.product_id AND is_approved = true
        )
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para atualizar rating quando uma review é inserida
DROP TRIGGER IF EXISTS trigger_update_product_rating ON public.reviews;
CREATE TRIGGER trigger_update_product_rating
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_product_rating();

SELECT '✅ Colunas de rating adicionadas!' AS status;
SELECT '✅ Função de atualização automática criada!' AS info;
