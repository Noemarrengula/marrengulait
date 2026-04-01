import { supabase } from '@/integrations/supabase/client';

export interface WhatsAppAlert {
  id?: string;
  user_id?: string;
  phone: string;
  product_id?: string;
  alert_type: 'movement' | 'stock' | 'price' | 'new_product';
  message: string;
  is_active: boolean;
  created_at?: string;
}

export const whatsappService = {
  async requestAlert(alert: Omit<WhatsAppAlert, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('whatsapp_alerts')
      .insert([alert])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserAlerts(userId: string) {
    const { data, error } = await supabase
      .from('whatsapp_alerts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error) throw error;
    return data;
  },

  async deleteAlert(alertId: string) {
    const { error } = await supabase
      .from('whatsapp_alerts')
      .update({ is_active: false })
      .eq('id', alertId);

    if (error) throw error;
  },

  formatWhatsAppMessage(type: 'movement' | 'stock' | 'price' | 'new_product', productName: string, details?: string) {
    const messages = {
      movement: `🔔 Alerta de Movimento!\n\nCâmara: ${productName}\n${details || 'Movimento detectado'}\n\nAceda à app para ver mais detalhes.`,
      stock: `📦 Stock Alert!\n\nProduto: ${productName}\n${details || 'Stock disponível!'}\n\nCompre agora!`,
      price: `💰 Alerta de Preço!\n\nProduto: ${productName}\n${details || 'Preço reducido!'}\n\nAproveite a oferta!`,
      new_product: `🆕 Novo Produto!\n\n${productName}\n${details || 'Confira agora!'}\n\nNova chegada na Marrengula-IT!`
    };

    return messages[type];
  },

  openWhatsApp(phone: string, message: string) {
    const cleanPhone = phone.replace(/\D/g, '');
    const url = `https://wa.me/258${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  },

  requestCCTVQuote(phone: string, cameras: number, hasInstallation: boolean) {
    const message = `🏠 Olá! Gostaria de um orçamento para CCTV:

📹 Câmaras: ${cameras}
${hasInstallation ? '✅ Com instalação profissional' : '❌ Sem instalação'}
📍 Localização: Maputo, Moçambique

Por favor, enviem-me um orçamento detalhado.`;

    this.openWhatsApp(phone, message);
  }
};
