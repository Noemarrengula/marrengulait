-- ============================================================================
-- SCRIPT: Reviews de Exemplo para Marrengula-IT
-- Executar no Supabase SQL Editor
-- ============================================================================

-- Primeiro, verificar se a tabela reviews existe
DO $$ BEGIN
    -- Verificar se reviews_count existe na tabela products
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS avg_rating DECIMAL(3,2) DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Inserir reviews de exemplo (para demonstration)
-- Estes são reviews fictícios para mostrar o sistema em ação
INSERT INTO public.reviews (product_id, user_id, rating, title, comment, is_verified_purchase, is_approved, helpful_count, created_at)
SELECT 
    p.id,
    p.user_id,
    5,
    'Excelente produto!',
    'Produtíssimo de excelente qualidade. Chegou bem embalado e dentro do prazo. Recomendo a todos!',
    true,
    true,
    15,
    NOW() - INTERVAL '7 days'
FROM products p
WHERE p.name LIKE '%Samsung%' OR p.name LIKE '%iPhone%'
LIMIT 3
ON CONFLICT DO NOTHING;

INSERT INTO public.reviews (product_id, user_id, rating, title, comment, is_verified_purchase, is_approved, helpful_count, created_at)
SELECT 
    p.id,
    p.user_id,
    4,
    'Muito bom, mas...',
    'O produto é bom, mas achei que o preço poderia ser melhor. De resto, satisfeito com a compra.',
    true,
    true,
    8,
    NOW() - INTERVAL '5 days'
FROM products p
WHERE p.name LIKE '%Dell%' OR p.name LIKE '%HP%'
LIMIT 2
ON CONFLICT DO NOTHING;

INSERT INTO public.reviews (product_id, user_id, rating, title, comment, is_verified_purchase, is_approved, helpful_count, created_at)
SELECT 
    p.id,
    p.user_id,
    5,
    'Superou expectativas!',
    'Não esperava tanta qualidade pelo preço. O atendimento também foi excepcional. Parabéns Marrengula-IT!',
    true,
    true,
    12,
    NOW() - INTERVAL '3 days'
FROM products p
WHERE p.category = 'CCTV' OR p.category = 'Electrónica'
LIMIT 3
ON CONFLICT DO NOTHING;

-- Atualizar contador de reviews e rating médio para cada produto
UPDATE public.products p
SET 
    reviews_count = (
        SELECT COUNT(*) 
        FROM public.reviews r 
        WHERE r.product_id = p.id AND r.is_approved = true
    ),
    avg_rating = (
        SELECT COALESCE(AVG(r.rating), 0)::DECIMAL(3,2)
        FROM public.reviews r 
        WHERE r.product_id = p.id AND r.is_approved = true
    );

SELECT '✅ Reviews de exemplo criados com sucesso!' AS status;
SELECT 'Total de produtos atualizados:' AS info;
SELECT COUNT(*) FROM public.products WHERE reviews_count > 0;
