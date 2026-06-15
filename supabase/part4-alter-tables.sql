-- ============================================
-- PART 4: ADD COLUMNS TO EXISTING TABLES
-- ============================================

-- Add columns to reviews
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS helpful_votes INTEGER DEFAULT 0;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS unhelpful_votes INTEGER DEFAULT 0;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS report_count INTEGER DEFAULT 0;

-- Add columns to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS guest_session_id UUID;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_guest BOOLEAN DEFAULT false;

DO $$ BEGIN RAISE NOTICE 'Part 4 done!'; END $$;
