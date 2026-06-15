-- ============================================
-- FASE 1: SISTEMA DE CATEGORIAS
-- ============================================
-- Descrição: Tabela para organizar produtos em categorias e subcategorias
-- Suporta hierarquia (categoria pai/filho)
-- ============================================

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Informações básicas
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  
  -- Visual
  icon TEXT, -- Nome do ícone Lucide (ex: "Laptop", "Smartphone")
  image_url TEXT, -- URL da imagem da categoria
  
  -- Hierarquia (para subcategorias)
  parent_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  
  -- Organização
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  -- Constraints
  CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9-]+$'), -- Apenas letras minúsculas, números e hífens
  CONSTRAINT no_self_reference CHECK (id != parent_id) -- Categoria não pode ser pai de si mesma
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON public.categories(display_order);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS (Row Level Security)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
-- Todos podem ver categorias ativas
CREATE POLICY "Anyone can view active categories"
  ON public.categories FOR SELECT
  USING (is_active = true);

-- Admins podem ver todas as categorias
CREATE POLICY "Admins can view all categories"
  ON public.categories FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins podem criar categorias
CREATE POLICY "Admins can create categories"
  ON public.categories FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins podem atualizar categorias
CREATE POLICY "Admins can update categories"
  ON public.categories FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins podem deletar categorias
CREATE POLICY "Admins can delete categories"
  ON public.categories FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- FUNÇÃO: Obter categorias com subcategorias
-- ============================================
-- Retorna categorias principais com suas subcategorias aninhadas
CREATE OR REPLACE FUNCTION get_categories_tree()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', c.id,
      'name', c.name,
      'slug', c.slug,
      'description', c.description,
      'icon', c.icon,
      'image_url', c.image_url,
      'display_order', c.display_order,
      'subcategories', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', sc.id,
            'name', sc.name,
            'slug', sc.slug,
            'description', sc.description,
            'icon', sc.icon,
            'image_url', sc.image_url,
            'display_order', sc.display_order
          )
          ORDER BY sc.display_order, sc.name
        )
        FROM public.categories sc
        WHERE sc.parent_id = c.id
          AND sc.is_active = true
      )
    )
    ORDER BY c.display_order, c.name
  ) INTO result
  FROM public.categories c
  WHERE c.parent_id IS NULL
    AND c.is_active = true;
  
  RETURN COALESCE(result, '[]'::jsonb);
END;
$$;

-- ============================================
-- DADOS INICIAIS (Exemplos)
-- ============================================
-- Inserir categorias principais
INSERT INTO public.categories (name, slug, description, icon, display_order) VALUES
  ('Eletrônicos', 'eletronicos', 'Produtos eletrônicos e tecnologia', 'Laptop', 1),
  ('Moda', 'moda', 'Roupas, calçados e acessórios', 'Shirt', 2),
  ('Casa e Jardim', 'casa-jardim', 'Móveis, decoração e utensílios', 'Home', 3),
  ('Esportes', 'esportes', 'Equipamentos e roupas esportivas', 'Dumbbell', 4),
  ('Livros', 'livros', 'Livros físicos e digitais', 'Book', 5)
ON CONFLICT (slug) DO NOTHING;

-- Inserir subcategorias de Eletrônicos
INSERT INTO public.categories (name, slug, description, icon, parent_id, display_order)
SELECT 
  'Smartphones', 'smartphones', 'Celulares e acessórios', 'Smartphone', id, 1
FROM public.categories WHERE slug = 'eletronicos'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, slug, description, icon, parent_id, display_order)
SELECT 
  'Computadores', 'computadores', 'Notebooks, desktops e tablets', 'Monitor', id, 2
FROM public.categories WHERE slug = 'eletronicos'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, slug, description, icon, parent_id, display_order)
SELECT 
  'Áudio', 'audio', 'Fones, caixas de som e equipamentos', 'Headphones', id, 3
FROM public.categories WHERE slug = 'eletronicos'
ON CONFLICT (slug) DO NOTHING;

-- Comentários explicativos
COMMENT ON TABLE public.categories IS 'Categorias e subcategorias de produtos do marketplace';
COMMENT ON COLUMN public.categories.slug IS 'Identificador único amigável para URLs (ex: eletronicos)';
COMMENT ON COLUMN public.categories.parent_id IS 'ID da categoria pai (NULL para categorias principais)';
COMMENT ON COLUMN public.categories.display_order IS 'Ordem de exibição (menor número aparece primeiro)';
COMMENT ON FUNCTION get_categories_tree() IS 'Retorna árvore de categorias com subcategorias aninhadas';
