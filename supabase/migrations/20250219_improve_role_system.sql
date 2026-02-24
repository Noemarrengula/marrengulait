-- Migration: Melhorar sistema de roles e garantir que todos os usuários têm role
-- Data: 2025-02-19
-- Descrição: Corrige o problem de usuários não tendo roles na tabela user_roles

-- ===== ALTERAÇÃO 1: Garantir que trigger é mais robusta =====
-- Recriar função handle_new_user com melhor tratamento de erro

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Criar perfil
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Atribuir role de user por padrão (com proteção contra duplicação)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Log para debug
  RAISE NOTICE 'Novo usuário criado: % com ID %', NEW.email, NEW.id;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Se algo der errado, ainda retorna NEW para não bloquear o sign-up
  RAISE WARNING 'Erro ao criar perfil/role para %, erro: %', NEW.email, SQLERRM;
  RETURN NEW;
END;
$$;

-- ===== ALTERAÇÃO 2: Criar função para garantir que usuário tem role =====
-- Função que verifica e garante que um usuário tem pelo menos um role

CREATE OR REPLACE FUNCTION public.ensure_user_has_role(_user_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role_count integer;
BEGIN
  -- Contar roles do usuário
  SELECT COUNT(*) INTO v_role_count
  FROM public.user_roles
  WHERE user_id = _user_id;
  
  -- Se não tem role, insere 'user'
  IF v_role_count = 0 THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (_user_id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RAISE NOTICE 'Role padrão inserida para usuário %', _user_id;
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- ===== ALTERAÇÃO 3: Criar função para promover usuário a admin =====
-- Função que um admin pode chamar para promover outro usuário

CREATE OR REPLACE FUNCTION public.promote_user_to_admin(_target_user_id UUID)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_id UUID;
  v_is_caller_admin boolean;
  v_result json;
BEGIN
  -- Obter ID do usuário que está chamando a função
  v_caller_id := auth.uid();
  
  -- Verificar se o caller é admin
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = v_caller_id AND role = 'admin'
  ) INTO v_is_caller_admin;
  
  IF NOT v_is_caller_admin THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Apenas admins podem promover usuários'
    );
  END IF;
  
  -- Remover todos os roles anteriores do usuário alvo
  DELETE FROM public.user_roles
  WHERE user_id = _target_user_id;
  
  -- Inserir role de admin
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_target_user_id, 'admin');
  
  RETURN json_build_object(
    'success', true,
    'message', 'Usuário promovido a admin com sucesso',
    'user_id', _target_user_id
  );
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$$;

-- ===== ALTERAÇÃO 4: Criar função para listar admins =====

CREATE OR REPLACE FUNCTION public.get_admin_users()
RETURNS TABLE(user_id UUID, email TEXT, created_at TIMESTAMP WITH TIME ZONE)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT 
    ur.user_id,
    u.email,
    u.created_at
  FROM public.user_roles ur
  JOIN auth.users u ON u.id = ur.user_id
  WHERE ur.role = 'admin'
  ORDER BY u.created_at DESC;
$$;

-- ===== ALTERAÇÃO 5: Melhorar policy RLS com mais segurança =====
-- Garantir que policies estão corretas

-- Verificar se já existe e deixar como está (não alterar para não quebrar produção)
-- As policies atuais já estão corretas:
-- - "Users can view their own roles"
-- - "Admins can view all roles"
-- - "Admins can manage roles"

-- ===== ALTERAÇÃO 6: Executar correção em todos os usuários existentes =====
-- Garantir que todos os usuários têm um role

INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'user'::public.app_role
FROM auth.users u
WHERE u.id NOT IN (SELECT DISTINCT user_id FROM public.user_roles)
ON CONFLICT (user_id, role) DO NOTHING;

-- ===== VERIFICAÇÃO FINAL =====
-- Contar quantos usuários agora têm roles
-- SELECT 
--   COUNT(DISTINCT u.id) as total_usuarios,
--   COUNT(DISTINCT ur.user_id) as usuarios_com_role
-- FROM auth.users u
-- LEFT JOIN public.user_roles ur ON u.id = ur.user_id;
