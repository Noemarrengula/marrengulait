-- ============================================
-- FEATURES AVANÇADAS E-COMMERCE - MarrengulaIT
-- ============================================

-- 1. PERGUNTAS & RESPOSTAS
CREATE TABLE IF NOT EXISTS public.product_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  answer TEXT,
  answered_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  answered_at TIMESTAMP WITH TIME ZONE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. HISTÓRICO DE PREÇOS
CREATE TABLE IF NOT EXISTS public.price_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. PRODUTOS VISUALIZADOS RECENTEMENTE
CREATE TABLE IF NOT EXISTS public.recently_viewed (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, product_id)
);

-- 4. PROGRAMA DE PONTOS/CASHBACK
CREATE TABLE IF NOT EXISTS public.loyalty_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  points INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  lifetime_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.points_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  points INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('earned', 'redeemed', 'expired', 'bonus')),
  description TEXT,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. NOTIFICAÇÕES DE QUEDA DE PREÇO
CREATE TABLE IF NOT EXISTS public.price_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  target_price DECIMAL(10, 2) NOT NULL,
  notified BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, product_id)
);

-- 6. COMPATIBILIDADE DE PRODUTOS (PC Parts)
CREATE TABLE IF NOT EXISTS public.product_compatibility (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  compatible_with UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  compatibility_type TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. TRUST BADGES & VERIFICAÇÕES
CREATE TABLE IF NOT EXISTS public.product_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  badge_type TEXT NOT NULL CHECK (badge_type IN ('best_seller', 'verified', 'best_price', 'trending', 'new_arrival')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. MÉTODOS DE PAGAMENTO
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('mpesa', 'card', 'bank_transfer')),
  details JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ÍNDICES
CREATE INDEX idx_product_questions_product ON public.product_questions(product_id);
CREATE INDEX idx_price_history_product ON public.price_history(product_id, recorded_at DESC);
CREATE INDEX idx_recently_viewed_user ON public.recently_viewed(user_id, viewed_at DESC);
CREATE INDEX idx_loyalty_points_user ON public.loyalty_points(user_id);
CREATE INDEX idx_price_alerts_product ON public.price_alerts(product_id, active);
CREATE INDEX idx_product_compatibility ON public.product_compatibility(product_id);

-- RLS POLICIES
ALTER TABLE public.product_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recently_viewed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_compatibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Políticas básicas de leitura pública
CREATE POLICY "Perguntas públicas" ON public.product_questions FOR SELECT USING (true);
CREATE POLICY "Histórico de preços público" ON public.price_history FOR SELECT USING (true);
CREATE POLICY "Badges públicos" ON public.product_badges FOR SELECT USING (true);
CREATE POLICY "Compatibilidade pública" ON public.product_compatibility FOR SELECT USING (true);

-- Políticas de dados do usuário
CREATE POLICY "Usuários veem seus próprios dados" ON public.recently_viewed FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Usuários veem seus pontos" ON public.loyalty_points FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários veem suas transações" ON public.points_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários gerenciam alertas" ON public.price_alerts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Usuários gerenciam pagamentos" ON public.payment_methods FOR ALL USING (auth.uid() = user_id);

-- FUNÇÕES ÚTEIS

-- Registrar visualização de produto
CREATE OR REPLACE FUNCTION public.track_product_view(p_product_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF auth.uid() IS NOT NULL THEN
    INSERT INTO public.recently_viewed (user_id, product_id, viewed_at)
    VALUES (auth.uid(), p_product_id, NOW())
    ON CONFLICT (user_id, product_id) 
    DO UPDATE SET viewed_at = NOW();
  END IF;
END;
$$;

-- Adicionar pontos por compra
CREATE OR REPLACE FUNCTION public.award_loyalty_points(p_user_id UUID, p_order_amount DECIMAL)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_points INTEGER;
  v_current_tier TEXT;
  v_multiplier DECIMAL;
BEGIN
  -- Calcular pontos (1 ponto por 100 MT)
  v_points := FLOOR(p_order_amount / 100);
  
  -- Buscar tier atual
  SELECT tier INTO v_current_tier FROM public.loyalty_points WHERE user_id = p_user_id;
  
  -- Multiplicador por tier
  v_multiplier := CASE v_current_tier
    WHEN 'platinum' THEN 2.0
    WHEN 'gold' THEN 1.5
    WHEN 'silver' THEN 1.2
    ELSE 1.0
  END;
  
  v_points := FLOOR(v_points * v_multiplier);
  
  -- Atualizar pontos
  INSERT INTO public.loyalty_points (user_id, points, lifetime_points)
  VALUES (p_user_id, v_points, v_points)
  ON CONFLICT (user_id) DO UPDATE
  SET points = loyalty_points.points + v_points,
      lifetime_points = loyalty_points.lifetime_points + v_points,
      updated_at = NOW();
  
  -- Registrar transação
  INSERT INTO public.points_transactions (user_id, points, type, description)
  VALUES (p_user_id, v_points, 'earned', 'Pontos ganhos por compra');
  
  RETURN v_points;
END;
$$;

-- Verificar alertas de preço
CREATE OR REPLACE FUNCTION public.check_price_alerts()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.price_alerts pa
  SET notified = true
  FROM public.products p
  WHERE pa.product_id = p.id
    AND pa.active = true
    AND pa.notified = false
    AND p.price <= pa.target_price;
END;
$$;
