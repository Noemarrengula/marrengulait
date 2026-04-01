-- ============================================
-- PART 3: FUNCTIONS
-- ============================================

-- GET ADMIN STATS
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS JSONB AS $$
DECLARE
  stats JSONB;
  low_stock INT;
BEGIN
  SELECT COUNT(*) INTO low_stock FROM products WHERE stock <= low_stock_threshold AND is_active = true;
  
  SELECT jsonb_build_object(
    'total_users', (SELECT COUNT(*) FROM auth.users)::int,
    'total_products', (SELECT COUNT(*) FROM products WHERE is_active = true)::int,
    'total_orders', (SELECT COUNT(*) FROM orders)::int,
    'pending_orders', (SELECT COUNT(*) FROM orders WHERE status = 'pending')::int,
    'low_stock_count', low_stock,
    'today_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE DATE(created_at) = CURRENT_DATE AND payment_status = 'paid')::numeric,
    'month_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE) AND payment_status = 'paid')::numeric,
    'new_users_today', (SELECT COUNT(*) FROM auth.users WHERE DATE(created_at) = CURRENT_DATE)::int,
    'new_orders_today', (SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURRENT_DATE)::int
  ) INTO stats;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- SUBSCRIBE NEWSLETTER
CREATE OR REPLACE FUNCTION subscribe_newsletter(p_email TEXT)
RETURNS JSONB AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM newsletter WHERE email = p_email AND is_active = true) THEN
    RETURN jsonb_build_object('success', false, 'message', 'Este email já está inscrito');
  END IF;
  
  INSERT INTO newsletter (email, is_active)
  VALUES (p_email, true)
  ON CONFLICT (email) DO UPDATE SET
    is_active = true,
    unsubscribed_at = NULL;
  
  RETURN jsonb_build_object('success', true, 'message', 'Inscrição realizada com sucesso');
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN RAISE NOTICE 'Part 3 (Functions) done!'; END $$;
