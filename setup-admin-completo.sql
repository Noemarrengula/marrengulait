-- ============================================
-- SCRIPT COMPLETO: Configurar Sistema Admin
-- ============================================

-- 1. Criar tabela user_roles (se não existir)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'vendor', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, role)
);

-- 2. Criar índice
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- 3. Habilitar RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas RLS
DROP POLICY IF EXISTS "Usuários veem suas próprias roles" ON public.user_roles;
CREATE POLICY "Usuários veem suas próprias roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins veem todas as roles" ON public.user_roles;
CREATE POLICY "Admins veem todas as roles" ON public.user_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- 5. Criar função promote_to_admin
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
  
  RAISE NOTICE 'Usuário % promovido a admin com sucesso!', target_email;
END;
$$;

-- ============================================
-- AGORA VOCÊ PODE PROMOVER UM USUÁRIO A ADMIN:
-- ============================================
-- SELECT public.promote_to_admin('noemarrengula1@gmail.com');
