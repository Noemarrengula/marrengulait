import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { CartItem } from '@/types/cart';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AppliedCoupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  discount_amount: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  subtotal: number;
  discount: number;
  total: number;
  coupon: AppliedCoupon | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'marrengula_cart';
const COUPON_STORAGE_KEY = 'marrengula_coupon';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
      }
    }

    const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
    if (savedCoupon) {
      try {
        setCoupon(JSON.parse(savedCoupon));
      } catch (error) {
        console.error('Erro ao carregar cupão:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon));
    } else {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  }, [coupon]);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(i => i.id === item.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        if (item.maxStock && newQuantity > item.maxStock) {
          toast.error('Quantidade máxima atingida');
          return currentItems;
        }
        
        toast.success('Quantidade atualizada no carrinho');
        return currentItems.map(i =>
          i.id === item.id ? { ...i, quantity: newQuantity } : i
        );
      }
      
      toast.success('Produto adicionado ao carrinho');
      return [...currentItems, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
    toast.success('Produto removido do carrinho');
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item => {
        if (item.id === id) {
          if (item.maxStock && quantity > item.maxStock) {
            toast.error('Quantidade máxima atingida');
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    setCoupon(null);
    toast.success('Carrinho limpo');
  }, []);

  const applyCoupon = useCallback(async (code: string): Promise<boolean> => {
    if (!code.trim()) {
      toast.error('Por favor, insere um código de cupão');
      return false;
    }

    if (items.length === 0) {
      toast.error('Adiciona produtos ao carrinho primeiro');
      return false;
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    try {
      const { data, error } = await supabase.rpc('validate_coupon', {
        p_code: code.trim().toUpperCase(),
        p_subtotal: subtotal,
        p_product_ids: null,
        p_category: null,
      });

      if (error) throw error;

      interface CouponResult {
        is_valid: boolean;
        error_message?: string;
        coupon_id?: string;
        code?: string;
        discount_type?: string;
        discount_value?: number;
        discount_amount?: number;
      }

      const result = data as CouponResult;

      if (!result.is_valid) {
        toast.error(result.error_message || 'Cupão inválido');
        return false;
      }

      setCoupon({
        id: result.coupon_id,
        code: result.code,
        discount_type: result.discount_type as 'percentage' | 'fixed',
        discount_value: result.discount_value,
        discount_amount: result.discount_amount,
      });

      const discountText = result.discount_type === 'percentage' 
        ? `${result.discount_value}% OFF`
        : `-${result.discount_value} MT`;
      
      toast.success(`Cupão aplicado: ${discountText}`);
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao aplicar cupão';
      console.error('Erro ao aplicar cupão:', err);
      toast.error(message);
      return false;
    }
  }, [items]);

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    toast.success('Cupão removido');
  }, []);

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const discount = coupon?.discount_amount || 0;
  const total = Math.max(0, subtotal - discount);
  const totalPrice = total;

  const value = useMemo(() => ({
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    subtotal,
    discount,
    total,
    coupon,
    applyCoupon,
    removeCoupon,
  }), [items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, subtotal, discount, total, coupon, applyCoupon, removeCoupon]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
