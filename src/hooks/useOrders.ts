import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import { CheckoutFormData } from '@/types/order';
import { CartItem } from '@/types/cart';
import { toast } from 'sonner';

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ formData, cartItems, userId }: { 
      formData: CheckoutFormData; 
      cartItems: CartItem[]; 
      userId?: string 
    }) => orderService.createOrder(formData, cartItems, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Pedido criado com sucesso');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar pedido: ${error.message}`);
    },
  });
};

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrderById(orderId),
    enabled: !!orderId,
  });
};

export const useUserOrders = (userId: string) => {
  return useQuery({
    queryKey: ['orders', userId],
    queryFn: () => orderService.getUserOrders(userId),
    enabled: !!userId,
  });
};
