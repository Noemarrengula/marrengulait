-- ============================================
-- SISTEMA DE AVALIAÇÕES - MarrengulaIT
-- ============================================

-- 1. Tabela de Avaliações
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  verified_purchase BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(product_id, user_id, order_id)
);

-- 2. Tabela de Votos Úteis
CREATE TABLE IF NOT EXISTS public.review_helpful_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID REFERENCES public.product_reviews(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(review_id, user_id)
);

-- 3. Criar índices
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.product_reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.product_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_review_votes_review_id ON public.review_helpful_votes(review_id);

-- 4. Habilitar RLS
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_helpful_votes ENABLE ROW LEVEL SECURITY;

-- 5. Políticas RLS para product_reviews
DROP POLICY IF EXISTS "Todos veem avaliações aprovadas" ON public.product_reviews;
CREATE POLICY "Todos veem avaliações aprovadas" ON public.product_reviews
  FOR SELECT USING (status = 'approved' OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários criam suas avaliações" ON public.product_reviews;
CREATE POLICY "Usuários criam suas avaliações" ON public.product_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários editam suas avaliações" ON public.product_reviews;
CREATE POLICY "Usuários editam suas avaliações" ON public.product_reviews
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins gerenciam todas avaliações" ON public.product_reviews;
CREATE POLICY "Admins gerenciam todas avaliações" ON public.product_reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- 6. Políticas RLS para review_helpful_votes
DROP POLICY IF EXISTS "Todos veem votos" ON public.review_helpful_votes;
CREATE POLICY "Todos veem votos" ON public.review_helpful_votes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Usuários votam" ON public.review_helpful_votes;
CREATE POLICY "Usuários votam" ON public.review_helpful_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. Função para atualizar média de avaliações do produto
CREATE OR REPLACE FUNCTION public.update_product_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.products
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM public.product_reviews
      WHERE product_id = NEW.product_id
      AND status = 'approved'
    ),
    reviews_count = (
      SELECT COUNT(*)
      FROM public.product_reviews
      WHERE product_id = NEW.product_id
      AND status = 'approved'
    )
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$;

-- 8. Trigger para atualizar rating automaticamente
DROP TRIGGER IF EXISTS trigger_update_product_rating ON public.product_reviews;
CREATE TRIGGER trigger_update_product_rating
AFTER INSERT OR UPDATE OF status, rating ON public.product_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_product_rating();

-- 9. Função para marcar voto útil
CREATE OR REPLACE FUNCTION public.mark_review_helpful(p_review_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.review_helpful_votes (review_id, user_id)
  VALUES (p_review_id, auth.uid())
  ON CONFLICT (review_id, user_id) DO NOTHING;
  
  UPDATE public.product_reviews
  SET helpful_count = (
    SELECT COUNT(*)
    FROM public.review_helpful_votes
    WHERE review_id = p_review_id
  )
  WHERE id = p_review_id;
END;
$$;
