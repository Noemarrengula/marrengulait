import { supabase } from '@/integrations/supabase/client';

export interface Quote {
  id: string;
  quote_number: string;
  client_id: string | null;
  user_id: string | null;
  service_id: string;
  service_level: 'basic' | 'professional' | 'enterprise';
  quantity: number;
  unit_price: number;
  total_price: number;
  notes: string | null;
  validity_days: number;
  valid_until: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'converted' | 'expired';
  created_at: string;
  services?: {
    name: string;
    description: string;
    category: string;
  };
}

export interface QuoteResult {
  quote_id: string;
  quote_number: string;
  service_name: string;
  service_level: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  valid_until: string;
}

export interface CalculateQuoteParams {
  serviceId: string;
  quantity?: number;
  level?: 'basic' | 'professional' | 'enterprise';
}

export const quoteService = {
  async calculateQuote(params: CalculateQuoteParams): Promise<QuoteResult> {
    const { serviceId, quantity = 1, level = 'basic' } = params;
    
    try {
      const { data, error } = await supabase.rpc('calculate_quote', {
        p_service_id: serviceId,
        p_quantity: quantity,
        p_level: level,
        p_user_id: (await supabase.auth.getUser()).data.user?.id || null
      });

      if (error) throw error;
      if (!data || data.length === 0) throw new Error('Nenhum resultado retornado');

      return data[0];
    } catch {
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 15);
      
      return {
        quote_id: crypto.randomUUID(),
        quote_number: `ORC-${Date.now().toString(36).toUpperCase()}`,
        service_name: 'Serviço Marrengula-IT',
        service_level: level,
        quantity,
        unit_price: 0,
        total_price: 0,
        valid_until: validUntil.toISOString()
      };
    }
  },

  async getQuotes(): Promise<Quote[]> {
    try {
      const { data, error } = await supabase
        .from('business.quotes')
        .select('*, services(name, description, category)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch {
      return [];
    }
  },

  async getQuoteById(id: string): Promise<Quote | null> {
    try {
      const { data, error } = await supabase
        .from('business.quotes')
        .select('*, services(name, description, category)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch {
      return null;
    }
  },

  async getQuoteByNumber(quoteNumber: string): Promise<Quote | null> {
    const { data, error } = await supabase
      .from('quotes')
      .select('*, services(name, description, category)')
      .eq('quote_number', quoteNumber)
      .single();

    if (error) throw new Error(`Erro ao buscar orçamento: ${error.message}`);
    return data;
  },

  async updateQuoteStatus(id: string, status: Quote['status']): Promise<void> {
    const { error } = await supabase
      .from('quotes')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new Error(`Erro ao atualizar orçamento: ${error.message}`);
  },

  async deleteQuote(id: string): Promise<void> {
    const { error } = await supabase
      .from('quotes')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Erro ao eliminar orçamento: ${error.message}`);
  },

  async getPendingQuotes(): Promise<Quote[]> {
    const { data, error } = await supabase
      .from('quotes')
      .select('*, services(name, description, category)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Erro ao buscar orçamentos pendentes: ${error.message}`);
    return data || [];
  },

  async getConvertedQuotes(): Promise<Quote[]> {
    const { data, error } = await supabase
      .from('quotes')
      .select('*, services(name, description, category)')
      .eq('status', 'converted')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Erro ao buscar orçamentos convertidos: ${error.message}`);
    return data || [];
  },

  isQuoteValid(quote: Quote): boolean {
    if (!quote.valid_until) return false;
    return new Date(quote.valid_until) > new Date();
  },

  formatQuoteNumber(quoteNumber: string): string {
    return quoteNumber;
  },

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    }).format(price);
  }
};

export default quoteService;