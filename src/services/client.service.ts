import { supabase } from '@/integrations/supabase/client';

export interface Client {
  id: string;
  user_id: string;
  company_name: string | null;
  nuit: string | null;
  address: string | null;
  city: string;
  province: string;
  country: string;
  contact_person: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  preferencial_payment: 'mpesa' | 'emola' | 'transfer' | 'cod' | null;
  notes: string | null;
  is_vip: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateClientParams {
  company_name?: string;
  nuit?: string;
  address?: string;
  city?: string;
  province?: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  preferencial_payment?: Client['preferencial_payment'];
}

export interface ClientStats {
  total_quotes: number;
  total_orders: number;
  open_tickets: number;
}

export const clientService = {
  async getMyClient(): Promise<Client | null> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return null;

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Erro ao buscar cliente: ${error.message}`);
    }
    return data;
  },

  async createOrUpdateClient(params: CreateClientParams): Promise<Client> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Utilizador não autenticado');

    const { data: existing } = await supabase
      .from('clients')
      .select('id')
      .eq('user_id', user.user.id)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from('clients')
        .update({ ...params, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw new Error(`Erro ao atualizar cliente: ${error.message}`);
      return data;
    } else {
      const { data, error } = await supabase
        .from('clients')
        .insert({ user_id: user.user.id, ...params })
        .select()
        .single();

      if (error) throw new Error(`Erro ao criar cliente: ${error.message}`);
      return data;
    }
  },

  async getClientById(id: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(`Erro ao buscar cliente: ${error.message}`);
    return data;
  },

  async getClientByUserId(userId: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw new Error(`Erro ao buscar cliente: ${error.message}`);
    return data;
  },

  async getAllClients(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Erro ao buscar clientes: ${error.message}`);
    return data || [];
  },

  async updateClient(id: string, params: Partial<CreateClientParams>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update({ ...params, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Erro ao atualizar cliente: ${error.message}`);
    return data;
  },

  async setVipStatus(id: string, isVip: boolean): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .update({ is_vip: isVip, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new Error(`Erro ao atualizar status VIP: ${error.message}`);
  },

  async getClientStats(clientId: string): Promise<ClientStats> {
    const [quotes, orders, tickets] = await Promise.all([
      supabase.from('quotes').select('id', { count: 'exact' }).eq('client_id', clientId),
      supabase.from('orders').select('id', { count: 'exact' }).eq('client_id', clientId),
      supabase.from('tickets').select('id', { count: 'exact' }).eq('client_id', clientId).eq('status', 'open')
    ]);

    return {
      total_quotes: quotes.count || 0,
      total_orders: orders.count || 0,
      open_tickets: tickets.count || 0
    };
  },

  async getVipClients(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('is_vip', true)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Erro ao buscar clientes VIP: ${error.message}`);
    return data || [];
  },

  formatPaymentMethod(method: Client['preferencial_payment']): string {
    const labels: Record<string, string> = {
      mpesa: 'M-Pesa',
      emola: 'E-Mola',
      transfer: 'Transferência',
      cod: 'Pagamento na Entrega'
    };
    return labels[method || ''] || 'Não definido';
  }
};

export default clientService;