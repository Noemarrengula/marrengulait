-- ============================================
-- DIAGNÓSTICO COMPLETO
-- ============================================

-- 1. VER SE HÁ PRODUTOS
SELECT count(*) as total_products FROM products;

-- 2. VER POLÍTICAS DE PRODUCTS
SELECT policyname, cmd, permissive, roles FROM pg_policies 
WHERE tablename = 'products';

-- 3. CRIAR POLÍTICA DE LEITURA PÚBLICA
DROP POLICY IF EXISTS "Public read products" ON products;
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);

-- 4. GARANTIR QUE ANÓNIMOS PODEM LER
DROP POLICY IF EXISTS "Allow public read" ON products;
CREATE POLICY "Allow public read" ON products FOR SELECT USING (true);

-- 5. VERIFICAR POLÍTICAS FINAIS
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'products';

-- 6. TESTAR CONSULTA COMO ANÓNIMO (se suportado)
-- SELECT * FROM products LIMIT 1;
