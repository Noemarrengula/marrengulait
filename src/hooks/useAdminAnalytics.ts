import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AdminStats {
  total_users: number;
  total_products: number;
  total_orders: number;
  pending_orders: number;
  low_stock_count: number;
  today_revenue: number;
  month_revenue: number;
  new_users_today: number;
  new_orders_today: number;
}

interface DailySales {
  date: string;
  order_count: number;
  total_revenue: number;
  avg_order_value: number;
}

interface TopProduct {
  id: string;
  name: string;
  total_sold: number;
  total_revenue: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_admin_stats');
      if (error) throw error;
      return data as AdminStats;
    },
    refetchInterval: 60000,
  });
}

export function useDailySales(days: number = 30) {
  return useQuery({
    queryKey: ['admin', 'dailySales', days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_sales')
        .select('*')
        .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data as DailySales[];
    },
  });
}

export function useTopProducts(limit: number = 10) {
  return useQuery({
    queryKey: ['admin', 'topProducts', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          sales_count,
          total_amount:order_items(subtotal)
        `)
        .order('sales_count', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as TopProduct[];
    },
  });
}

export function useRecentOrders(limit: number = 10) {
  return useQuery({
    queryKey: ['admin', 'recentOrders', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as RecentOrder[];
    },
    refetchInterval: 30000,
  });
}

export function useLowStockProducts() {
  return useQuery({
    queryKey: ['admin', 'lowStock'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('low_stock_products')
        .select('*');
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 60000,
  });
}

export function useCustomerSummary(limit: number = 20) {
  return useQuery({
    queryKey: ['admin', 'customerSummary', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_summary')
        .select('*')
        .order('total_spent', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    },
  });
}

export function useOrdersByStatus() {
  return useQuery({
    queryKey: ['admin', 'ordersByStatus'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('status')
        .then(async ({ data, error }) => {
          if (error) throw error;
          
          const statusCounts = data?.reduce((acc: Record<string, number>, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
          }, {}) || {};
          
          return Object.entries(statusCounts).map(([status, count]) => ({
            status,
            count,
          }));
        });
      
      return data;
    },
  });
}

export function useRevenueByCategory() {
  return useQuery({
    queryKey: ['admin', 'revenueByCategory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          subtotal,
          product:products(category)
        `);
      
      if (error) throw error;
      
      const categoryRevenue: Record<string, number> = {};
      
      data?.forEach(item => {
        const product = item.product as { category?: string } | null;
        const categoryName = product?.category || 'Sem categoria';
        categoryRevenue[categoryName] = (categoryRevenue[categoryName] || 0) + (item.subtotal || 0);
      });
      
      return Object.entries(categoryRevenue).map(([category, revenue]) => ({
        category,
        revenue,
      }));
    },
  });
}
