-- FIX: Corrigir RLS para permitir criação automática de perfis no signup
-- ============================================================================

-- 1. REMOVER políticas antigas que estão causando erro
DROP POLICY IF EXISTS "Utilizadores podem inserir seu próprio perfil" ON profiles;
DROP POLICY IF EXISTS "Profiles são públicas" ON profiles;
DROP POLICY IF EXISTS "Utilizadores podem atualizar seu próprio perfil" ON profiles;

-- 2. CRIAR novas políticas que permitem signup automático

-- SELECT: Profiles públicas (leitura)
CREATE POLICY "profiles_select_public" ON profiles 
  FOR SELECT USING (true);

-- INSERT: Sem restrições (permite a função handle_new_user executar)
CREATE POLICY "profiles_insert_public" ON profiles 
  FOR INSERT WITH CHECK (true);

-- UPDATE: Utilizador atualiza seu próprio perfil
CREATE POLICY "profiles_update_own" ON profiles 
  FOR UPDATE USING (auth.uid() = user_id);

-- 3. Verificar que as políticas foram aplicadas
SELECT tablename, policyname FROM pg_policies WHERE tablename = 'profiles';

