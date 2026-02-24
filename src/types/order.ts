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
  userId?: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryProvince: string;
  deliveryPostalCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentProof?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productTitle: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  storeName?: string;
}
