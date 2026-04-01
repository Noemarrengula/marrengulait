import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SavedForLaterItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  product?: {
    id: string;
    name: string;
    price: number;
    compare_at_price?: number;
    images?: { image_url: string }[];
  };
}

export function useSavedForLater(userId?: string) {
  return useQuery({
    queryKey: ['savedForLater', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('saved_for_later')
        .select(`
          *,
          product:products(
            id,
            name,
            price,
            compare_at_price,
            images:product_images(image_url)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as SavedForLaterItem[];
    },
    enabled: !!userId,
  });
}

export function useAddToSavedForLater() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      userId, 
      productId, 
      quantity = 1 
    }: { 
      userId: string; 
      productId: string; 
      quantity?: number;
    }) => {
      const { data, error } = await supabase
        .from('saved_for_later')
        .upsert({
          user_id: userId,
          product_id: productId,
          quantity,
        }, {
          onConflict: 'user_id,product_id',
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['savedForLater', variables.userId] });
    },
  });
}

export function useRemoveFromSavedForLater() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      userId, 
      productId 
    }: { 
      userId: string; 
      productId: string; 
    }) => {
      const { error } = await supabase
        .from('saved_for_later')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['savedForLater', variables.userId] });
    },
  });
}

export function useMoveToCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      userId,
      productId,
      savedItemId,
    }: {
      userId: string;
      productId: string;
      savedItemId: string;
    }) => {
      const { error } = await supabase
        .from('saved_for_later')
        .delete()
        .eq('id', savedItemId);
      
      if (error) throw error;
      return { productId };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['savedForLater', variables.userId] });
    },
  });
}
