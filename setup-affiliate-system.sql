-- ============================================
-- SISTEMA DE AFILIADOS - MarrengulaIT
-- ============================================

-- 1. Tabela de Afiliados
CREATE TABLE IF NOT EXISTS public.affiliates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  affiliate_code TEXT UNIQUE NOT NULL,
  commission_rate DECIMAL(5, 2) DEFAULT 5.00, -- Porcentagem de comissão (ex: 5.00 = 5%)
  total_sales DECIMAL(10, 2) DEFAULT 0,
  total_commission DECIMAL(10, 2) DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  payment_info JSONB, -- Informações de pagamento (banco, conta, etc)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Tabela de Cliques de Afiliados
CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  converted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Tabela de Comissões
CREATE TABLE IF NOT EXISTS public.affiliate_commissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  commission_rate DECIMAL(5, 2) NOT NULL,
  commission_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Criar índices
CREATE INDEX IF NOT EXISTS idx_affiliates_user_id ON public.affiliates(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_code ON public.affiliates(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_affiliate_id ON public.affiliate_clicks(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_created_at ON public.affiliate_clicks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_affiliate_id ON public.affiliate_commissions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_status ON public.affiliate_commissions(status);

-- 5. Habilitar RLS
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_commissions ENABLE ROW LEVEL SECURITY;

-- 6. Políticas RLS para affiliates
DROP POLICY IF EXISTS "Afiliados veem seus próprios dados" ON public.affiliates;
CREATE POLICY "Afiliados veem seus próprios dados" ON public.affiliates
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins veem todos afiliados" ON public.affiliates;
CREATE POLICY "Admins veem todos afiliados" ON public.affiliates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- 7. Políticas RLS para affiliate_clicks
DROP POLICY IF EXISTS "Afiliados veem seus cliques" ON public.affiliate_clicks;
CREATE POLICY "Afiliados veem seus cliques" ON public.affiliate_clicks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.affiliates
      WHERE affiliates.id = affiliate_clicks.affiliate_id
      AND affiliates.user_id = auth.uid()
    )
  );

-- 8. Políticas RLS para affiliate_commissions
DROP POLICY IF EXISTS "Afiliados veem suas comissões" ON public.affiliate_commissions;
CREATE POLICY "Afiliados veem suas comissões" ON public.affiliate_commissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.affiliates
      WHERE affiliates.id = affiliate_commissions.affiliate_id
      AND affiliates.user_id = auth.uid()
    )
  );

-- 9. Função para gerar código de afiliado único
CREATE OR REPLACE FUNCTION public.generate_affiliate_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Gerar código aleatório de 8 caracteres
    new_code := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Verificar se já existe
    SELECT EXISTS(SELECT 1 FROM public.affiliates WHERE affiliate_code = new_code) INTO code_exists;
    
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  RETURN new_code;
END;
$$;

-- 10. Função para criar afiliado
CREATE OR REPLACE FUNCTION public.create_affiliate(target_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_affiliate_id UUID;
  new_code TEXT;
BEGIN
  -- Verificar se usuário já é afiliado
  IF EXISTS(SELECT 1 FROM public.affiliates WHERE user_id = target_user_id) THEN
    RAISE EXCEPTION 'Usuário já é afiliado';
  END IF;
  
  -- Gerar código único
  new_code := generate_affiliate_code();
  
  -- Criar afiliado
  INSERT INTO public.affiliates (user_id, affiliate_code)
  VALUES (target_user_id, new_code)
  RETURNING id INTO new_affiliate_id;
  
  RETURN new_affiliate_id;
END;
$$;

-- 11. Função para registrar clique
CREATE OR REPLACE FUNCTION public.register_affiliate_click(
  p_affiliate_code TEXT,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_referrer TEXT DEFAULT NULL,
  p_product_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_affiliate_id UUID;
  v_click_id UUID;
BEGIN
  -- Buscar afiliado pelo código
  SELECT id INTO v_affiliate_id
  FROM public.affiliates
  WHERE affiliate_code = p_affiliate_code
  AND status = 'active';
  
  IF v_affiliate_id IS NULL THEN
    RAISE EXCEPTION 'Código de afiliado inválido ou inativo';
  END IF;
  
  -- Registrar clique
  INSERT INTO public.affiliate_clicks (
    affiliate_id,
    ip_address,
    user_agent,
    referrer,
    product_id
  )
  VALUES (
    v_affiliate_id,
    p_ip_address,
    p_user_agent,
    p_referrer,
    p_product_id
  )
  RETURNING id INTO v_click_id;
  
  -- Atualizar contador de cliques
  UPDATE public.affiliates
  SET total_clicks = total_clicks + 1,
      updated_at = NOW()
  WHERE id = v_affiliate_id;
  
  RETURN v_click_id;
END;
$$;

-- 12. Função para processar comissão
CREATE OR REPLACE FUNCTION public.process_affiliate_commission(
  p_order_id UUID,
  p_affiliate_code TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_affiliate_id UUID;
  v_order_amount DECIMAL(10, 2);
  v_commission_rate DECIMAL(5, 2);
  v_commission_amount DECIMAL(10, 2);
  v_commission_id UUID;
BEGIN
  -- Buscar afiliado
  SELECT id, commission_rate INTO v_affiliate_id, v_commission_rate
  FROM public.affiliates
  WHERE affiliate_code = p_affiliate_code
  AND status = 'active';
  
  IF v_affiliate_id IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Buscar valor do pedido
  SELECT total_amount INTO v_order_amount
  FROM public.orders
  WHERE id = p_order_id;
  
  -- Calcular comissão
  v_commission_amount := v_order_amount * (v_commission_rate / 100);
  
  -- Criar registro de comissão
  INSERT INTO public.affiliate_commissions (
    affiliate_id,
    order_id,
    amount,
    commission_rate,
    commission_amount
  )
  VALUES (
    v_affiliate_id,
    p_order_id,
    v_order_amount,
    v_commission_rate,
    v_commission_amount
  )
  RETURNING id INTO v_commission_id;
  
  -- Atualizar totais do afiliado
  UPDATE public.affiliates
  SET total_sales = total_sales + v_order_amount,
      total_commission = total_commission + v_commission_amount,
      total_conversions = total_conversions + 1,
      updated_at = NOW()
  WHERE id = v_affiliate_id;
  
  RETURN v_commission_id;
END;
$$;

-- ============================================
-- EXEMPLOS DE USO:
-- ============================================

-- Criar afiliado para um usuário
-- SELECT public.create_affiliate('user-uuid-aqui');

-- Registrar clique de afiliado
-- SELECT public.register_affiliate_click('ABC12345', '192.168.1.1', 'Mozilla/5.0...', 'https://google.com', 'product-uuid');

-- Processar comissão de pedido
-- SELECT public.process_affiliate_commission('order-uuid', 'ABC12345');

-- Ver estatísticas de afiliado
-- SELECT * FROM public.affiliates WHERE user_id = auth.uid();
