import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

export type SearchSuggestion = {
  id: string;
  name: string;
  category?: string;
  price: number;
  image?: string;
  type: 'product' | 'category' | 'recent';
};

const CATEGORIES = [
  { name: 'Smartphones', query: 'smartphone', icon: '📱' },
  { name: 'Portáteis', query: 'portatil', icon: '💻' },
  { name: 'Tablets', query: 'tablet', icon: '📲' },
  { name: 'Câmaras', query: 'camera', icon: '📷' },
  { name: 'Acessórios', query: 'acessorios', icon: '🔌' },
  { name: 'Eletrónica', query: 'eletronica', icon: '📺' },
  { name: 'Gaming', query: 'gaming', icon: '🎮' },
  { name: 'Redes', query: 'rede', icon: '🌐' },
];

const STORAGE_KEY = 'marrengula_recent_searches';
const MAX_RECENT = 5;

export const useSearchSuggestions = (query: string, debounceMs = 300) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ['search-suggestions', debouncedQuery],
    queryFn: async (): Promise<SearchSuggestion[]> => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        return [];
      }

      const { supabase } = await import('@/integrations/supabase/client');

      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, images, categories(name)')
        .ilike('name', `%${debouncedQuery}%`)
        .limit(8);

      if (error) {
        console.error('Search suggestions error:', error);
        return [];
      }

      const productSuggestions: SearchSuggestion[] = (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.categories?.name,
        price: p.price,
        image: p.images?.[0],
        type: 'product' as const,
      }));

      const categorySuggestions: SearchSuggestion[] = CATEGORIES
        .filter(c => c.name.toLowerCase().includes(debouncedQuery.toLowerCase()))
        .map(c => ({
          id: `cat-${c.query}`,
          name: c.name,
          price: 0,
          type: 'category' as const,
        }));

      return [...categorySuggestions.slice(0, 3), ...productSuggestions];
    },
    enabled: debouncedQuery.length >= 2,
    staleTime: 1000 * 60,
  });

  return { suggestions, isLoading };
};

export const useRecentSearches = () => {
  const getRecent = useCallback((): SearchSuggestion[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return parsed.map((item: { query: string; timestamp: number }) => ({
        id: `recent-${item.query}`,
        name: item.query,
        type: 'recent' as const,
        price: 0,
      }));
    } catch {
      return [];
    }
  }, []);

  const addRecent = useCallback((query: string) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const recent: { query: string; timestamp: number }[] = stored ? JSON.parse(stored) : [];
      const filtered = recent.filter(r => r.query.toLowerCase() !== query.toLowerCase());
      const updated = [{ query, timestamp: Date.now() }, ...filtered].slice(0, MAX_RECENT);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const clearRecent = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { getRecent, addRecent, clearRecent };
};

export default useSearchSuggestions;
