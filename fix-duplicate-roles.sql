-- ============================================
-- LIMPAR E RECRIAR ROLES CORRECTAMENTE
-- ============================================

-- 1. Verificar quantas roles há para smartirriga
SELECT user_id, role FROM public.user_roles 
WHERE user_id = '7ed44fba-1ef7-41e7-897f-2e53abaf3079';

-- 2. DELETAR TODAS as roles 'user' para este usuário
DELETE FROM public.user_roles 
WHERE user_id = '7ed44fba-1ef7-41e7-897f-2e53abaf3079' AND role = 'user';

-- 3. Garantir que tem APENAS 'admin'
DELETE FROM public.user_roles 
WHERE user_id = '7ed44fba-1ef7-41e7-897f-2e53abaf3079';

-- 4. Inserir 'admin' novamente
INSERT INTO public.user_roles (user_id, role)
VALUES ('7ed44fba-1ef7-41e7-897f-2e53abaf3079', 'admin');

-- 5. Fazer o mesmo para o outro admin
DELETE FROM public.user_roles 
WHERE user_id = '8d28b443-b574-46c9-9f6c-02dd416cdb63';

INSERT INTO public.user_roles (user_id, role)
VALUES ('8d28b443-b574-46c9-9f6c-02dd416cdb63', 'admin');

-- 6. Verificar resultado final
SELECT u.email, ur.role
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email IN ('smartirriga.info@gmail.com', 'noemarrengula1@gmail.com')
ORDER BY u.email;
