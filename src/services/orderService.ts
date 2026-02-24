import { supabase } from '@/integrations/supabase/client';
import { CheckoutFormData } from '@/types/order';
import { CartItem } from '@/types/cart';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export async function createOrder(formData: CheckoutFormData, cartItems: CartItem[], userId?: string) {
  const items = cartItems.map(item => ({
    product_id: item.id,
    product_title: item.title,
    product_image: item.image,
    quantity: item.quantity,
    unit_price: item.price,
    store_name: item.storeName
  }));

  const { data, error } = await supabase.rpc('create_order', {
    p_user_id: userId || null,
    p_customer_name: formData.customerName,
    p_customer_email: formData.customerEmail,
    p_customer_phone: formData.customerPhone,
    p_delivery_address: formData.deliveryAddress,
    p_delivery_city: formData.deliveryCity,
    p_delivery_province: formData.deliveryProvince,
    p_delivery_postal_code: formData.deliveryPostalCode || null,
    p_payment_method: formData.paymentMethod,
    p_notes: formData.notes || null,
    p_items: items
  });

  if (error) throw error;
  return data;
}

export async function getOrderById(orderId: string) {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (orderError) throw orderError;

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);

  if (itemsError) throw itemsError;

  return { order, items };
}

export async function getUserOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getAllOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus) {
  const { data, error } = await supabase
    .from('orders')
    .update({ payment_status: paymentStatus })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Manter compatibilidade com código que usa orderService.method()
export const orderService = {
  createOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus
};
