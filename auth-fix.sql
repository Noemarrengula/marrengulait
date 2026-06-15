-- ================================================
-- CORREÇÃO DO AUTH - TRIGGER E POLICIES
-- Execute no Supabase SQL Editor
-- ================================================

-- PASSO 1: Verificar se trigger existe
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created'
AND event_object_schema = 'public';

-- PASSO 2: Verificar tabelas
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'user_roles', 'loyalty_points');

-- PASSO 3: Criar/atualizar trigger de novo usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Criar perfil do usuário
    INSERT INTO public.profiles (user_id, full_name, email)
    VALUES (
        NEW.id, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NEW.email
    ) ON CONFLICT (user_id) DO NOTHING;
    
    -- Criar pontos de loyalty
    INSERT INTO public.loyalty_points (user_id, points, tier)
    VALUES (NEW.id, 0, 'bronze') ON CONFLICT DO NOTHING;
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Erro no trigger handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remover trigger antigo se existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Criar novo trigger
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- PASSO 4: Verificar se admin existe e adicionar role
DO $$
DECLARE
    admin_email TEXT := 'noemarrengula1@gmail.com';
    admin_user RECORD;
BEGIN
    SELECT id INTO admin_user FROM auth.users WHERE email = admin_email;
    
    IF admin_user.id IS NOT NULL THEN
        -- Remover roles antigas
        DELETE FROM public.user_roles WHERE user_id = admin_user.id;
        
        -- Adicionar role admin
        INSERT INTO public.user_roles (user_id, role, created_at)
        VALUES (admin_user.id, 'admin', NOW());
        
        RAISE NOTICE 'Admin role added for %', admin_email;
    ELSE
        RAISE NOTICE 'User % not found', admin_email;
    END IF;
END $$;

-- PASSO 5: Verificar RLS e policies
-- Desabilitar RLS temporariamente para garantir que funciona
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points DISABLE ROW LEVEL SECURITY;

-- Criar policies mínimas (após desabilitar RLS)
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles
FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_roles_select_own" ON user_roles;
CREATE POLICY "user_roles_select_own" ON user_roles
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "loyalty_select_own" ON loyalty_points;
CREATE POLICY "loyalty_select_own" ON loyalty_points
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "loyalty_update_own" ON loyalty_points;
CREATE POLICY "loyalty_update_own" ON loyalty_points
FOR UPDATE USING (auth.uid() = user_id);

-- Reabilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;

-- PASSO 6: Verificar resultado
SELECT 
    'profiles' as table_name,
    relrowsecurity as rls_enabled,
    (SELECT COUNT(*) FROM profiles) as row_count
FROM pg_class WHERE relname = 'profiles'
UNION ALL
SELECT 
    'user_roles' as table_name,
    relrowsecurity as rls_enabled,
    (SELECT COUNT(*) FROM user_roles) as row_count
FROM pg_class WHERE relname = 'user_roles';

-- PASSO 7: Listar policies
SELECT 
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'user_roles', 'loyalty_points');

SELECT 'Script completo executado!' as status;
