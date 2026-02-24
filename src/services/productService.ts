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
}

export const productService = {
  async getAllProducts(filters?: ProductFilters) {
    let query = supabase.from('products').select('*');

    if (filters?.categories?.length) {
      query = query.in('category', filters.categories);
    }
    if (filters?.brands?.length) {
      query = query.in('brand', filters.brands);
    }
    if (filters?.priceRange) {
      query = query.gte('price', filters.priceRange[0]).lte('price', filters.priceRange[1]);
    }
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
    if (filters?.featured !== undefined) {
      query = query.eq('featured', filters.featured);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data;
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
