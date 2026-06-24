-- RPC functions for order management
-- These replace direct supabase.from('orders') calls for security

CREATE OR REPLACE FUNCTION get_orders()
RETURNS SETOF orders
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM orders
  ORDER BY created_at DESC;
$$;

CREATE OR REPLACE FUNCTION get_order_by_id(p_order_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'order', row_to_json(o.*)::jsonb,
    'items', COALESCE(
      (SELECT jsonb_agg(row_to_json(oi.*)::jsonb)
       FROM order_items oi
       WHERE oi.order_id = o.id),
      '[]'::jsonb
    )
  ) INTO v_result
  FROM orders o
  WHERE o.id = p_order_id;

  RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION get_user_orders(p_user_id UUID)
RETURNS SETOF orders
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM orders
  WHERE user_id = p_user_id
  ORDER BY created_at DESC;
$$;

CREATE OR REPLACE FUNCTION update_order_status(
  p_order_id UUID,
  p_status TEXT
)
RETURNS orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order orders;
BEGIN
  UPDATE orders
  SET status = p_status, updated_at = now()
  WHERE id = p_order_id
  RETURNING * INTO v_order;

  RETURN v_order;
END;
$$;

CREATE OR REPLACE FUNCTION update_payment_status(
  p_order_id UUID,
  p_payment_status TEXT
)
RETURNS orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order orders;
BEGIN
  UPDATE orders
  SET payment_status = p_payment_status, updated_at = now()
  WHERE id = p_order_id
  RETURNING * INTO v_order;

  RETURN v_order;
END;
$$;
