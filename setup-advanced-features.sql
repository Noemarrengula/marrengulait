-- Wishlist Compartilhável
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT 'Minha Lista',
  share_code TEXT UNIQUE,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wishlist_id UUID REFERENCES public.wishlists(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wishlist_id, product_id)
);

-- Bundles/Kits
CREATE TABLE IF NOT EXISTS public.product_bundles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  discount_percentage DECIMAL(5, 2) DEFAULT 0,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bundle_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bundle_id UUID REFERENCES public.product_bundles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1
);

-- Alertas de Preço
CREATE TABLE IF NOT EXISTS public.price_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  target_price DECIMAL(10, 2) NOT NULL,
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flash Sales
CREATE TABLE IF NOT EXISTS public.flash_sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  discount_percentage DECIMAL(5, 2) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  stock_limit INTEGER,
  sold_count INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true
);

CREATE INDEX idx_wishlists_user ON public.wishlists(user_id);
CREATE INDEX idx_price_alerts_product ON public.price_alerts(product_id);
CREATE INDEX idx_flash_sales_active ON public.flash_sales(active, end_time);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own wishlists" ON public.wishlists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own alerts" ON public.price_alerts FOR ALL USING (auth.uid() = user_id);
