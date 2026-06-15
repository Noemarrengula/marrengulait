-- ============================================================================
-- SCRIPT: Garantir que noemarrengula1@gmail.com é admin
-- Executar no Supabase SQL Editor
-- ============================================================================

DO $$ 
DECLARE
  admin_email TEXT := 'noemarrengula1@gmail.com';
  admin_user_id UUID;
BEGIN
  -- Encontrar o utilizador pelo email
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = admin_email;
  
  IF admin_user_id IS NOT NULL THEN
    -- Remover roles antigos
    DELETE FROM public.user_roles WHERE user_id = admin_user_id;
    
    -- Adicionar role de admin
    INSERT INTO public.user_roles (user_id, role, created_at)
    VALUES (admin_user_id, 'admin', NOW());
    
    RAISE NOTICE 'User % is now admin!', admin_email;
  ELSE
    RAISE NOTICE 'User with email % not found. Check if user exists in Authentication.', admin_email;
  END IF;
END $$;

-- Verificar se ficou admin
SELECT 
  u.email,
  ur.role,
  ur.created_at
FROM public.user_roles ur
JOIN auth.users u ON u.id = ur.user_id
WHERE ur.role = 'admin';
