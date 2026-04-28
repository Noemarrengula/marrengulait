-- ============================================================================
-- SCRIPT: Corrigir políticas RLS para order_items
-- Executar no Supabase SQL Editor
-- ============================================================================

-- Permitir inserções para utilizadores autenticados
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.order_items;
CREATE POLICY "Allow insert for authenticated users" ON public.order_items
  FOR INSERT TO authenticated WITH CHECK (true);

-- Permitir leituras para todos os utilizadores autenticados
DROP POLICY IF EXISTS "Allow read for authenticated users" ON public.order_items;
CREATE POLICY "Allow read for authenticated users" ON public.order_items
  FOR SELECT TO authenticated USING (true);

-- Permitir atualizações
DROP POLICY IF EXISTS "Allow update for authenticated users" ON public.order_items;
CREATE POLICY "Allow update for authenticated users" ON public.order_items
  FOR UPDATE TO authenticated USING (true);

-- Permitir eliminações
DROP POLICY IF EXISTS "Allow delete for authenticated users" ON public.order_items;
CREATE POLICY "Allow delete for authenticated users" ON public.order_items
  FOR DELETE TO authenticated USING (true);

SELECT '✅ Políticas RLS para order_items atualizadas!' AS status;
