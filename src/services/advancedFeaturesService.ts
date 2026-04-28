import { supabase } from '@/integrations/supabase/client';

export const advancedFeaturesService = {
  // Perguntas & Respostas
  async getProductQuestions(productId: string) {
    const { data, error } = await supabase
      .from('product_questions')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createQuestion(productId: string, question: string) {
    const { data, error } = await supabase
      .from('product_questions')
      .insert([{ product_id: productId, question }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Histórico de Preços
  async getPriceHistory(productId: string) {
    const { data, error } = await supabase
      .from('price_history')
      .select('*')
      .eq('product_id', productId)
      .order('recorded_at', { ascending: false })
      .limit(30);
    if (error) throw error;
    return data;
  },

  // Produtos Visualizados Recentemente
  async getRecentlyViewed() {
    const { data, error } = await supabase
      .from('recently_viewed')
      .select('*, product:products(*)')
      .order('viewed_at', { ascending: false })
      .limit(10);
    if (error) throw error;
    return data;
  },

  // Pontos de Fidelidade
  async getLoyaltyPoints() {
    const { data, error } = await supabase
      .from('loyalty_points')
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },

  async getPointsTransactions() {
    const { data, error } = await supabase
      .from('points_transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    if (error) throw error;
    return data;
  },

  // Alertas de Preço
  async createPriceAlert(productId: string, targetPrice: number) {
    const { data, error } = await supabase
      .from('price_alerts')
      .insert([{ product_id: productId, target_price: targetPrice }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getPriceAlerts() {
    const { data, error } = await supabase
      .from('price_alerts')
      .select('*, product:products(*)')
      .eq('active', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async deletePriceAlert(id: string) {
    const { error } = await supabase
      .from('price_alerts')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Badges de Produtos
  async getProductBadges(productId: string) {
    const { data, error } = await supabase
      .from('product_badges')
      .select('*')
      .eq('product_id', productId)
      .or('expires_at.is.null,expires_at.gt.now()');
    if (error) throw error;
    return data;
  },

  // Métodos de Pagamento
  async getPaymentMethods() {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .order('is_default', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createPaymentMethod(type: string, details: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('payment_methods')
      .insert([{ type, details }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deletePaymentMethod(id: string) {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
