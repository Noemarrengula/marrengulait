-- ============================================================================
-- SCRIPT: Corrigir políticas RLS para todas as tabelas necessárias
-- Executar no Supabase SQL Editor
-- ============================================================================

-- Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read for authenticated users" ON public.orders;
CREATE POLICY "Allow read for authenticated users" ON public.orders
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.orders;
CREATE POLICY "Allow insert for authenticated users" ON public.orders
  FOR INSERT TO authenticated WITH CHECK (true);

-- Order Items
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.order_items;
CREATE POLICY "Allow insert for authenticated users" ON public.order_items
  FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Allow read for authenticated users" ON public.order_items;
CREATE POLICY "Allow read for authenticated users" ON public.order_items
  FOR SELECT TO authenticated USING (true);

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read for authenticated users" ON public.profiles;
CREATE POLICY "Allow read for authenticated users" ON public.profiles
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow update for authenticated users" ON public.profiles;
CREATE POLICY "Allow update for authenticated users" ON public.profiles
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Loyalty Points
DROP POLICY IF EXISTS "Allow read for authenticated users" ON public.loyalty_points;
CREATE POLICY "Allow read for authenticated users" ON public.loyalty_points
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.loyalty_points;
CREATE POLICY "Allow insert for authenticated users" ON public.loyalty_points
  FOR INSERT TO authenticated WITH CHECK (true);

-- User Roles
DROP POLICY IF EXISTS "Allow read for authenticated users" ON public.user_roles;
CREATE POLICY "Allow read for authenticated users" ON public.user_roles
  FOR SELECT TO authenticated USING (true);

-- Products
DROP POLICY IF EXISTS "Allow read for all users" ON public.products;
CREATE POLICY "Allow read for all users" ON public.products
  FOR SELECT TO authenticated USING (true);

SELECT '✅ Todas as políticas RLS atualizadas!' AS status;
