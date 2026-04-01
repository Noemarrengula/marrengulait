-- ================================================
-- FASE C: CRIAR CONTA ADMIN
-- Execute este SQL no Supabase SQL Editor
-- ================================================

-- PASSO 1: Encontrar o ID do usuário pelo email
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'noemarrengula1@gmail.com';

-- PASSO 2: Após obter o ID, substitua 'AQUI_O_ID' pelo valor retornado
-- INSERT INTO public.user_roles (user_id, role) 
-- VALUES ('AQUI_O_ID', 'admin');

-- PASSO 3: Verificar se foi adicionado
-- SELECT ur.*, au.email 
-- FROM public.user_roles ur 
-- JOIN auth.users au ON ur.user_id = au.id;
