import { useState, useEffect, useCallback } from 'react';

interface RecentlyViewedItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  viewedAt: string;
}

const STORAGE_KEY = 'marrengula_recently_viewed';
const MAX_ITEMS = 10;

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse recently viewed:', e);
      }
    }
  }, []);

  const addToRecentlyViewed = useCallback((product: {
    id: string;
    name: string;
    slug?: string;
    price: number;
    image?: string;
  }) => {
    setRecentlyViewed(prev => {
      const existing = prev.find(item => item.id === product.id);
      
      let updated: RecentlyViewedItem[];
      
      if (existing) {
        updated = prev.filter(item => item.id !== product.id);
      } else {
        updated = prev;
      }
      
      const newItem: RecentlyViewedItem = {
        id: product.id,
        name: product.name,
        slug: product.slug || product.id,
        price: product.price,
        image: product.image || '',
        viewedAt: new Date().toISOString(),
      };
      
      updated = [newItem, ...updated].slice(0, MAX_ITEMS);
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save recently viewed:', e);
      }
      
      return updated;
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed,
  };
}

export default useRecentlyViewed;
