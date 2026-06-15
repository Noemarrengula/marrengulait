-- 🚨 DIAGNÓSTICO CRÍTICO: Falha de Sincronização de Sessão
-- Objetivo: Identificar por que existem UUIDs divergentes

-- ===== PASSO 1: Verificar se há MÚLTIPLOS usuários com o mesmo email =====
SELECT 
  email,
  COUNT(*) as quantidade,
  STRING_AGG(id::text, ' | ') as uuids
FROM auth.users
GROUP BY email
HAVING COUNT(*) > 1;

-- Se aparecer algo aqui = PROBLEMA! Email duplicado
-- Resultado esperado: (Nenhuma linha)

-- ===== PASSO 2: Ver TODOS os usuários e seus dados =====
SELECT 
  id,
  email,
  created_at,
  last_sign_in_at
FROM auth.users
ORDER BY created_at ASC;

-- Procure por:
-- - Múltiplos registros do mesmo email
-- - Data de criação recentes (possível duplicação)

-- ===== PASSO 3: Verificar correspondência entre auth.users e profiles =====
SELECT 
  u.id as user_uuid,
  u.email,
  p.user_id as profile_uuid,
  CASE WHEN u.id = p.user_id THEN '✅ OK' ELSE '❌ ERRO' END as status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
ORDER BY u.created_at DESC;

-- Se aparecer ❌ ERRO: há desincronização

-- ===== PASSO 4: Verificar correspondência entre auth.users e user_roles =====
SELECT 
  u.id as user_uuid,
  u.email,
  ur.user_id as role_uuid,
  ur.role,
  CASE WHEN u.id = ur.user_id THEN '✅ OK' ELSE '❌ ERRO' END as status
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'smartirriga.info@gmail.com'
ORDER BY u.created_at DESC;

-- Esperado: Todas as linhas com ✅ OK

-- ===== PASSO 5: Listar o UUID CORRETO do admin =====
SELECT 
  id,
  email,
  created_at,
  'Este é o UUID CORRETO para usar' as nota
FROM auth.users
WHERE email = 'smartirriga.info@gmail.com'
ORDER BY created_at ASC
LIMIT 1;

-- ===== PASSO 6: Ver qual UUID tem role admin =====
SELECT 
  ur.user_id,
  u.email,
  ur.role,
  'UUID com role admin' as nota
FROM public.user_roles ur
JOIN auth.users u ON u.id = ur.user_id
WHERE u.email = 'smartirriga.info@gmail.com' AND ur.role = 'admin';

-- ===== PASSO 7: Ver qual UUID tem role user =====
SELECT 
  ur.user_id,
  u.email,
  ur.role,
  'UUID com role user' as nota
FROM public.user_roles ur
JOIN auth.users u ON u.id = ur.user_id
WHERE u.email = 'smartirriga.info@gmail.com' AND ur.role = 'user';

-- ===== ANÁLISE =====
-- Se houver DOIS UUIDs diferentes para o mesmo email = PROBLEMA CRÍTICO
-- Precisaremos:
-- 1. Manter o UUID MAIS ANTIGO (first created_at)
-- 2. Deletar o UUID MAIS NOVO (duplicado)
-- 3. Garantir que profiles e user_roles apontam para o UUID CORRETO
