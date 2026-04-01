// ============================================
// TIPOS DO BANCO DE DADOS - Marrengula IT
// ============================================
// Tipos TypeScript que espelham as tabelas do Supabase
// Gerados a partir das migrações SQL
// ============================================

// ============================================
// AUTENTICAÇÃO E USUÁRIOS
// ============================================

export type UserRole = 'admin' | 'vendor' | 'user';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRoleRecord {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

// ============================================
// CATEGORIAS
// ============================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  parent_id: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryTree extends Category {
  subcategories?: Category[];
}

// ============================================
// VENDEDORES/LOJAS
// ============================================

export type VendorStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface Vendor {
  id: string;
  owner_id: string;
  store_name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  email: string;
  phone: string;
  whatsapp: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  status: VendorStatus;
  approved_at: string | null;
  approved_by: string | null;
  rejection_reason: string | null;
  rating: number;
  total_sales: number;
  total_products: number;
  is_active: boolean;
  commission_rate: number;
  created_at: string;
  updated_at: string;
}

// ============================================
// PRODUTOS
// ============================================

export interface ProductVariant {
  name: string;
  values: string[];
}

export interface ProductSpecifications {
  [key: string]: string | number | boolean;
}

export interface Product {
  id: string;
  vendor_id: string;
  category: string | null;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  old_price: number | null;
  cost_price: number | null;
  sku: string | null;
  stock: number;
  low_stock_threshold: number;
  images: string[];
  brand: string | null;
  model: string | null;
  rating: number;
  reviews_count: number;
  sales_count: number;
  views_count: number;
  featured: boolean;
  on_sale: boolean;
  is_active: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface ProductWithImages extends Omit<Product, 'images' | 'category'> {
  images: ProductImage[];
  vendor?: Vendor;
  category?: string;
}

// ============================================
// PEDIDOS
// ============================================

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'mpesa' | 'bank_transfer' | 'cash_on_delivery';

export interface Order {
  id: string;
  user_id: string | null;
  order_number: string;
  status: OrderStatus;
  total_amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_proof: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
  store_name: string | null;
  created_at: string;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

// ============================================
// AVALIAÇÕES
// ============================================

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  order_id: string | null;
  rating: number;
  title: string | null;
  comment: string | null;
  images: string[];
  is_verified_purchase: boolean;
  helpful_count: number;
  unhelpful_count: number;
  vendor_response: string | null;
  vendor_response_at: string | null;
  is_approved: boolean;
  is_flagged: boolean;
  flag_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReviewVote {
  id: string;
  review_id: string;
  user_id: string;
  is_helpful: boolean;
  created_at: string;
}

export interface ReviewWithUser extends Review {
  user_name: string | null;
}

// ============================================
// FAVORITOS
// ============================================

export interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface FavoriteWithProduct extends Favorite {
  product: Product;
}

// ============================================
// PARÂMETROS DE BUSCA E FILTROS
// ============================================

export interface ProductSearchParams {
  search_term?: string;
  category_id?: string;
  vendor_id?: string;
  min_price?: number;
  max_price?: number;
  is_featured?: boolean;
  limit?: number;
  offset?: number;
}

export interface ProductSearchResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price: number | null;
  rating: number;
  review_count: number;
  vendor_name: string | null;
  category_name: string | null;
  primary_image: string | null;
}

// ============================================
// RESPOSTAS DE FUNÇÕES SQL
// ============================================

export interface CreateOrderParams {
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_city: string;
  delivery_province: string;
  delivery_postal_code: string | null;
  payment_method: PaymentMethod;
  notes: string | null;
  items: Array<{
    product_id: string;
    product_title: string;
    product_image: string | null;
    quantity: number;
    unit_price: number;
    store_name: string | null;
  }>;
}

// ============================================
// TIPOS AUXILIARES
// ============================================

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

// ============================================
// TIPOS DE FORMULÁRIOS
// ============================================

export interface VendorFormData {
  store_name: string;
  slug: string;
  description?: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  province?: string;
}

export interface ProductFormData {
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  category_id?: string;
  price: number;
  compare_at_price?: number;
  sku?: string;
  stock_quantity: number;
  variants?: ProductVariant[];
  specifications?: ProductSpecifications;
  is_featured?: boolean;
}

export interface ReviewFormData {
  product_id: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
}
