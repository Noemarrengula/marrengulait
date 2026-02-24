-- ============================================
-- PROMOVER USUÁRIO A ADMIN
-- ============================================
-- Script para promover smartirriga.info@gmail.com a admin

-- 1. Executar a função de promoção
SELECT public.promote_to_admin('smartirriga.info@gmail.com');

-- 2. Verificar se funcionou
SELECT 
  u.id,
  u.email,
  u.created_at,
  ur.role
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'smartirriga.info@gmail.com';

-- Se o usuário não existir, ele será criado primeiro via /auth
-- Depois execute este script novamente

-- Outras operações úteis:

-- Ver todos os admins
-- SELECT u.email, ur.role
-- FROM auth.users u
-- JOIN public.user_roles ur ON u.id = ur.user_id
-- WHERE ur.role = 'admin';

-- Remover role de admin
-- DELETE FROM public.user_roles
-- WHERE user_id = (SELECT id FROM auth.users WHERE email = 'smartirriga.info@gmail.com')
--   AND role = 'admin';
