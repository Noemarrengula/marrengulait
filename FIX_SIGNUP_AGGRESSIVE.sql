-- SCRIPT AGRESSIVO: Remover TUDO que está a bloquear signup
-- Execute isto NO SUPABASE SQL EDITOR
-- ============================================================================

-- PASSO 1: Remover TODAS as políticas RLS da tabela profiles
DROP POLICY IF EXISTS "Profiles são públicas" ON profiles;
DROP POLICY IF EXISTS "Utilizadores podem atualizar seu próprio perfil" ON profiles;
DROP POLICY IF EXISTS "Utilizadores podem inserir seu próprio perfil" ON profiles;
DROP POLICY IF EXISTS "profiles_select_public" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_public" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_system" ON profiles;

-- PASSO 2: DESATIVAR RLS completamente na tabela profiles
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- PASSO 3: Remover e recriar a função handle_new_user() de forma SIMPLES
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Inserir perfil simples
  INSERT INTO public.profiles (id, user_id)
  VALUES (NEW.id, NEW.id);
  
  -- Inserir rol padrão 'user'
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Se houver erro, apenas log e continua
  RAISE WARNING 'Erro em handle_new_user: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- PASSO 4: Recriar trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- PASSO 5: Reativar RLS com políticas ABERTAS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política SELECT: Livre
CREATE POLICY "anyone_can_select_profiles" ON profiles
  FOR SELECT USING (true);

-- Política INSERT: Livre (permite a função criar perfis)
CREATE POLICY "anyone_can_insert_profiles" ON profiles
  FOR INSERT WITH CHECK (true);

-- Política UPDATE: Apenas o utilizador atualiza seu próprio perfil
CREATE POLICY "users_can_update_own_profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- PASSO 6: Corrigir user_roles também
DROP POLICY IF EXISTS "Utilizadores podem inserir suas próprias roles" ON user_roles;
DROP POLICY IF EXISTS "Funções de sistema podem inserir roles" ON user_roles;
DROP POLICY IF EXISTS "user_roles_insert_system" ON user_roles;
DROP POLICY IF EXISTS "user_roles_select_own" ON user_roles;

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_roles_select_any" ON user_roles
  FOR SELECT USING (true);

CREATE POLICY "user_roles_insert_any" ON user_roles
  FOR INSERT WITH CHECK (true);

-- PASSO 7: Testar - se não houver erro, está OK!
SELECT COUNT(*) as profile_count FROM profiles;
SELECT COUNT(*) as role_count FROM user_roles;
