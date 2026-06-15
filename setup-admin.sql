-- Primeiro verificar se o utilizador existe
SELECT id, email, created_at FROM auth.users WHERE email = 'noemarrengula1@gmail.com';

-- Se existir, adicionar como admin
DO $$ 
DECLARE
  admin_email TEXT := 'noemarrengula1@gmail.com';
  admin_user_id UUID;
BEGIN
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = admin_email;
  
  IF admin_user_id IS NOT NULL THEN
    DELETE FROM public.user_roles WHERE user_id = admin_user_id;
    INSERT INTO public.user_roles (user_id, role, created_at)
    VALUES (admin_user_id, 'admin', NOW());
    RAISE NOTICE 'Admin role added for %!', admin_email;
  ELSE
    RAISE NOTICE 'User not found in auth.users!';
  END IF;
END $$;

-- Verificar resultado
SELECT 
  u.email,
  r.role
FROM public.user_roles r
JOIN auth.users u ON u.id = r.user_id
WHERE r.role = 'admin';
