-- ============================================
-- CORRIGIR RLS POLICIES PARA USER_ROLES
-- ============================================

-- PRIMEIRO: Remover políticas antigas que causam conflito
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Usuários podem ver suas próprias roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins podem ver todas as roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins podem gerenciar roles" ON public.user_roles;

-- Política simples: Usuários podem ler SUAS PRÓPRIAS roles
CREATE POLICY "Users can read own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Apenas admins podem INSERT/UPDATE/DELETE
CREATE POLICY "Only admins can manage roles"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update roles"
  ON public.user_roles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete roles"
  ON public.user_roles
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Verificar o resultado
SELECT 
  u.id,
  u.email,
  ur.role
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
ORDER BY u.created_at DESC;
