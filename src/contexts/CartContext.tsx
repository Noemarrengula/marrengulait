import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, CartContextType } from '@/types/cart';
import { toast } from 'sonner';

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'marrengula_cart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
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
  };

  const removeItem = (id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
    toast.success('Produto removido do carrinho');
  };

  const updateQuantity = (id: string, quantity: number) => {
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
  };

  const clearCart = () => {
    setItems([]);
    toast.success('Carrinho limpo');
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de CartProvider');
  }
  return context;
};
