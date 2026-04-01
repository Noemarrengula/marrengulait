import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type Review = {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  comment: string;
  is_verified_purchase: boolean;
  is_approved: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
};

export const useReviews = (productId?: string) => {
  const queryClient = useQueryClient();

  const {
    data: reviews,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      if (!productId) return [];
      
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .eq('product_id', productId)
        .eq('is_approved', true)
        .order('helpful_count', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!productId,
  });

  return {
    reviews: reviews || [],
    isLoading,
    error,
    refetch,
  };
};

export const usePendingReviews = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['pending-reviews'],
    queryFn: async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          ),
          products:product_id (
            name
          )
        `)
        .eq('is_approved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useApproveReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { error } = await supabase
        .from('reviews')
        .update({ is_approved: true })
        .eq('id', reviewId);

      if (error) throw error;
      return reviewId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['pending-reviews'] });
      toast.success('Avaliação aprovada com sucesso');
    },
    onError: (error: Error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });
};

export const useRejectReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;
      return reviewId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['pending-reviews'] });
      toast.success('Avaliação rejeitada');
    },
    onError: (error: Error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      userId,
      rating,
      title,
      comment,
    }: {
      productId: string;
      userId: string;
      rating: number;
      title?: string;
      comment: string;
    }) => {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { error } = await supabase.from('reviews').insert({
        product_id: productId,
        user_id: userId,
        rating,
        title: title || null,
        comment,
        is_verified_purchase: false,
        is_approved: false,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Avaliação submetida! Aguarda aprovação do administrador.');
    },
    onError: (error: Error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });
};
