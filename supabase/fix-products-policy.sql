-- ============================================
-- VERIFICAR E CRIAR POLÍTICAS DE LEITURA
-- ============================================

-- Ver políticas da tabela products
SELECT policyname, cmd, permissive FROM pg_policies WHERE tablename = 'products';

-- Criar política de leitura pública (se não existir)
DROP POLICY IF EXISTS "Public read products" ON products;
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);

-- Verificar
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'products';
