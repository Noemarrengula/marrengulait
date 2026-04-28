import { supabase } from '@/integrations/supabase/client';

export interface BusinessService {
  id: string;
  code: string;
  name: string;
  description: string | null;
  category: string;
  base_price: number;
  price_basic: number;
  price_professional: number;
  price_enterprise: number;
  unit: string;
  duration_minutes: number | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceCategory {
  name: string;
  services: BusinessService[];
}

export type ServiceLevel = 'basic' | 'professional' | 'enterprise';

const mockServices: BusinessService[] = [
  { id: '1', code: 'INST-REDE', name: 'Instalação de Rede', description: 'Configuração e instalação de redes corporativas', category: 'Redes', base_price: 5000, price_basic: 5000, price_professional: 10000, price_enterprise: 25000, unit: 'projeto', duration_minutes: 480, is_active: true, is_featured: true, sort_order: 1, created_at: '', updated_at: '' },
  { id: '2', code: 'SUP-ON-SITE', name: 'Suporte Técnico On-Site', description: 'Suporte técnico presencial', category: 'Suporte', base_price: 1500, price_basic: 1500, price_professional: 3500, price_enterprise: 8000, unit: 'hora', duration_minutes: 60, is_active: true, is_featured: true, sort_order: 2, created_at: '', updated_at: '' },
  { id: '3', code: 'SUP-REMOTO', name: 'Suporte Técnico Remoto', description: 'Suporte técnico via remoto', category: 'Suporte', base_price: 500, price_basic: 500, price_professional: 1500, price_enterprise: 3500, unit: 'hora', duration_minutes: 60, is_active: true, is_featured: true, sort_order: 3, created_at: '', updated_at: '' },
  { id: '4', code: 'CONFIG-SERVIDOR', name: 'Configuração de Servidor', description: 'Instalação e configuração de servidores', category: 'Infraestrutura', base_price: 15000, price_basic: 15000, price_professional: 35000, price_enterprise: 75000, unit: 'projeto', duration_minutes: 1440, is_active: true, is_featured: true, sort_order: 4, created_at: '', updated_at: '' },
  { id: '5', code: 'CCTV-INST', name: 'Instalação de CCTV', description: 'Sistema de câmaras de segurança', category: 'Segurança', base_price: 8000, price_basic: 8000, price_professional: 18000, price_enterprise: 40000, unit: 'projeto', duration_minutes: 720, is_active: true, is_featured: true, sort_order: 5, created_at: '', updated_at: '' },
  { id: '6', code: 'BACKUP-CLOUD', name: 'Solução Backup Cloud', description: 'Configuração de backup na nuvem', category: 'Armazenamento', base_price: 3000, price_basic: 3000, price_professional: 6000, price_enterprise: 12000, unit: 'mês', duration_minutes: null, is_active: true, is_featured: false, sort_order: 6, created_at: '', updated_at: '' },
  { id: '7', code: 'CONS-IT', name: 'Consultoria IT', description: 'Consultoria em tecnologia da informação', category: 'Consultoria', base_price: 5000, price_basic: 5000, price_professional: 12000, price_enterprise: 30000, unit: 'projeto', duration_minutes: 240, is_active: true, is_featured: true, sort_order: 7, created_at: '', updated_at: '' },
  { id: '8', code: 'SEG-REDE', name: 'Segurança de Rede', description: 'Firewall e proteção de rede', category: 'Segurança', base_price: 6000, price_basic: 6000, price_professional: 15000, price_enterprise: 35000, unit: 'projeto', duration_minutes: 480, is_active: true, is_featured: false, sort_order: 8, created_at: '', updated_at: '' },
  { id: '9', code: 'MIG-DADOS', name: 'Migração de Dados', description: 'Migração e transferência de dados', category: 'Infraestrutura', base_price: 4000, price_basic: 4000, price_professional: 10000, price_enterprise: 25000, unit: 'projeto', duration_minutes: 720, is_active: true, is_featured: false, sort_order: 9, created_at: '', updated_at: '' },
  { id: '10', code: 'MANUT-HW', name: 'Manutenção de Hardware', description: 'Manutenção preventiva e corretiva', category: 'Suporte', base_price: 1000, price_basic: 1000, price_professional: 2500, price_enterprise: 5000, unit: 'visita', duration_minutes: null, is_active: true, is_featured: false, sort_order: 10, created_at: '', updated_at: '' },
  { id: '11', code: 'WIFI-EMPRESA', name: 'Rede WiFi Empresarial', description: 'Configuração WiFi para empresas', category: 'Redes', base_price: 4500, price_basic: 4500, price_professional: 10000, price_enterprise: 22000, unit: 'projeto', duration_minutes: 360, is_active: true, is_featured: true, sort_order: 11, created_at: '', updated_at: '' },
  { id: '12', code: 'VOIP-SETUP', name: 'Configuração VoIP', description: 'Sistema de telefonia IP', category: 'Infraestrutura', base_price: 3500, price_basic: 3500, price_professional: 8000, price_enterprise: 18000, unit: 'projeto', duration_minutes: 240, is_active: true, is_featured: false, sort_order: 12, created_at: '', updated_at: '' },
];

export const serviceCatalog = {
  async getServices(): Promise<BusinessService[]> {
    try {
      const { data, error } = await supabase
        .from('business.services')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data || mockServices;
    } catch (error) {
      console.warn('Usando dados mock de serviços (tabela não encontrada)');
      return mockServices;
    }
  },

  async getFeaturedServices(): Promise<BusinessService[]> {
    try {
      const { data, error } = await supabase
        .from('business.services')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data || mockServices.filter(s => s.is_featured);
    } catch {
      return mockServices.filter(s => s.is_featured);
    }
  },

  async getServicesByCategory(category: string): Promise<BusinessService[]> {
    try {
      const { data, error } = await supabase
        .from('business.services')
        .select('*')
        .eq('is_active', true)
        .eq('category', category)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data || mockServices.filter(s => s.category === category);
    } catch {
      return mockServices.filter(s => s.category === category);
    }
  },

  async getServiceById(id: string): Promise<BusinessService | null> {
    try {
      const { data, error } = await supabase
        .from('business.services')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch {
      return mockServices.find(s => s.id === id) || null;
    }
  },

  async getServiceByCode(code: string): Promise<BusinessService | null> {
    try {
      const { data, error } = await supabase
        .from('business.services')
        .select('*')
        .eq('code', code)
        .single();

      if (error) throw error;
      return data;
    } catch {
      return mockServices.find(s => s.code === code) || null;
    }
  },

  async getCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('business.services')
        .select('category')
        .eq('is_active', true);

      if (error) throw error;
      const rawCategories = data as Array<{ category: string }> || [];
      const categoryStrings = rawCategories.map((s) => s.category);
      const uniqueCategories = [...new Set(categoryStrings)];
      return uniqueCategories.sort() as string[];
    } catch {
      const categories = [...new Set(mockServices.map(s => s.category))];
      return categories.sort();
    }
  },

  async getServicesGroupedByCategory(): Promise<ServiceCategory[]> {
    const services = await this.getServices();
    
    const grouped: Record<string, BusinessService[]> = {};
    services.forEach(service => {
      if (!grouped[service.category]) {
        grouped[service.category] = [];
      }
      grouped[service.category].push(service);
    });

    return Object.entries(grouped).map(([name, services]) => ({
      name,
      services
    }));
  },

  getPriceByLevel(service: BusinessService, level: ServiceLevel): number {
    switch (level) {
      case 'basic': return service.price_basic;
      case 'professional': return service.price_professional;
      case 'enterprise': return service.price_enterprise;
      default: return service.price_basic;
    }
  },

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN',
      minimumFractionDigits: 0
    }).format(price);
  },

  formatDuration(minutes: number | null): string {
    if (!minutes) return 'A definir';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  },

  getLevelLabel(level: ServiceLevel): string {
    const labels: Record<ServiceLevel, string> = {
      basic: 'Básico',
      professional: 'Profissional',
      enterprise: 'Enterprise'
    };
    return labels[level];
  },

  getLevelDescription(level: ServiceLevel): string {
    const descriptions: Record<ServiceLevel, string> = {
      basic: 'Solução essencial para necessidades básicas',
      professional: 'Solução completa com suporte prioritário',
      enterprise: 'Solução completa com SLA e suporte dedicado'
    };
    return descriptions[level];
  },

  getUnitLabel(unit: string): string {
    const labels: Record<string, string> = {
      unidade: 'por unidade',
      hora: 'por hora',
      dia: 'por dia',
      metro: 'por metro',
      projeto: 'por projeto'
    };
    return labels[unit] || unit;
  },

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'Redes': 'wifi',
      'Segurança': 'shield',
      'Suporte': 'headset',
      'Infraestrutura': 'server',
      'Consultoria': 'message-circle',
      'Desenvolvimento': 'code',
      'Armazenamento': 'hard-drive'
    };
    return icons[category] || 'tool';
  },

  calculateTotalPrice(service: BusinessService, quantity: number, level: ServiceLevel): number {
    return this.getPriceByLevel(service, level) * quantity;
  },

  generatePriceComparison(service: BusinessService): { level: ServiceLevel; price: number }[] {
    return [
      { level: 'basic', price: service.price_basic },
      { level: 'professional', price: service.price_professional },
      { level: 'enterprise', price: service.price_enterprise }
    ];
  }
};

export default serviceCatalog;