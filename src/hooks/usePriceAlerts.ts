import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PriceAlert {
  id: string;
  user_id: string;
  product_id: string;
  target_price: number;
  current_price_at_creation?: number;
  is_active: boolean;
  is_triggered: boolean;
  triggered_at?: string;
  created_at: string;
  product?: {
    id: string;
    name: string;
    price: number;
  };
}

export function usePriceAlerts(userId?: string) {
  return useQuery({
    queryKey: ['priceAlerts', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('price_alerts')
        .select(`
          *,
          product:products(id, name, price)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PriceAlert[];
    },
    enabled: !!userId,
  });
}

export function useActivePriceAlerts(userId?: string) {
  return useQuery({
    queryKey: ['priceAlerts', userId, 'active'],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('price_alerts')
        .select(`
          *,
          product:products(id, name, price, compare_at_price, images:product_images(image_url))
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .eq('is_triggered', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PriceAlert[];
    },
    enabled: !!userId,
  });
}

export function useTriggeredPriceAlerts(userId?: string) {
  return useQuery({
    queryKey: ['priceAlerts', userId, 'triggered'],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('price_alerts')
        .select(`
          *,
          product:products(id, name, price, compare_at_price, images:product_images(image_url))
        `)
        .eq('user_id', userId)
        .eq('is_triggered', true)
        .order('triggered_at', { ascending: false });
      
      if (error) throw error;
      return data as PriceAlert[];
    },
    enabled: !!userId,
  });
}

export function useCreatePriceAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      userId,
      productId,
      targetPrice,
      currentPrice,
    }: {
      userId: string;
      productId: string;
      targetPrice: number;
      currentPrice?: number;
    }) => {
      const { data, error } = await supabase
        .from('price_alerts')
        .upsert({
          user_id: userId,
          product_id: productId,
          target_price: targetPrice,
          current_price_at_creation: currentPrice,
          is_active: true,
        }, {
          onConflict: 'user_id,product_id',
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['priceAlerts', variables.userId] });
    },
  });
}

export function useDeletePriceAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      userId,
      alertId,
    }: {
      userId: string;
      alertId: string;
    }) => {
      const { error } = await supabase
        .from('price_alerts')
        .delete()
        .eq('id', alertId);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['priceAlerts', variables.userId] });
    },
  });
}

export function useCheckProductAlert(userId?: string, productId?: string) {
  return useQuery({
    queryKey: ['priceAlerts', 'check', userId, productId],
    queryFn: async () => {
      if (!userId || !productId) return null;
      
      const { data, error } = await supabase
        .from('price_alerts')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .eq('is_active', true)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as PriceAlert | null;
    },
    enabled: !!userId && !!productId,
  });
}
