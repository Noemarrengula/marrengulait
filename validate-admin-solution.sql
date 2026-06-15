-- ✅ SCRIPT DE VALIDAÇÃO: Confirmar que tudo funciona corretamente
-- Execute este script no Supabase SQL Editor para validar a solução

-- ===== VALIDAÇÃO 1: Verificar trigger =====
SELECT 
  trigger_schema,
  trigger_name,
  event_manipulation,
  event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND trigger_name = 'on_auth_user_created';

-- Esperado: 1 linha com on_auth_user_created

-- ===== VALIDAÇÃO 2: Verificar funções existem =====
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routines.routine_name IN (
  'has_role',
  'handle_new_user',
  'ensure_user_has_role',
  'promote_user_to_admin',
  'get_admin_users'
)
ORDER BY routine_name;

-- Esperado: Pelo menos 3-5 funções listadas

-- ===== VALIDAÇÃO 3: Verificar RLS está habilitada =====
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_class 
JOIN pg_tables ON pg_class.relname = pg_tables.tablename
WHERE schemaname = 'public'
AND tablename IN ('user_roles', 'profiles');

-- Esperado: rowsecurity = true para ambas

-- ===== VALIDAÇÃO 4: Verificar policies =====
SELECT 
  schemaname,
  tablename,
  policyname,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Esperado: Pelo menos 5 policies para user_roles

-- ===== VALIDAÇÃO 5: Verificar dados dos usuários =====
-- Aqui você pode ver o estado atual dos seus usuários
SELECT 
  u.id as user_id,
  u.email,
  STRING_AGG(ur.role::text, ', ' ORDER BY ur.role) as roles,
  u.created_at as user_registered_at,
  p.created_at as profile_created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
LEFT JOIN public.profiles p ON u.id = p.user_id
GROUP BY u.id, u.email, u.created_at, p.created_at
ORDER BY u.created_at DESC;

-- Esperado: Todos os usuários devem ter NO MÍNIMO um role listado

-- ===== VALIDAÇÃO 6: Verificar se há usuários SEM roles (problema!) =====
SELECT 
  u.id,
  u.email,
  u.created_at,
  'SEM ROLE!' as problema
FROM auth.users u
WHERE u.id NOT IN (SELECT DISTINCT user_id FROM public.user_roles)
ORDER BY u.created_at DESC;

-- Esperado: 0 linhas (nenhum usuário sem role)
-- Se aparecer algo aqui, significa que ainda há um problema

-- ===== VALIDAÇÃO 7: Contar admins =====
SELECT 
  COUNT(DISTINCT ur.user_id) as total_admins,
  COUNT(DISTINCT u.id) as total_usuarios,
  ROUND(100.0 * COUNT(DISTINCT ur.user_id) / COUNT(DISTINCT u.id), 2) as percentual_admin
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id AND ur.role = 'admin';

-- Esperado: total_admins >= 1 (pelo menos um admin)

-- ===== VALIDAÇÃO 8: Testar função ensure_user_has_role =====
-- Substitua 'seu-uuid' por um UUID real
-- SELECT public.ensure_user_has_role('seu-uuid'::uuid);

-- Esperado: true se novo role foi criado, false se já tinha

-- ===== VALIDAÇÃO 9: Testar tabela profiles =====
SELECT 
  COUNT(DISTINCT user_id) as usuarios_com_profile,
  COUNT(DISTINCT u.id) as total_usuarios
FROM public.profiles p
CROSS JOIN (SELECT DISTINCT id FROM auth.users) u;

-- Esperado: profiles.count = auth.users.count (todos com profile)

-- ===== VALIDAÇÃO 10: Verificar se há erros em log (se existir) =====
-- Nota: Isto requer uma tabela de logs que você possa ter criado
-- Se não tiver, pode ignorar
-- SELECT * FROM public.error_logs ORDER BY created_at DESC LIMIT 10;

-- ===== RESUMO FINAL =====
-- Se todos os queries acima retornarem o esperado, significa que:
-- ✅ Trigger está funcionando
-- ✅ Funções estão criadas
-- ✅ RLS está habilitada
-- ✅ Policies estão corretas
-- ✅ Todos os usuários têm roles
-- ✅ Sistema está pronto para usar!

-- ===== SE ALGO ESTIVER ERRADO =====
-- Execute isto para corrigir automaticamente:
INSERT INTO public.user_roles (user_id, role)
SELECT 
  u.id,
  'user'::public.app_role
FROM auth.users u
WHERE u.id NOT IN (SELECT DISTINCT user_id FROM public.user_roles)
ON CONFLICT (user_id, role) DO NOTHING;

-- Depois, promova o admin manualmente:
-- UPDATE public.user_roles 
-- SET role = 'admin'::public.app_role
-- WHERE user_id = 'seu-uuid'
-- AND role = 'user';
