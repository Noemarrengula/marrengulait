export interface Product {
  id: string;
  title?: string;
  name?: string;
  price: number;
  old_price?: number;
  compare_at_price?: number;
  stock: number;
  category?: string;
  category_id?: string;
  brand?: string;
  brand_id?: string;
  store_name?: string;
  image_url?: string;
  images?: string[];
  description?: string;
  featured?: boolean;
  is_featured?: boolean;
  on_sale?: boolean;
  is_on_sale?: boolean;
  is_active?: boolean;
  rating?: number;
  view_count?: number;
  sale_count?: number;
  created_at?: string;
}

export interface Order {
  id: string;
  order_number?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  total_amount: number;
  subtotal?: number;
  shipping_cost?: number;
  status: string;
  payment_status?: string;
  payment_method?: string;
  created_at: string;
  shipping_address?: Record<string, unknown>;
  items?: Record<string, unknown>[];
  payment_proof_url?: string;
  payment_proof_data?: { method: string; reference: string; message: string };
  payment_reference?: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  created_at: string;
  last_login_at?: string;
}

export interface Question {
  id: string;
  question: string;
  answer?: string;
  product_id: string;
  user_id?: string;
  created_at?: string;
}

export interface PriceAlert {
  id: string;
  user_id: string;
  product_id: string;
  target_price?: number;
  created_at?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  min_order: number;
  max_uses: number;
  used_count: number;
  expiry_date: string | null;
  active: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  entity: string;
  entity_id: string | null;
  details: string;
  user_email: string | null;
  created_at: string;
}

export interface SiteSettings {
  siteName: string;
  whatsappNumber: string;
  email: string;
  address: string;
  freeShippingThreshold: number;
  currency: string;
  taxRate: number;
  mpesaEnabled: boolean;
  emolaEnabled: boolean;
  cashEnabled: boolean;
  heroTitle: string;
  heroSubtitle: string;
  showJuneBanner: boolean;
}

export interface ContentBanner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  active: boolean;
  order: number;
}

export interface ProductForm {
  title: string;
  price: number;
  compare_at_price: number;
  stock: number;
  category: string;
  brand: string;
  image_url: string;
  description: string;
  is_featured: boolean;
  is_on_sale: boolean;
  is_active: boolean;
}

export interface CouponForm {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minOrder: number;
  maxUses: number;
  expiryDate: string;
}

export interface BannerForm {
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  lowStockProducts: number;
  pendingOrders: number;
  recentOrders: Order[];
  topProducts: Product[];
  salesByDay: { date: string; total: number }[];
}
