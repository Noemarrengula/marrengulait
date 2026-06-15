-- ================================================
-- CORRIGIR ACESSO AO ADMIN
-- Execute no Supabase SQL Editor
-- ================================================

-- Desativar RLS na tabela user_roles para debug
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Verificar se o usuário admin existe
SELECT ur.*, au.email 
FROM public.user_roles ur 
JOIN auth.users au ON ur.user_id = au.id 
WHERE au.email = 'noemarrengula1@gmail.com';
