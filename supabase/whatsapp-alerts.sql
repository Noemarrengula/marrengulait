-- ================================================
-- TABELA E FUNÇÕES WHATSAPP ALERTS
-- Execute no Supabase SQL Editor
-- ================================================

-- Criar tabela para alertas WhatsApp
CREATE TABLE IF NOT EXISTS public.whatsapp_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    phone TEXT NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    alert_type TEXT NOT NULL CHECK (alert_type IN ('movement', 'stock', 'price', 'new_product', 'cctv_quote')),
    message TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar políticas RLS
ALTER TABLE public.whatsapp_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own alerts"
ON public.whatsapp_alerts FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can create alerts"
ON public.whatsapp_alerts FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view active alerts"
ON public.whatsapp_alerts FOR SELECT
USING (is_active = true);

-- Verificar
SELECT * FROM public.whatsapp_alerts LIMIT 5;
