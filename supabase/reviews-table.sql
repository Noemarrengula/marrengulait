-- ============================================
-- TABELA DE REVIEWS/PRODUTO
-- ============================================

-- Criar tabela de reviews
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para queries frequentes
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON reviews(is_approved);

-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS POLICIES
-- ============================================

-- Desativar RLS temporariamente para setup
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;

-- Eliminar policies existentes
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON reviews;
DROP POLICY IF EXISTS "Users can insert own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can manage all reviews" ON reviews;
DROP POLICY IF EXISTS "Public read" ON reviews;

-- Policies permissivas
CREATE POLICY "Anyone can view approved reviews"
    ON reviews FOR SELECT
    USING (is_approved = TRUE OR auth.uid() = user_id);

CREATE POLICY "Authenticated users can create reviews"
    ON reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
    ON reviews FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reviews"
    ON reviews FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

-- Reativar RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- ============================================
-- FUNÇÃO PARA APROVAR/REJEITAR REVIEWS
-- ============================================

CREATE OR REPLACE FUNCTION approve_review(review_id UUID)
RETURNS reviews AS $$
DECLARE
    approved_review reviews;
BEGIN
    UPDATE reviews
    SET is_approved = TRUE
    WHERE id = review_id
    RETURNING * INTO approved_review;
    
    RETURN approved_review;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION reject_review(review_id UUID)
RETURNS reviews AS $$
DECLARE
    rejected_review reviews;
BEGIN
    UPDATE reviews
    SET is_approved = FALSE
    WHERE id = review_id
    RETURNING * INTO rejected_review;
    
    RETURN rejected_review;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNÇÃO PARA ATUALIZAR RATINGS DO PRODUTO
-- ============================================

CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE products
        SET 
            rating = (
                SELECT COALESCE(AVG(rating), 0)
                FROM reviews
                WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
                AND is_approved = TRUE
            ),
            reviews_count = (
                SELECT COUNT(*)
                FROM reviews
                WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
                AND is_approved = TRUE
            )
        WHERE id = COALESCE(NEW.product_id, OLD.product_id);
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE products
        SET 
            rating = (
                SELECT COALESCE(AVG(rating), 0)
                FROM reviews
                WHERE product_id = OLD.product_id
                AND is_approved = TRUE
            ),
            reviews_count = (
                SELECT COUNT(*)
                FROM reviews
                WHERE product_id = OLD.product_id
                AND is_approved = TRUE
            )
        WHERE id = OLD.product_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para actualizar rating do produto quando review é aprovada
DROP TRIGGER IF EXISTS update_product_rating_trigger ON reviews;
CREATE TRIGGER update_product_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_product_rating();

-- ============================================
-- VERIFICAR CRIAÇÃO
-- ============================================

SELECT 'Reviews table created successfully' AS status;
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'reviews';
