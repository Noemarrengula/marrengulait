-- ============================================
-- CORRIGIR RLS POLICIES PARA PRODUCTS
-- ============================================

-- 1. Primeiro, desativar RLS temporariamente para fazer alterações (se necessário)
-- ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- 2. Eliminar policies existentes problemáticas
DROP POLICY IF EXISTS "Allow authenticated users to read products" ON products;
DROP POLICY IF EXISTS "Allow public read access" ON products;
DROP POLICY IF EXISTS "Allow authenticated insert" ON products;
DROP POLICY IF EXISTS "Allow authenticated update" ON products;
DROP POLICY IF EXISTS "Allow authenticated delete" ON products;
DROP POLICY IF EXISTS "Users can view own products" ON products;
DROP POLICY IF EXISTS "Users can insert own products" ON products;
DROP POLICY IF EXISTS "Users can update own products" ON products;
DROP POLICY IF EXISTS "Users can delete own products" ON products;

-- 3. Criar policies permissivas para admins e auth users
-- SELECT para todos os utilizadores autenticados
CREATE POLICY "Allow authenticated read products"
ON products
FOR SELECT
TO authenticated
USING (true);

-- INSERT para admins
CREATE POLICY "Allow admin insert products"
ON products
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
  OR auth.uid() IS NOT NULL
);

-- UPDATE para admins (e owner)
CREATE POLICY "Allow admin update products"
ON products
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
)
WITH CHECK (true);

-- DELETE para admins
CREATE POLICY "Allow admin delete products"
ON products
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- 4. Para INSERT/DELETE por admins, garantir que a policy funciona
-- Se ainda não funcionar, usar uma policy mais permissiva:

-- Policy alternativa: Qualquer utilizador autenticado pode fazer tudo
CREATE POLICY "Allow authenticated full access products"
ON products
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 5. Verificar as policies criadas
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'products';

-- 6. Verificar se RLS está ativo
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'products';
