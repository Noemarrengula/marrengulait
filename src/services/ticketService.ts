import { supabase } from '@/integrations/supabase/client';

export interface Ticket {
  id: string;
  ticket_number: string;
  client_id: string | null;
  user_id: string | null;
  category: 'support' | 'billing' | 'technical' | 'sales' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assigned_to: string | null;
  resolution: string | null;
  client_rating: number | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  profiles?: {
    full_name: string;
  };
}

export interface CreateTicketParams {
  category: Ticket['category'];
  subject: string;
  description: string;
  priority?: Ticket['priority'];
}

export interface TicketStats {
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
  closed: number;
}

export const ticketService = {
  async createTicket(params: CreateTicketParams): Promise<Ticket> {
    const { category, subject, description, priority = 'medium' } = params;
    
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Utilizador não autenticado');

    const { data, error } = await supabase.rpc('create_ticket', {
      p_user_id: user.id,
      p_category: category,
      p_subject: subject,
      p_description: description,
      p_priority: priority
    });

    if (error) throw new Error(`Erro ao criar ticket: ${error.message}`);
    if (!data || data.length === 0) throw new Error('Nenhum resultado retornado');

    return data[0];
  },

  async getTickets(): Promise<Ticket[]> {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Erro ao buscar tickets: ${error.message}`);
    return data || [];
  },

  async getMyTickets(): Promise<Ticket[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Utilizador não autenticado');

    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Erro ao buscar tickets: ${error.message}`);
    return data || [];
  },

  async getTicketById(id: string): Promise<Ticket | null> {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(`Erro ao buscar ticket: ${error.message}`);
    return data;
  },

  async getTicketByNumber(ticketNumber: string): Promise<Ticket | null> {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('ticket_number', ticketNumber)
      .single();

    if (error) throw new Error(`Erro ao buscar ticket: ${error.message}`);
    return data;
  },

  async updateTicketStatus(id: string, status: Ticket['status'], resolution?: string): Promise<void> {
    const updates: Partial<Ticket> = { 
      status, 
      updated_at: new Date().toISOString() 
    };
    
    if (status === 'resolved' || status === 'closed') {
      updates.closed_at = new Date().toISOString();
      if (resolution) updates.resolution = resolution;
    }

    const { error } = await supabase
      .from('tickets')
      .update(updates)
      .eq('id', id);

    if (error) throw new Error(`Erro ao atualizar ticket: ${error.message}`);
  },

  async assignTicket(id: string, assignedTo: string): Promise<void> {
    const { error } = await supabase
      .from('tickets')
      .update({ 
        assigned_to: assignedTo, 
        status: 'in_progress',
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) throw new Error(`Erro ao atribuir ticket: ${error.message}`);
  },

  async rateTicket(id: string, rating: number): Promise<void> {
    if (rating < 1 || rating > 5) throw new Error('Rating deve ser entre 1 e 5');

    const { error } = await supabase
      .from('tickets')
      .update({ 
        client_rating: rating,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) throw new Error(`Erro ao avaliar ticket: ${error.message}`);
  },

  async getTicketStats(): Promise<TicketStats> {
    const { data, error } = await supabase
      .from('tickets')
      .select('status');

    if (error) throw new Error(`Erro ao buscar estatísticas: ${error.message}`);

    const stats: TicketStats = {
      total: 0,
      open: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0
    };

    (data || []).forEach((t: Ticket) => {
      stats.total++;
      if (t.status === 'open') stats.open++;
      else if (t.status === 'in_progress') stats.in_progress++;
      else if (t.status === 'resolved') stats.resolved++;
      else if (t.status === 'closed') stats.closed++;
    });

    return stats;
  },

  async getOpenTickets(): Promise<Ticket[]> {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .in('status', ['open', 'in_progress'])
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Erro ao buscar tickets abertos: ${error.message}`);
    return data || [];
  },

  async getUnassignedTickets(): Promise<Ticket[]> {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .is('assigned_to', null)
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Erro ao buscar tickets não atribuídos: ${error.message}`);
    return data || [];
  },

  getStatusLabel(status: Ticket['status']): string {
    const labels: Record<Ticket['status'], string> = {
      open: 'Aberto',
      in_progress: 'Em Progresso',
      resolved: 'Resolvido',
      closed: 'Fechado'
    };
    return labels[status];
  },

  getPriorityLabel(priority: Ticket['priority']): string {
    const labels: Record<Ticket['priority'], string> = {
      low: 'Baixa',
      medium: 'Média',
      high: 'Alta',
      urgent: 'Urgente'
    };
    return labels[priority];
  },

  getCategoryLabel(category: Ticket['category']): string {
    const labels: Record<Ticket['category'], string> = {
      support: 'Suporte',
      billing: 'Faturação',
      technical: 'Técnico',
      sales: 'Vendas',
      other: 'Outro'
    };
    return labels[category];
  },

  getStatusColor(status: Ticket['status']): string {
    const colors: Record<Ticket['status'], string> = {
      open: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status];
  },

  getPriorityColor(priority: Ticket['priority']): string {
    const colors: Record<Ticket['priority'], string> = {
      low: 'bg-gray-100 text-gray-600',
      medium: 'bg-blue-100 text-blue-600',
      high: 'bg-orange-100 text-orange-600',
      urgent: 'bg-red-100 text-red-600'
    };
    return colors[priority];
  }
};

export default ticketService;