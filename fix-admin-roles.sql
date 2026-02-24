-- ✅ CORREÇÃO: Adicionar roles ausentes na tabela user_roles
-- Este script corrige o problema onde usuários não têm entry em user_roles

-- ===== PASSO 1: Adicionar 'user' role para TODOS os usuários que não têm role =====
INSERT INTO public.user_roles (user_id, role)
SELECT 
  u.id,
  'user'::public.app_role
FROM auth.users u
WHERE u.id NOT IN (SELECT DISTINCT user_id FROM public.user_roles)
ON CONFLICT (user_id, role) DO NOTHING;

-- ===== PASSO 2: Verificar resultado =====
SELECT 
  COUNT(*) as total_usuarios,
  COUNT(DISTINCT ur.user_id) as usuarios_com_role
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id;

-- ===== PASSO 3: Listar todos os usuários atuais e seus roles =====
-- EXECUTE ISSO PARA SABER QUAL EMAIL DEVE SER ADMIN
SELECT 
  u.id,
  u.email,
  STRING_AGG(ur.role::text, ', ') as roles,
  u.created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
GROUP BY u.id, u.email, u.created_at
ORDER BY u.created_at DESC;

-- ===== PASSO 4: APÓS identificar qual é o admin, execute ESTE comando =====
-- Substitua 'seu-email@exemplo.com' e 'uuid-do-usuario' pelos dados corretos
-- De preferência, procure por usuários criados primeiro (menor created_at)

-- Exemplo para promover um usuário a admin:
-- UPDATE public.user_roles 
-- SET role = 'admin'::public.app_role
-- WHERE user_id = 'COLOQUE-O-UUID-DO-USUARIO-AQUI'
-- AND role = 'user';

-- OU inserir role de admin se não existir:
-- INSERT INTO public.user_roles (user_id, role)
-- VALUES ('COLOQUE-O-UUID-DO-USUARIO-AQUI', 'admin'::public.app_role)
-- ON CONFLICT (user_id, role) DO NOTHING;

-- ===== PASSO 5: Verificar como está ficando =====
SELECT 
  u.email,
  STRING_AGG(ur.role::text, ', ') as roles
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
GROUP BY u.id, u.email
ORDER BY u.email;
