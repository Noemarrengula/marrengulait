import { supabase } from '@/integrations/supabase/client';
import { serviceCatalog } from './serviceCatalogService';

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

// Market pricing factors for Mozambique (MZN)
const marketFactors = {
  // Volume discount tiers
  volumeDiscounts: [
    { minQty: 1, maxQty: 1, discount: 0 },
    { minQty: 2, maxQty: 5, discount: 0.05 },   // 5% discount for 2-5 units
    { minQty: 6, maxQty: 10, discount: 0.10 },  // 10% discount for 6-10 units
    { minQty: 11, maxQty: 25, discount: 0.15 }, // 15% discount for 11-25 units
    { minQty: 26, maxQty: Infinity, discount: 0.20 }, // 20% discount for 26+ units
  ],
  
  // Urgency multipliers
  urgencyMultipliers: {
    standard: 1.0,
    urgent: 1.25,    // 25% extra for urgent
    emergency: 1.50, // 50% extra for emergency
  },

  // Validity periods by service type
  validityDays: {
    default: 15,
    project: 30,      // Longer validity for projects
    monthly: 7,       // Shorter validity for monthly services
  }
};

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
      // Fallback to local calculation with market-based pricing
      const service = await serviceCatalog.getServiceById(serviceId);
      
      if (!service) {
        throw new Error('Serviço não encontrado');
      }

      // Get base price by level
      const basePrice = serviceCatalog.getPriceByLevel(service, level);
      
      // Apply volume discount
      const volumeDiscount = marketFactors.volumeDiscounts.find(
        d => quantity >= d.minQty && quantity <= d.maxQty
      )?.discount || 0;
      
      // Calculate unit price with discount
      const unitPrice = basePrice * (1 - volumeDiscount);
      
      // Calculate total
      const totalPrice = unitPrice * quantity;
      
      // Determine validity period based on service type
      const validityDays = marketFactors.validityDays[
        service.unit === 'mês' ? 'monthly' : 
        service.unit === 'projeto' ? 'project' : 'default'
      ];
      
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + validityDays);
      
      return {
        quote_id: crypto.randomUUID(),
        quote_number: `ORC-${Date.now().toString(36).toUpperCase()}`,
        service_name: service.name,
        service_level: level,
        quantity,
        unit_price: Math.round(unitPrice),
        total_price: Math.round(totalPrice),
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
  },

  // Calculate price with volume discount
  calculateVolumePrice(basePrice: number, quantity: number): { unitPrice: number; totalPrice: number; discount: number } {
    const volumeDiscount = marketFactors.volumeDiscounts.find(
      d => quantity >= d.minQty && quantity <= d.maxQty
    )?.discount || 0;

    const unitPrice = basePrice * (1 - volumeDiscount);
    const totalPrice = unitPrice * quantity;

    return {
      unitPrice: Math.round(unitPrice),
      totalPrice: Math.round(totalPrice),
      discount: volumeDiscount
    };
  },

  // Generate WhatsApp message for quote
  generateWhatsAppMessage(quote: QuoteResult, clientName?: string, notes?: string): string {
    return `📋 *PEDIDO DE ORÇAMENTO - MARRENGULA IT*\n\n` +
      `${clientName ? `👤 *Cliente:* ${clientName}\n` : ''}` +
      `🔧 *Serviço:* ${quote.service_name}\n` +
      `🎯 *Nível:* ${quote.service_level}\n` +
      `📦 *Quantidade:* ${quote.quantity}\n` +
      `💰 *Valor Total:* ${this.formatPrice(quote.total_price)}\n` +
      `📅 *Válido até:* ${new Date(quote.valid_until).toLocaleDateString('pt-MZ')}\n` +
      `${notes ? `\n📝 *Notas:* ${notes}\n` : ''}` +
      `\n_Enviado via marrengulait.com_`;
  },

  // Send quote to WhatsApp
  sendQuoteToWhatsApp(quote: QuoteResult, clientName?: string, notes?: string): void {
    const message = this.generateWhatsAppMessage(quote, clientName, notes);
    const whatsappUrl = `https://wa.me/258864738133?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }
};

export default quoteService;
