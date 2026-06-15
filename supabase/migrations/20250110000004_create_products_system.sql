-- ============================================
-- FASE 3: SISTEMA DE PRODUTOS
-- ============================================
-- Descrição: Tabelas para gerenciar produtos do marketplace
-- Suporta múltiplas imagens, variantes, estoque e especificações
-- ============================================

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relacionamentos
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  
  -- Informações básicas
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  
  -- Preço e estoque
  price DECIMAL(10, 2) NOT NULL,
  compare_at_price DECIMAL(10, 2), -- Preço original (para mostrar desconto)
  cost_price DECIMAL(10, 2), -- Custo (apenas para vendedor/admin)
  
  -- Estoque
  sku TEXT UNIQUE,
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  track_inventory BOOLEAN DEFAULT true,
  
  -- Variantes (tamanhos, cores, etc) - JSON
  variants JSONB DEFAULT '[]'::jsonb,
  
  -- Especificações técnicas - JSON
  specifications JSONB DEFAULT '{}'::jsonb,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  
  -- Estatísticas
  rating DECIMAL(3, 2) DEFAULT 0.00,
  review_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9-]+$'),
  CONSTRAINT valid_price CHECK (price >= 0),
  CONSTRAINT valid_stock CHECK (stock_quantity >= 0),
  CONSTRAINT valid_rating CHECK (rating >= 0 AND rating <= 5)
);

-- Tabela de imagens de produtos
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  
  -- Imagem
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  -- Constraint: apenas uma imagem primária por produto
  CONSTRAINT unique_primary_per_product UNIQUE (product_id, is_primary) 
    WHERE is_primary = true
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON public.products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON public.products(rating DESC);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_name_search ON public.products USING gin(to_tsvector('portuguese', name));
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);

-- Triggers para atualizar updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS (Row Level Security)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para products
-- Todos podem ver produtos ativos
CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  USING (is_active = true AND published_at IS NOT NULL);

-- Vendedores podem ver seus próprios produtos
CREATE POLICY "Vendors can view their own products"
  ON public.products FOR SELECT
  TO authenticated
  USING (
    vendor_id IN (
      SELECT id FROM public.vendors WHERE owner_id = auth.uid()
    )
  );

-- Admins podem ver todos os produtos
CREATE POLICY "Admins can view all products"
  ON public.products FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Vendedores podem criar produtos
CREATE POLICY "Vendors can create products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (
    vendor_id IN (
      SELECT id FROM public.vendors 
      WHERE owner_id = auth.uid() 
      AND status = 'approved'
    )
  );

-- Vendedores podem atualizar seus produtos
CREATE POLICY "Vendors can update their own products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (
    vendor_id IN (
      SELECT id FROM public.vendors WHERE owner_id = auth.uid()
    )
  );

-- Admins podem atualizar qualquer produto
CREATE POLICY "Admins can update any product"
  ON public.products FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Vendedores podem deletar seus produtos
CREATE POLICY "Vendors can delete their own products"
  ON public.products FOR DELETE
  TO authenticated
  USING (
    vendor_id IN (
      SELECT id FROM public.vendors WHERE owner_id = auth.uid()
    )
  );

-- Políticas RLS para product_images
-- Todos podem ver imagens de produtos ativos
CREATE POLICY "Anyone can view product images"
  ON public.product_images FOR SELECT
  USING (
    product_id IN (
      SELECT id FROM public.products 
      WHERE is_active = true AND published_at IS NOT NULL
    )
  );

-- Vendedores podem gerenciar imagens de seus produtos
CREATE POLICY "Vendors can manage their product images"
  ON public.product_images FOR ALL
  TO authenticated
  USING (
    product_id IN (
      SELECT p.id FROM public.products p
      JOIN public.vendors v ON p.vendor_id = v.id
      WHERE v.owner_id = auth.uid()
    )
  );

-- Admins podem gerenciar todas as imagens
CREATE POLICY "Admins can manage all product images"
  ON public.product_images FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- FUNÇÃO: Buscar produtos com filtros
-- ============================================
CREATE OR REPLACE FUNCTION search_products(
  p_search_term TEXT DEFAULT NULL,
  p_category_id UUID DEFAULT NULL,
  p_vendor_id UUID DEFAULT NULL,
  p_min_price DECIMAL DEFAULT NULL,
  p_max_price DECIMAL DEFAULT NULL,
  p_is_featured BOOLEAN DEFAULT NULL,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  price DECIMAL,
  compare_at_price DECIMAL,
  rating DECIMAL,
  review_count INTEGER,
  vendor_name TEXT,
  category_name TEXT,
  primary_image TEXT
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.slug,
    p.price,
    p.compare_at_price,
    p.rating,
    p.review_count,
    v.store_name as vendor_name,
    c.name as category_name,
    (
      SELECT pi.image_url 
      FROM public.product_images pi 
      WHERE pi.product_id = p.id 
      ORDER BY pi.is_primary DESC, pi.display_order 
      LIMIT 1
    ) as primary_image
  FROM public.products p
  LEFT JOIN public.vendors v ON p.vendor_id = v.id
  LEFT JOIN public.categories c ON p.category_id = c.id
  WHERE p.is_active = true
    AND p.published_at IS NOT NULL
    AND (p_search_term IS NULL OR p.name ILIKE '%' || p_search_term || '%')
    AND (p_category_id IS NULL OR p.category_id = p_category_id)
    AND (p_vendor_id IS NULL OR p.vendor_id = p_vendor_id)
    AND (p_min_price IS NULL OR p.price >= p_min_price)
    AND (p_max_price IS NULL OR p.price <= p_max_price)
    AND (p_is_featured IS NULL OR p.is_featured = p_is_featured)
  ORDER BY p.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- ============================================
-- FUNÇÃO: Atualizar estatísticas do produto
-- ============================================
CREATE OR REPLACE FUNCTION update_product_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Atualizar contador de vendas quando um pedido é criado
  IF TG_TABLE_NAME = 'order_items' AND TG_OP = 'INSERT' THEN
    UPDATE public.products
    SET sales_count = sales_count + NEW.quantity
    WHERE id = NEW.product_id::uuid;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger para atualizar stats quando item é vendido
CREATE TRIGGER update_product_sales_stats
  AFTER INSERT ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION update_product_stats();

-- Comentários explicativos
COMMENT ON TABLE public.products IS 'Produtos do marketplace';
COMMENT ON COLUMN public.products.variants IS 'Variantes do produto em JSON (ex: tamanhos, cores)';
COMMENT ON COLUMN public.products.specifications IS 'Especificações técnicas em JSON';
COMMENT ON COLUMN public.products.compare_at_price IS 'Preço original para mostrar desconto';
COMMENT ON TABLE public.product_images IS 'Imagens dos produtos (múltiplas por produto)';
COMMENT ON FUNCTION search_products IS 'Busca produtos com filtros avançados';
