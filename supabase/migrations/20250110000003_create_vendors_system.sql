-- ============================================
-- FASE 2: SISTEMA DE VENDEDORES/LOJAS
-- ============================================
-- Descrição: Tabela para gerenciar lojas/vendedores do marketplace
-- Cada vendedor pode ter uma loja e vender produtos
-- ============================================

-- Tabela de vendedores/lojas
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Proprietário da loja (usuário)
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Informações da loja
  store_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  
  -- Visual
  logo_url TEXT,
  banner_url TEXT,
  
  -- Contato
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  
  -- Endereço
  address TEXT,
  city TEXT,
  province TEXT,
  postal_code TEXT,
  
  -- Status e aprovação
  status TEXT NOT NULL DEFAULT 'pending',
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  
  -- Estatísticas
  rating DECIMAL(3, 2) DEFAULT 0.00,
  total_sales INTEGER DEFAULT 0,
  total_products INTEGER DEFAULT 0,
  
  -- Configurações
  is_active BOOLEAN DEFAULT true,
  commission_rate DECIMAL(5, 2) DEFAULT 10.00, -- Percentual de comissão
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9-]+$'),
  CONSTRAINT valid_rating CHECK (rating >= 0 AND rating <= 5),
  CONSTRAINT valid_commission CHECK (commission_rate >= 0 AND commission_rate <= 100),
  CONSTRAINT unique_owner UNIQUE (owner_id) -- Um usuário pode ter apenas uma loja
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_vendors_owner_id ON public.vendors(owner_id);
CREATE INDEX IF NOT EXISTS idx_vendors_slug ON public.vendors(slug);
CREATE INDEX IF NOT EXISTS idx_vendors_status ON public.vendors(status);
CREATE INDEX IF NOT EXISTS idx_vendors_is_active ON public.vendors(is_active);
CREATE INDEX IF NOT EXISTS idx_vendors_rating ON public.vendors(rating DESC);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_vendors_updated_at
  BEFORE UPDATE ON public.vendors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS (Row Level Security)
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
-- Todos podem ver lojas aprovadas e ativas
CREATE POLICY "Anyone can view approved vendors"
  ON public.vendors FOR SELECT
  USING (status = 'approved' AND is_active = true);

-- Vendedores podem ver sua própria loja
CREATE POLICY "Vendors can view their own store"
  ON public.vendors FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

-- Admins podem ver todas as lojas
CREATE POLICY "Admins can view all vendors"
  ON public.vendors FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Usuários com role 'vendor' podem criar loja
CREATE POLICY "Vendors can create their store"
  ON public.vendors FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'vendor') 
    AND auth.uid() = owner_id
  );

-- Vendedores podem atualizar sua própria loja
CREATE POLICY "Vendors can update their own store"
  ON public.vendors FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Admins podem atualizar qualquer loja
CREATE POLICY "Admins can update any vendor"
  ON public.vendors FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins podem deletar lojas
CREATE POLICY "Admins can delete vendors"
  ON public.vendors FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- FUNÇÃO: Aprovar loja
-- ============================================
CREATE OR REPLACE FUNCTION approve_vendor(
  p_vendor_id UUID,
  p_admin_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se o usuário é admin
  IF NOT public.has_role(p_admin_id, 'admin') THEN
    RAISE EXCEPTION 'Apenas administradores podem aprovar lojas';
  END IF;
  
  -- Atualizar status da loja
  UPDATE public.vendors
  SET 
    status = 'approved',
    approved_at = now(),
    approved_by = p_admin_id,
    rejection_reason = NULL
  WHERE id = p_vendor_id;
  
  -- Adicionar role 'vendor' ao proprietário se ainda não tiver
  INSERT INTO public.user_roles (user_id, role)
  SELECT owner_id, 'vendor'
  FROM public.vendors
  WHERE id = p_vendor_id
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN true;
END;
$$;

-- ============================================
-- FUNÇÃO: Rejeitar loja
-- ============================================
CREATE OR REPLACE FUNCTION reject_vendor(
  p_vendor_id UUID,
  p_admin_id UUID,
  p_reason TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se o usuário é admin
  IF NOT public.has_role(p_admin_id, 'admin') THEN
    RAISE EXCEPTION 'Apenas administradores podem rejeitar lojas';
  END IF;
  
  -- Atualizar status da loja
  UPDATE public.vendors
  SET 
    status = 'rejected',
    rejection_reason = p_reason,
    approved_at = NULL,
    approved_by = NULL
  WHERE id = p_vendor_id;
  
  RETURN true;
END;
$$;

-- ============================================
-- FUNÇÃO: Suspender loja
-- ============================================
CREATE OR REPLACE FUNCTION suspend_vendor(
  p_vendor_id UUID,
  p_admin_id UUID,
  p_reason TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se o usuário é admin
  IF NOT public.has_role(p_admin_id, 'admin') THEN
    RAISE EXCEPTION 'Apenas administradores podem suspender lojas';
  END IF;
  
  -- Atualizar status da loja
  UPDATE public.vendors
  SET 
    status = 'suspended',
    rejection_reason = p_reason,
    is_active = false
  WHERE id = p_vendor_id;
  
  RETURN true;
END;
$$;

-- Comentários explicativos
COMMENT ON TABLE public.vendors IS 'Lojas/vendedores do marketplace';
COMMENT ON COLUMN public.vendors.slug IS 'Identificador único amigável para URLs da loja';
COMMENT ON COLUMN public.vendors.status IS 'Status de aprovação: pending, approved, rejected, suspended';
COMMENT ON COLUMN public.vendors.commission_rate IS 'Percentual de comissão sobre vendas (0-100)';
COMMENT ON FUNCTION approve_vendor IS 'Aprova uma loja e adiciona role vendor ao proprietário';
COMMENT ON FUNCTION reject_vendor IS 'Rejeita uma solicitação de loja';
COMMENT ON FUNCTION suspend_vendor IS 'Suspende uma loja ativa';
