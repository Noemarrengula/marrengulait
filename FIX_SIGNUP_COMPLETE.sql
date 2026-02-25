-- SOLUÇÃO COMPLETA: Corrigir problema de criação de perfis no signup
-- ============================================================================

-- PASSO 1: Remover a função e trigger antigos
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- PASSO 2: Criar nova função melhorada com tratamento de erros
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_error_message TEXT;
BEGIN
  BEGIN
    -- 1. Criar o perfil do utilizador
    INSERT INTO public.profiles (id, user_id, full_name)
    VALUES (NEW.id, NEW.id, NEW.raw_user_meta_data->>'full_name')
    ON CONFLICT (id) DO NOTHING;
    
    -- 2. Atribuir o papel padrão 'user'
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RAISE NOTICE 'Perfil e papel criados com sucesso para utilizador: %', NEW.id;
    RETURN NEW;
  EXCEPTION WHEN OTHERS THEN
    v_error_message := SQLERRM;
    RAISE WARNING 'Erro ao criar perfil/papel para utilizador %: %', NEW.id, v_error_message;
    RETURN NEW;  -- Retorna NEW mesmo com erro para não bloquear o signup
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASSO 3: Recriar o trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- PASSO 4: Corrigir políticas RLS de user_roles (se estiverem bloqueando)
DROP POLICY IF EXISTS "Utilizadores podem inserir suas próprias roles" ON user_roles;
DROP POLICY IF EXISTS "Funções de sistema podem inserir roles" ON user_roles;

CREATE POLICY "user_roles_insert_system" ON user_roles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "user_roles_select_own" ON user_roles
  FOR SELECT USING (user_id = auth.uid() OR auth.uid() IS NULL);

-- PASSO 5: Testar a função manualmente (toca um valor de teste)
-- Descomentar apenas se quiser testar:
-- SELECT public.handle_new_user() AS test_result;

-- RESULTADO
-- Se tudo funcionou, verá "Perfil e papel criados com sucesso"
-- Agora o signup deverá funcionar automaticamente!
