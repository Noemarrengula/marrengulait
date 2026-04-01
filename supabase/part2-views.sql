-- ============================================
-- PART 1: VIEWS
-- ============================================

CREATE OR REPLACE VIEW low_stock_products AS
SELECT id, name, stock, low_stock_threshold, price, category
FROM products
WHERE stock <= low_stock_threshold AND is_active = true
ORDER BY stock ASC;

CREATE OR REPLACE VIEW daily_sales AS
SELECT 
  DATE(created_at) as date,
  COUNT(*)::int as order_count,
  COALESCE(SUM(total_amount), 0)::numeric as total_revenue,
  COALESCE(AVG(total_amount), 0)::numeric as avg_order_value
FROM orders
WHERE payment_status = 'paid'
GROUP BY DATE(created_at)
ORDER BY date DESC;

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

DO $$ BEGIN RAISE NOTICE 'Part 1 (Views) done!'; END $$;
