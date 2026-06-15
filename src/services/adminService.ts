import { supabase } from '@/integrations/supabase/client';

export const adminService = {
  async getDashboardStats() {
    try {
      // Contar usuários
      const { count: usersCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true });

      // Contar produtos
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Contar lojas únicas
      const { data: stores } = await supabase
        .from('products')
        .select('store_name')
        .not('store_name', 'is', null);
      
      const uniqueStores = new Set(stores?.map(s => s.store_name)).size;

      // Vendas de hoje
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: todayOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      return {
        usersCount: usersCount || 0,
        productsCount: productsCount || 0,
        storesCount: uniqueStores || 0,
        todayOrders: todayOrders || 0
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return {
        usersCount: 0,
        productsCount: 0,
        storesCount: 0,
        todayOrders: 0
      };
    }
  }
};
