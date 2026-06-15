-- ============================================
-- MARRENGULA-IT - COMPLETE DATABASE SCHEMA
-- ============================================

-- ============================================
-- 1. SAVED FOR LATER
-- ============================================
CREATE TABLE IF NOT EXISTS saved_for_later (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE saved_for_later ENABLE ROW LEVEL SECURITY;
CREATE POLICY "saved_for_later_select" ON saved_for_later FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "saved_for_later_insert" ON saved_for_later FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saved_for_later_update" ON saved_for_later FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "saved_for_later_delete" ON saved_for_later FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 2. PRICE ALERTS
-- ============================================
CREATE TABLE IF NOT EXISTS price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  target_price DECIMAL(12,2) NOT NULL,
  current_price_at_creation DECIMAL(12,2),
  is_active BOOLEAN DEFAULT true,
  is_triggered BOOLEAN DEFAULT false,
  triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "price_alerts_select" ON price_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "price_alerts_insert" ON price_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "price_alerts_update" ON price_alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "price_alerts_delete" ON price_alerts FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 3. STOCK NOTIFICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS stock_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_triggered BOOLEAN DEFAULT false,
  triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE stock_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stock_notifications_select" ON stock_notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "stock_notifications_insert" ON stock_notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "stock_notifications_update" ON stock_notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "stock_notifications_delete" ON stock_notifications FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 4. NOTIFICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_select" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_update" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notifications_insert" ON notifications FOR INSERT WITH CHECK (true);

-- ============================================
-- 5. GUEST SESSIONS
-- ============================================
CREATE TABLE IF NOT EXISTS guest_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  email TEXT,
  customer_name TEXT,
  customer_phone TEXT,
  shipping_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days'
);

ALTER TABLE guest_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "guest_sessions_insert" ON guest_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "guest_sessions_select" ON guest_sessions FOR SELECT USING (true);

-- ============================================
-- 6. PAGE VIEWS
-- ============================================
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  page_url TEXT NOT NULL,
  referrer TEXT,
  device_type VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "page_views_insert" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "page_views_select" ON page_views FOR SELECT USING (true);

-- ============================================
-- 7. SEARCH HISTORY
-- ============================================
CREATE TABLE IF NOT EXISTS search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  search_term TEXT NOT NULL,
  results_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "search_history_select" ON search_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "search_history_insert" ON search_history FOR INSERT WITH CHECK (true);

-- ============================================
-- 8. USER PREFERENCES
-- ============================================
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  theme VARCHAR(20) DEFAULT 'system',
  locale VARCHAR(10) DEFAULT 'pt-MZ',
  currency VARCHAR(5) DEFAULT 'MT',
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT false,
  sms_notifications BOOLEAN DEFAULT false,
  marketing_emails BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_preferences_all" ON user_preferences FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 9. ADD COLUMNS TO EXISTING TABLES
-- ============================================
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS helpful_votes INTEGER DEFAULT 0;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS unhelpful_votes INTEGER DEFAULT 0;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS report_count INTEGER DEFAULT 0;

ALTER TABLE orders ADD COLUMN IF NOT EXISTS guest_session_id UUID;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_guest BOOLEAN DEFAULT false;

-- ============================================
-- 10. INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_saved_for_later_user ON saved_for_later(user_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_user_product ON price_alerts(user_id, product_id);
CREATE INDEX IF NOT EXISTS idx_stock_notifications_product ON stock_notifications(product_id, is_active, is_triggered);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_page_views_product ON page_views(product_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_guest ON orders(guest_session_id) WHERE is_guest = true;

-- ============================================
-- 11. VIEWS
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

-- ============================================
-- 12. FUNCTIONS
-- ============================================
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS JSONB AS $$
DECLARE
  stats JSONB;
  low_stock INT;
BEGIN
  SELECT COUNT(*) INTO low_stock FROM low_stock_products;
  
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

-- ============================================
-- DONE
-- ============================================
DO $$ BEGIN RAISE NOTICE 'Marrengula-IT schema created successfully!'; END $$;
