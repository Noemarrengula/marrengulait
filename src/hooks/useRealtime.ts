import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export const useRealtimeSubscription = (
  table: string,
  queryKey: string[],
  filter?: { column: string; value: string }
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    let channel: RealtimeChannel;

    const setupSubscription = () => {
      channel = supabase
        .channel(`${table}-changes`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table,
            ...(filter && { filter: `${filter.column}=eq.${filter.value}` })
          },
          () => {
            queryClient.invalidateQueries({ queryKey });
          }
        )
        .subscribe();
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [table, queryKey, filter, queryClient]);
};

// Hook específico para pedidos
export const useOrdersRealtime = (userId?: string) => {
  useRealtimeSubscription(
    'orders',
    ['orders', userId || 'all'],
    userId ? { column: 'user_id', value: userId } : undefined
  );
};

// Hook específico para produtos
export const useProductsRealtime = () => {
  useRealtimeSubscription('products', ['products']);
};

// Hook específico para stock
export const useStockRealtime = (productId: string) => {
  useRealtimeSubscription(
    'products',
    ['product', productId],
    { column: 'id', value: productId }
  );
};
