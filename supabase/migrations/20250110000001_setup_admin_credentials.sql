-- Função para promover usuário a admin (usar via SQL ou Edge Function)
CREATE OR REPLACE FUNCTION public.promote_to_admin(target_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Buscar user_id pelo email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = target_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário com email % não encontrado', target_email;
  END IF;
  
  -- Inserir role de admin (ignora se já existe)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- INSTRUÇÕES PARA CRIAR ADMIN:
-- 1. Criar conta via interface de registro (/auth)
-- 2. Executar no SQL Editor do Supabase:
--    SELECT public.promote_to_admin('noemarrengula1@gmail.com');
