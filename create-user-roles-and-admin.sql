-- ============================================
-- CRIAR TABELA USER_ROLES E FUNÇÃO ADMIN
-- ============================================

-- 1. CRIAR TABELA USER_ROLES
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'vendor', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, role)
);

-- 2. CRIAR ÍNDICE
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);

-- 3. HABILITAR RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- 4. CRIAR POLÍTICAS
DROP POLICY IF EXISTS "Usuários veem suas próprias roles" ON user_roles;
CREATE POLICY "Usuários veem suas próprias roles" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins podem ver todas as roles" ON user_roles;
CREATE POLICY "Admins podem ver todas as roles" ON user_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- 5. CRIAR FUNÇÃO PARA TORNAR USUÁRIO ADMIN
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

-- 6. VERIFICAÇÃO
SELECT 'Tabela user_roles criada com sucesso!' as message;
