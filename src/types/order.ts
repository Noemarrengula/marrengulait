export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'mpesa' | 'bank_transfer' | 'cash_on_delivery';

export interface CheckoutFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryProvince: string;
  deliveryPostalCode?: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface Order {
  id: string;
  user_id?: string;
  order_number: string;
  status: OrderStatus;
  total_amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_city: string;
  delivery_province: string;
  delivery_postal_code?: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_proof?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  store_name?: string;
}
