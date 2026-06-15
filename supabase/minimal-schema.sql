-- MINIMAL VERSION - Execute this first

CREATE TABLE IF NOT EXISTS saved_for_later (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE saved_for_later ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sfl_sel" ON saved_for_later FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "sfl_ins" ON saved_for_later FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sfl_del" ON saved_for_later FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  target_price DECIMAL(12,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pa_sel" ON price_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "pa_ins" ON price_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "pa_del" ON price_alerts FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS stock_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE stock_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sn_sel" ON stock_notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "sn_ins" ON stock_notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sn_del" ON stock_notifications FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "not_sel" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "not_upd" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "not_ins" ON notifications FOR INSERT WITH CHECK (true);

ALTER TABLE reviews ADD COLUMN IF NOT EXISTS helpful_votes INTEGER DEFAULT 0;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS unhelpful_votes INTEGER DEFAULT 0;

CREATE OR REPLACE VIEW low_stock_products AS
SELECT id, name, stock, low_stock_threshold, price, category
FROM products
WHERE stock <= low_stock_threshold AND is_active = true
ORDER BY stock ASC;

DO $$ BEGIN RAISE NOTICE 'Done!'; END $$;
