import { supabase } from '@/integrations/supabase/client';

export interface ProductFormData {
  title: string;
  description: string;
  price: number;
  old_price?: number;
  image_url: string;
  category: string;
  brand: string;
  stock: number;
  store_name: string;
  featured: boolean;
}

export interface ProductFilters {
  categories?: string[];
  brands?: string[];
  priceRange?: [number, number];
  ratings?: number[];
  search?: string;
  featured?: boolean;
  onSale?: boolean;
}

export const productService = {
  async getAllProducts(filters?: ProductFilters, page?: number, pageSize?: number) {
    let countQuery = supabase.from('products').select('*', { count: 'exact', head: true });
    let query = supabase.from('products').select('*');

    const applyFilters = <T extends ReturnType<typeof supabase.from>>(q: T): T => {
      if (filters?.categories && filters.categories.length > 0) {
        q = q.in('category', filters.categories);
      }
      if (filters?.brands && filters.brands.length > 0) {
        q = q.in('brand', filters.brands);
      }
      if (filters?.priceRange) {
        q = q.gte('price', filters.priceRange[0]).lte('price', filters.priceRange[1]);
      }
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        q = q.or(
          `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,category.ilike.%${searchLower}%,brand.ilike.%${searchLower}%,tags.cs.{"${searchLower}"}`
        );
      }
      if (filters?.featured !== undefined) {
        q = q.eq('featured', filters.featured);
      }
      if (filters?.onSale !== undefined) {
        q = q.eq('on_sale', filters.onSale);
      }
      return q;
    };

    countQuery = applyFilters(countQuery);
    query = applyFilters(query);
    query = query.order('created_at', { ascending: false });

    if (page !== undefined && pageSize !== undefined) {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
    }

    const [countResult, dataResult] = await Promise.all([countQuery, query]);
    if (dataResult.error) throw dataResult.error;

    return {
      data: dataResult.data || [],
      count: countResult.count ?? 0,
    };
  },

  async getProductById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createProduct(product: ProductFormData) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProduct(id: string, product: Partial<ProductFormData>) {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async trackView(productId: string) {
    const { error } = await supabase.rpc('track_product_view', {
      p_product_id: productId
    });
    if (error) console.error('Erro ao rastrear visualização:', error);
  }
};
