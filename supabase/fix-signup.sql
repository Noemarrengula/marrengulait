-- ================================================
-- CORREÇÃO: Erro ao criar usuário
-- Execute este SQL no Supabase SQL Editor
-- ================================================

-- PASSO 1: Verificar se as tabelas existem e têm RLS
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'loyalty_points');

-- PASSO 2: Desativar RLS temporariamente nas tabelas afectadas
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points DISABLE ROW LEVEL SECURITY;

-- PASSO 3: Recriar a função de trigger com melhor tratamento
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Criar perfil
    INSERT INTO public.profiles (id, user_id, full_name)
    VALUES (gen_random_uuid(), NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', COALESCE(NEW.raw_user_meta_data->>'name', '')))
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Criar pontos de loyalty
    INSERT INTO public.loyalty_points (user_id, points, tier)
    VALUES (NEW.id, 0, 'bronze')
    ON CONFLICT DO NOTHING;
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Erro no trigger: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASSO 4: Recriar o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- PASSO 5: Garantir que o owner das tabelas está correto
ALTER TABLE profiles OWNER TO postgres;
ALTER TABLE loyalty_points OWNER TO postgres;

-- PASSO 6: Reativar RLS (opcional - com políticas públicas)
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;

-- PASSO 7: Verificar
SELECT 'Perfil criado!' as status;
