-- RPC functions for admin role management
-- These provide a cleaner API than direct table access

CREATE OR REPLACE FUNCTION get_all_user_roles()
RETURNS TABLE(
  id UUID,
  user_id UUID,
  role TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ur.id, ur.user_id, ur.role::TEXT, ur.created_at
  FROM user_roles ur
  ORDER BY ur.created_at DESC;
$$;

CREATE OR REPLACE FUNCTION add_user_role(
  p_user_id UUID,
  p_role TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO user_roles (user_id, role)
  VALUES (p_user_id, p_role)
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION remove_user_role(
  p_role_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM user_roles WHERE id = p_role_id;
END;
$$;

CREATE OR REPLACE FUNCTION remove_user_role_by_user_and_role(
  p_user_id UUID,
  p_role TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM user_roles WHERE user_id = p_user_id AND role = p_role;
END;
$$;

-- Function to check if user has any admin-level role
CREATE OR REPLACE FUNCTION is_admin(p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = p_user_id
      AND role IN ('admin', 'super_admin')
  );
$$;
