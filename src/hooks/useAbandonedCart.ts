import { useEffect, useCallback } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const ABANDONED_CART_DELAY = 30 * 60 * 1000;

export const useAbandonedCart = () => {
  const { items } = useCart();
  const { user } = useAuth();

  const saveCartState = useCallback(async () => {
    if (!user || items.length === 0) return;

    try {
      const cartData = {
        user_id: user.id,
        cart_items: items,
        total_value: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        saved_at: new Date().toISOString(),
        notified: false
      };

      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cartData));
    } catch (error) {
      console.error('Error saving cart state:', error);
    }
  }, [user, items]);

  const checkAbandonedCart = useCallback(async () => {
    if (!user || items.length === 0) return;

    try {
      const savedCart = localStorage.getItem(`cart_${user.id}`);
      if (!savedCart) {
        await saveCartState();
        return;
      }

      const cartData = JSON.parse(savedCart);
      const timePassed = Date.now() - new Date(cartData.saved_at).getTime();

      if (timePassed >= ABANDONED_CART_DELAY && !cartData.notified && cartData.cart_items.length > 0) {
        const { error } = await supabase
          .from('abandoned_cart_notifications')
          .upsert({
            user_id: user.id,
            cart_data: cartData,
            notified_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (!error) {
          console.log('Abandoned cart notification saved');
        }

        cartData.notified = true;
        localStorage.setItem(`cart_${user.id}`, JSON.stringify(cartData));
      }
    } catch (error) {
      console.error('Error checking abandoned cart:', error);
    }
  }, [user, items, saveCartState]);

  useEffect(() => {
    if (user && items.length > 0) {
      const timer = setTimeout(() => {
        saveCartState();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [items, user, saveCartState]);

  useEffect(() => {
    if (user) {
      checkAbandonedCart();
    }
  }, [user]);

  return { saveCartState, checkAbandonedCart };
};

export default useAbandonedCart;
