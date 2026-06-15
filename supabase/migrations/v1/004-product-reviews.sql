-- Product Reviews Table
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON product_reviews(is_approved) WHERE is_approved = true;

-- Enable RLS
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Allow read access to approved reviews for everyone
CREATE POLICY "Allow read approved reviews" ON product_reviews
  FOR SELECT USING (is_approved = true);

-- Allow authenticated users to insert their own reviews
CREATE POLICY "Allow authenticated users to insert reviews" ON product_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow admins to manage all reviews
CREATE POLICY "Allow admins to manage reviews" ON product_reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );