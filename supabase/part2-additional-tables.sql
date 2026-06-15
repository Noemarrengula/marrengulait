-- ============================================
-- PART 2: ADDITIONAL TABLES
-- ============================================

-- GUEST SESSIONS
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

-- PAGE VIEWS
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

-- SEARCH HISTORY
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

-- USER PREFERENCES
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

-- ADD COLUMNS
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS helpful_votes INTEGER DEFAULT 0;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS unhelpful_votes INTEGER DEFAULT 0;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS report_count INTEGER DEFAULT 0;

ALTER TABLE orders ADD COLUMN IF NOT EXISTS guest_session_id UUID;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_guest BOOLEAN DEFAULT false;

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_page_views_product ON page_views(product_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_guest ON orders(guest_session_id) WHERE is_guest = true;

DO $$ BEGIN RAISE NOTICE 'Part 2 (Additional Tables) done!'; END $$;
