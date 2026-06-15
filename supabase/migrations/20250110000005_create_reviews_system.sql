-- ============================================
-- FASE 4: SISTEMA DE AVALIAÇÕES
-- ============================================
-- Descrição: Sistema de avaliações e comentários de produtos
-- Apenas compradores verificados podem avaliar
-- Atualização automática do rating do produto
-- ============================================

-- Tabela de avaliações
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relacionamentos
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  
  -- Avaliação
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  
  -- Imagens da avaliação (fotos do produto pelo cliente)
  images JSONB DEFAULT '[]'::jsonb,
  
  -- Verificação
  is_verified_purchase BOOLEAN DEFAULT false,
  
  -- Interação
  helpful_count INTEGER DEFAULT 0,
  unhelpful_count INTEGER DEFAULT 0,
  
  -- Resposta do vendedor
  vendor_response TEXT,
  vendor_response_at TIMESTAMP WITH TIME ZONE,
  
  -- Status
  is_approved BOOLEAN DEFAULT true,
  is_flagged BOOLEAN DEFAULT false,
  flag_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  -- Constraints
  CONSTRAINT unique_user_product UNIQUE (user_id, product_id) -- Um usuário pode avaliar um produto apenas uma vez
);

-- Tabela de votos úteis
CREATE TABLE IF NOT EXISTS public.review_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_helpful BOOLEAN NOT NULL, -- true = útil, false = não útil
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  -- Constraint: um usuário pode votar apenas uma vez por avaliação
  CONSTRAINT unique_user_review_vote UNIQUE (user_id, review_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON public.reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_review_votes_review_id ON public.review_votes(review_id);
CREATE INDEX IF NOT EXISTS idx_review_votes_user_id ON public.review_votes(user_id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS (Row Level Security)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_votes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para reviews
-- Todos podem ver avaliações aprovadas
CREATE POLICY "Anyone can view approved reviews"
  ON public.reviews FOR SELECT
  USING (is_approved = true);

-- Usuários podem ver suas próprias avaliações
CREATE POLICY "Users can view their own reviews"
  ON public.reviews FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins podem ver todas as avaliações
CREATE POLICY "Admins can view all reviews"
  ON public.reviews FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Usuários autenticados podem criar avaliações
CREATE POLICY "Authenticated users can create reviews"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar suas próprias avaliações
CREATE POLICY "Users can update their own reviews"
  ON public.reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins podem atualizar qualquer avaliação
CREATE POLICY "Admins can update any review"
  ON public.reviews FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Usuários podem deletar suas próprias avaliações
CREATE POLICY "Users can delete their own reviews"
  ON public.reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Políticas RLS para review_votes
-- Todos podem ver votos
CREATE POLICY "Anyone can view review votes"
  ON public.review_votes FOR SELECT
  USING (true);

-- Usuários autenticados podem votar
CREATE POLICY "Authenticated users can vote"
  ON public.review_votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar seus votos
CREATE POLICY "Users can update their votes"
  ON public.review_votes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Usuários podem deletar seus votos
CREATE POLICY "Users can delete their votes"
  ON public.review_votes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- FUNÇÃO: Atualizar rating do produto
-- ============================================
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  avg_rating DECIMAL(3, 2);
  total_reviews INTEGER;
BEGIN
  -- Calcular média e total de avaliações aprovadas
  SELECT 
    COALESCE(AVG(rating), 0),
    COUNT(*)
  INTO avg_rating, total_reviews
  FROM public.reviews
  WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
    AND is_approved = true;
  
  -- Atualizar produto
  UPDATE public.products
  SET 
    rating = avg_rating,
    review_count = total_reviews
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Triggers para atualizar rating do produto
CREATE TRIGGER update_product_rating_on_insert
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rating();

CREATE TRIGGER update_product_rating_on_update
  AFTER UPDATE ON public.reviews
  FOR EACH ROW
  WHEN (OLD.rating IS DISTINCT FROM NEW.rating OR OLD.is_approved IS DISTINCT FROM NEW.is_approved)
  EXECUTE FUNCTION update_product_rating();

CREATE TRIGGER update_product_rating_on_delete
  AFTER DELETE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rating();

-- ============================================
-- FUNÇÃO: Atualizar contadores de votos
-- ============================================
CREATE OR REPLACE FUNCTION update_review_vote_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  helpful_total INTEGER;
  unhelpful_total INTEGER;
BEGIN
  -- Calcular totais
  SELECT 
    COUNT(*) FILTER (WHERE is_helpful = true),
    COUNT(*) FILTER (WHERE is_helpful = false)
  INTO helpful_total, unhelpful_total
  FROM public.review_votes
  WHERE review_id = COALESCE(NEW.review_id, OLD.review_id);
  
  -- Atualizar review
  UPDATE public.reviews
  SET 
    helpful_count = helpful_total,
    unhelpful_count = unhelpful_total
  WHERE id = COALESCE(NEW.review_id, OLD.review_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Triggers para atualizar contadores de votos
CREATE TRIGGER update_vote_counts_on_insert
  AFTER INSERT ON public.review_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_review_vote_counts();

CREATE TRIGGER update_vote_counts_on_update
  AFTER UPDATE ON public.review_votes
  FOR EACH ROW
  WHEN (OLD.is_helpful IS DISTINCT FROM NEW.is_helpful)
  EXECUTE FUNCTION update_review_vote_counts();

CREATE TRIGGER update_vote_counts_on_delete
  AFTER DELETE ON public.review_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_review_vote_counts();

-- ============================================
-- FUNÇÃO: Verificar se usuário comprou produto
-- ============================================
CREATE OR REPLACE FUNCTION user_purchased_product(
  p_user_id UUID,
  p_product_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.orders o
    JOIN public.order_items oi ON o.id = oi.order_id
    WHERE o.user_id = p_user_id
      AND oi.product_id = p_product_id::text
      AND o.status IN ('delivered', 'confirmed')
  );
END;
$$;

-- ============================================
-- FUNÇÃO: Obter avaliações de um produto
-- ============================================
CREATE OR REPLACE FUNCTION get_product_reviews(
  p_product_id UUID,
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  rating INTEGER,
  title TEXT,
  comment TEXT,
  images JSONB,
  is_verified_purchase BOOLEAN,
  helpful_count INTEGER,
  unhelpful_count INTEGER,
  user_name TEXT,
  vendor_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.rating,
    r.title,
    r.comment,
    r.images,
    r.is_verified_purchase,
    r.helpful_count,
    r.unhelpful_count,
    p.full_name as user_name,
    r.vendor_response,
    r.created_at
  FROM public.reviews r
  LEFT JOIN public.profiles p ON r.user_id = p.user_id
  WHERE r.product_id = p_product_id
    AND r.is_approved = true
  ORDER BY r.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Comentários explicativos
COMMENT ON TABLE public.reviews IS 'Avaliações de produtos pelos clientes';
COMMENT ON COLUMN public.reviews.is_verified_purchase IS 'Indica se o usuário comprou o produto';
COMMENT ON TABLE public.review_votes IS 'Votos de utilidade nas avaliações';
COMMENT ON FUNCTION update_product_rating IS 'Atualiza rating e contagem de reviews do produto automaticamente';
COMMENT ON FUNCTION user_purchased_product IS 'Verifica se usuário comprou o produto';
COMMENT ON FUNCTION get_product_reviews IS 'Retorna avaliações de um produto com informações do usuário';
