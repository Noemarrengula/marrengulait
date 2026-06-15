export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  storeName?: string;
  maxStock?: number;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}
