-- ============================================
-- TABELA DE WISHLISTS
-- ============================================

CREATE TABLE IF NOT EXISTS wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Índice para queries
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_product_id ON wishlists(product_id);

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own wishlist" ON wishlists;
DROP POLICY IF EXISTS "Users can manage own wishlist" ON wishlists;

CREATE POLICY "Users can view own wishlist"
    ON wishlists FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can add to wishlist"
    ON wishlists FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from wishlist"
    ON wishlists FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- FUNÇÃO PARA PARTILHAR WISHLIST
-- ============================================

CREATE OR REPLACE FUNCTION get_wishlist_share_link(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
    v_share_token TEXT;
BEGIN
    -- Criar token único para partilha
    v_share_token := encode(gen_random_bytes(16), 'hex');
    
    -- Guardar token (simplificado - em produção usar tabela separada)
    RETURN '/wishlist/shared/' || v_share_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- VERIFICAR
-- ============================================

SELECT 'Wishlists table created successfully' AS status;
