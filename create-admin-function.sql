-- ============================================
-- FUNÇÃO PARA CRIAR ADMIN POR EMAIL
-- ============================================

-- 1. CRIAR FUNÇÃO RPC
CREATE OR REPLACE FUNCTION make_user_admin(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_user_id UUID;
  existing_role RECORD;
BEGIN
  -- Buscar user_id pelo email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email;
  
  -- Verificar se usuário existe
  IF target_user_id IS NULL THEN
    RETURN 'Erro: Usuário com email ' || user_email || ' não encontrado';
  END IF;
  
  -- Verificar se já é admin
  SELECT * INTO existing_role
  FROM user_roles
  WHERE user_id = target_user_id AND role = 'admin';
  
  IF existing_role IS NOT NULL THEN
    RETURN 'Usuário ' || user_email || ' já é admin';
  END IF;
  
  -- Adicionar role admin
  INSERT INTO user_roles (user_id, role)
  VALUES (target_user_id, 'admin');
  
  RETURN 'Sucesso! Usuário ' || user_email || ' agora é admin';
END;
$$;

-- 2. EXEMPLO DE USO (DESCOMENTE E SUBSTITUA O EMAIL):
-- SELECT make_user_admin('seu-email@exemplo.com');
