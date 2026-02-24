-- 📋 DIAGNÓSTICO: Problema com Admin no Supabase
-- Este script ajuda a identificar por que usuários admin não estão sendo reconhecidos

-- ===== PASSO 1: Verificar a tabela user_roles =====
-- Ver todos os usuários e seus roles atuais
SELECT 
  u.id,
  u.email,
  ur.role,
  u.created_at as user_created_at,
  ur.created_at as role_created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
ORDER BY u.created_at DESC;

-- ===== PASSO 2: Verificar se há usuários SEM entry em user_roles =====
SELECT 
  u.id,
  u.email,
  'SEM ROLE' as status
FROM auth.users u
WHERE u.id NOT IN (SELECT DISTINCT user_id FROM public.user_roles)
ORDER BY u.created_at DESC;

-- ===== PASSO 3: Verificar profiles =====
-- Ver se há perfis criados
SELECT id, user_id, full_name, created_at
FROM public.profiles
ORDER BY created_at DESC;

-- ===== PASSO 4: Comparar usuários em auth.users vs public.profiles =====
-- Usuários sem profile
SELECT 
  u.id,
  u.email,
  'SEM PROFILE' as status
FROM auth.users u
WHERE u.id NOT IN (SELECT DISTINCT user_id FROM public.profiles)
ORDER BY u.created_at DESC;

-- ===== PASSO 5: Ver data de criação das triggers =====
-- Confirmar que as triggers estão criadas e ativas
SELECT 
  trigger_schema,
  trigger_name,
  event_manipulation,
  event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND (trigger_name LIKE '%auth%' OR trigger_name LIKE '%role%')
ORDER BY trigger_name;
