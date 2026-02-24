-- ============================================
-- FASE 5: SISTEMA DE FAVORITOS
-- ============================================
-- Descrição: Sistema de lista de desejos/favoritos
-- Usuários podem salvar produtos favoritos
-- ============================================

-- Tabela de favoritos
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relacionamentos
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  -- Constraint: um usuário pode favoritar um produto apenas uma vez
  CONSTRAINT unique_user_product_favorite UNIQUE (user_id, product_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product_id ON public.favorites(product_id);
CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON public.favorites(created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
-- Usuários podem ver seus próprios favoritos
CREATE POLICY "Users can view their own favorites"
  ON public.favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Usuários podem adicionar favoritos
CREATE POLICY "Users can add favorites"
  ON public.favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem remover seus favoritos
CREATE POLICY "Users can remove their favorites"
  ON public.favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- FUNÇÃO: Adicionar/Remover favorito (toggle)
-- ============================================
CREATE OR REPLACE FUNCTION toggle_favorite(
  p_user_id UUID,
  p_product_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_exists BOOLEAN;
BEGIN
  -- Verificar se já existe
  SELECT EXISTS(
    SELECT 1 FROM public.favorites
    WHERE user_id = p_user_id AND product_id = p_product_id
  ) INTO v_exists;
  
  IF v_exists THEN
    -- Remover favorito
    DELETE FROM public.favorites
    WHERE user_id = p_user_id AND product_id = p_product_id;
    RETURN false; -- Removido
  ELSE
    -- Adicionar favorito
    INSERT INTO public.favorites (user_id, product_id)
    VALUES (p_user_id, p_product_id);
    RETURN true; -- Adicionado
  END IF;
END;
$$;

-- ============================================
-- FUNÇÃO: Verificar se produto está nos favoritos
-- ============================================
CREATE OR REPLACE FUNCTION is_favorite(
  p_user_id UUID,
  p_product_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM public.favorites
    WHERE user_id = p_user_id AND product_id = p_product_id
  );
END;
$$;

-- ============================================
-- FUNÇÃO: Obter favoritos do usuário
-- ============================================
CREATE OR REPLACE FUNCTION get_user_favorites(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  product_id UUID,
  product_name TEXT,
  product_slug TEXT,
  product_price DECIMAL,
  product_compare_at_price DECIMAL,
  product_rating DECIMAL,
  vendor_name TEXT,
  primary_image TEXT,
  favorited_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as product_id,
    p.name as product_name,
    p.slug as product_slug,
    p.price as product_price,
    p.compare_at_price as product_compare_at_price,
    p.rating as product_rating,
    v.store_name as vendor_name,
    (
      SELECT pi.image_url 
      FROM public.product_images pi 
      WHERE pi.product_id = p.id 
      ORDER BY pi.is_primary DESC, pi.display_order 
      LIMIT 1
    ) as primary_image,
    f.created_at as favorited_at
  FROM public.favorites f
  JOIN public.products p ON f.product_id = p.id
  LEFT JOIN public.vendors v ON p.vendor_id = v.id
  WHERE f.user_id = p_user_id
    AND p.is_active = true
    AND p.published_at IS NOT NULL
  ORDER BY f.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- ============================================
-- FUNÇÃO: Contar favoritos de um produto
-- ============================================
CREATE OR REPLACE FUNCTION count_product_favorites(
  p_product_id UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO v_count
  FROM public.favorites
  WHERE product_id = p_product_id;
  
  RETURN v_count;
END;
$$;

-- Comentários explicativos
COMMENT ON TABLE public.favorites IS 'Lista de desejos/favoritos dos usuários';
COMMENT ON FUNCTION toggle_favorite IS 'Adiciona ou remove produto dos favoritos (toggle)';
COMMENT ON FUNCTION is_favorite IS 'Verifica se produto está nos favoritos do usuário';
COMMENT ON FUNCTION get_user_favorites IS 'Retorna lista de favoritos do usuário com detalhes dos produtos';
COMMENT ON FUNCTION count_product_favorites IS 'Conta quantos usuários favoritaram um produto';
