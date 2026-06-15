-- ⚠️ CORREÇÃO CRÍTICA: Remover duplicação de usuários e sincronizar sessão
-- ⚠️ EXECUTE COM CUIDADO: Isto vai deletar dados!

-- ===== PRÉ-VERIFICAÇÃO: Procurar duplicatas =====
-- Execute isto PRIMEIRO para ver o que será deletado

SELECT 
  email,
  COUNT(*) as quantidade,
  ARRAY_AGG(id ORDER BY created_at) as uuids_cronologicamente,
  MIN(created_at) as primeira_criacao,
  MAX(created_at) as ultima_criacao
FROM auth.users
WHERE email = 'smartirriga.info@gmail.com'
GROUP BY email;

-- Se quantidade > 1, há duplicação!
-- O PRIMEIRO (MIN created_at) é o correto
-- O ÚLTIMO (MAX created_at) é o duplicado e será deletado

-- ===== PASSO 1: Identificar qual UUID é o correto =====
WITH user_data AS (
  SELECT 
    id,
    email,
    created_at,
    ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at ASC) as rn
  FROM auth.users
  WHERE email = 'smartirriga.info@gmail.com'
)
SELECT 
  id as uuid_correto,
  email,
  created_at as data_criacao,
  'Este é o UUID que deve ser mantido' as nota
FROM user_data
WHERE rn = 1;

-- ===== PASSO 2: Identificar qual UUID é duplicado =====
WITH user_data AS (
  SELECT 
    id,
    email,
    created_at,
    ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at ASC) as rn
  FROM auth.users
  WHERE email = 'smartirriga.info@gmail.com'
)
SELECT 
  id as uuid_duplicado,
  email,
  created_at as data_criacao,
  'Este é o UUID que será deletado' as nota
FROM user_data
WHERE rn > 1;

-- ===== PASSO 3: EXECUTAR APENAS SE CONFIRMAR DUPLICAÇÃO =====
-- ⚠️ Descomentar as linhas abaixo APENAS após confirmar duplicação

/*
-- Obter o UUID correto e duplicado
WITH user_data AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at ASC) as rn
  FROM auth.users
  WHERE email = 'smartirriga.info@gmail.com'
)
-- Deletar profiles do UUID duplicado
DELETE FROM public.profiles
WHERE user_id = (
  SELECT id FROM user_data WHERE rn > 1 LIMIT 1
);

-- Deletar roles do UUID duplicado
DELETE FROM public.user_roles
WHERE user_id = (
  WITH user_data AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at ASC) as rn
    FROM auth.users
    WHERE email = 'smartirriga.info@gmail.com'
  )
  SELECT id FROM user_data WHERE rn > 1 LIMIT 1
);

-- Deletar o usuário duplicado do auth (⚠️ CUIDADO - isto deleta da auth)
-- Nota: Isto requer SUPER privilégio, pode não funcionar via dashboard
DELETE FROM auth.users
WHERE email = 'smartirriga.info@gmail.com' AND id = (
  WITH user_data AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at ASC) as rn
    FROM auth.users
    WHERE email = 'smartirriga.info@gmail.com'
  )
  SELECT id FROM user_data WHERE rn > 1 LIMIT 1
);
*/

-- ===== PASSO 4: Corrigir referências para o UUID CORRETO =====
-- Isso vai garantir que profiles e user_roles apontam para o UUID correto

WITH correct_user AS (
  SELECT 
    id,
    email,
    ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at ASC) as rn
  FROM auth.users
  WHERE email = 'smartirriga.info@gmail.com'
)
-- Verificar profiles
SELECT 
  p.user_id,
  p.full_name,
  cu.id as should_be_uuid,
  CASE WHEN p.user_id = cu.id THEN '✅' ELSE '❌' END as status
FROM public.profiles p
CROSS JOIN correct_user cu
WHERE p.user_id LIKE '%' AND cu.rn = 1;

-- ===== PASSO 5: Garantir que o UUID CORRETO tem ROLE ADMIN =====
-- O UUID correto DEVE ter 'admin' como role

WITH correct_user AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at ASC) as rn
  FROM auth.users
  WHERE email = 'smartirriga.info@gmail.com' AND rn = 1
)
-- Garantir role admin
INSERT INTO public.user_roles (user_id, role)
SELECT correct_user.id, 'admin'
FROM correct_user
ON CONFLICT (user_id, role) DO NOTHING;

-- ===== PASSO 6: Verificação final =====
SELECT 
  u.id as user_uuid,
  u.email,
  STRING_AGG(ur.role::text, ', ' ORDER BY ur.role) as roles,
  u.created_at,
  'Configuração final' as nota
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'smartirriga.info@gmail.com'
GROUP BY u.id, u.email, u.created_at;

-- Esperado: 
-- - user_uuid: um único UUID
-- - roles: admin
-- - Sem duplicação
