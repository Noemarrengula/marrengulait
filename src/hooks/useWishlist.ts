import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export type WishlistItem = {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: {
    id: string;
    name: string;
    price: number;
    old_price: number | null;
    images: string[];
    rating: number;
    reviews_count: number;
    on_sale: boolean;
    stock: number;
    store_id?: string;
    store_name?: string;
  };
};

export const useWishlist = (userId?: string) => {
  const queryClient = useQueryClient();

  const { data: wishlist = [], isLoading, error, refetch } = useQuery({
    queryKey: ['wishlist', userId],
    queryFn: async (): Promise<WishlistItem[]> => {
      if (!userId) return [];
      
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          *,
          product:products (
            id,
            name,
            price,
            old_price,
            images,
            rating,
            reviews_count,
            on_sale,
            stock,
            store_id,
            stores (
              name
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(item => ({
        ...item,
        product: item.product ? {
          ...item.product,
          store_name: (item.product as any)?.stores?.name
        } : undefined
      })) as WishlistItem[];
    },
    enabled: !!userId,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
  });

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.product_id === productId);
  };

  return {
    wishlist,
    isLoading,
    error,
    refetch,
    isInWishlist,
  };
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, productId }: { userId: string; productId: string }) => {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { error } = await supabase.from('wishlists').insert({
        user_id: userId,
        product_id: productId,
      });

      if (error) throw error;
      return { userId, productId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Adicionado à lista de desejos');
    },
    onError: (error: Error) => {
      if (error.message.includes('duplicate')) {
        toast.info('Este produto já está na sua lista de desejos');
      } else {
        toast.error(`Erro: ${error.message}`);
      }
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, productId }: { userId: string; productId: string }) => {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);

      if (error) throw error;
      return { userId, productId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Removido da lista de desejos');
    },
    onError: (error: Error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });
};

export const useToggleWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      userId, 
      productId, 
      isCurrentlyInWishlist 
    }: { 
      userId: string; 
      productId: string; 
      isCurrentlyInWishlist: boolean;
    }) => {
      const { supabase } = await import('@/integrations/supabase/client');
      
      if (isCurrentlyInWishlist) {
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', productId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('wishlists').insert({
          user_id: userId,
          product_id: productId,
        });
        if (error) throw error;
      }
      
      return { userId, productId, added: !isCurrentlyInWishlist };
    },
    onMutate: async ({ userId, productId, isCurrentlyInWishlist }) => {
      await queryClient.cancelQueries({ queryKey: ['wishlist', userId] });
      
      const previousWishlist = queryClient.getQueryData(['wishlist', userId]);
      
      queryClient.setQueryData(['wishlist', userId], (old: WishlistItem[] | undefined) => {
        if (!old) return old;
        if (isCurrentlyInWishlist) {
          return old.filter(item => item.product_id !== productId);
        }
        return old;
      });
      
      return { previousWishlist };
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(['wishlist', _variables.userId], context.previousWishlist);
      }
      toast.error(`Erro: ${error.message}`);
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', variables.userId] });
    },
    onSuccess: (_data, variables) => {
      if (variables.isCurrentlyInWishlist) {
        toast.success('Removido da lista de desejos');
      } else {
        toast.success('Adicionado à lista de desejos');
      }
    },
  });
};
