-- ============================================
-- CORREÇÃO URGENTE DE RLS
-- Executar no Supabase SQL Editor
-- ============================================

-- 1. VER E REMOVER POLÍTICAS PROBLEMÁTICAS
DROP POLICY IF EXISTS "Allow admin all" ON products;
DROP POLICY IF EXISTS "Allow authenticated full access products" ON products;
DROP POLICY IF EXISTS "Allow authenticated read products" ON products;
DROP POLICY IF EXISTS "Allow public read" ON products;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Public read products" ON products;

-- 2. CRIAR POLÍTICA SIMPLES DE LEITURA
CREATE POLICY "Public read all products" ON products FOR SELECT USING (true);

-- 3. CORRIGIR PROFILES
DROP POLICY IF EXISTS "Allow public read profiles" ON profiles;
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated manage own profile" ON profiles;
CREATE POLICY "Allow all access to profiles" ON profiles FOR ALL USING (true);

-- 4. CORRIGIR WISHLIST
DROP POLICY IF EXISTS "Allow authenticated manage own wishlist" ON wishlist;
DROP POLICY IF EXISTS "Enable read access for all users" ON wishlist;
CREATE POLICY "Allow public read wishlist" ON wishlist FOR SELECT USING (true);
CREATE POLICY "Allow all access wishlist" ON wishlist FOR ALL USING (true);

-- 5. GARANTIR QUE TABELAS TÊM RLS ATIVO
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 6. VERIFICAR
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
