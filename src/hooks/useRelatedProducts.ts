import { useQuery } from '@tanstack/react-query';

export type RelatedProduct = {
  id: string;
  name: string;
  price: number;
  old_price: number | null;
  images: string[];
  rating: number;
  reviews_count: number;
  on_sale: boolean;
  stock: number;
};

export const useRelatedProducts = (
  productId?: string,
  category?: string,
  limit = 8
) => {
  return useQuery({
    queryKey: ['related-products', productId, category, limit],
    queryFn: async (): Promise<RelatedProduct[]> => {
      if (!productId) return [];

      const { supabase } = await import('@/integrations/supabase/client');

      let query = supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          old_price,
          images,
          rating,
          reviews_count,
          on_sale,
          stock
        `)
        .neq('id', productId)
        .eq('is_active', true)
        .gt('stock', 0)
        .limit(limit);

      if (category) {
        query = query.ilike('category', `%${category}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching related products:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
  });
};

export default useRelatedProducts;
