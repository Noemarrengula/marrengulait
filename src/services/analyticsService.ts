import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsEvent {
  event_name: string;
  event_data?: Record<string, unknown>;
  user_id?: string;
  session_id?: string;
  source?: string;
}

declare global {
  interface Window {
    gtag: (command: string, ...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

class AnalyticsService {
  private sessionId: string;
  private userId: string | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initUserId();
  }

  private generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substring(2, 15);
  }

  private async initUserId() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      this.userId = user?.id || null;
    } catch (e) {
      this.userId = null;
    }
  }

  trackEvent(eventName: string, eventData?: Record<string, unknown>) {
    const event: AnalyticsEvent = {
      event_name: eventName,
      event_data: eventData,
      user_id: this.userId || undefined,
      session_id: this.sessionId,
      source: window.location.pathname
    };

    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', eventName, eventData);
    }

    this.logToSupabase(event).catch(console.error);
  }

  private async logToSupabase(event: AnalyticsEvent) {
    try {
      await supabase.from('system.logs').insert({
        user_id: event.user_id,
        action: 'analytics_' + event.event_name,
        entity_type: 'analytics',
        details: event.event_data,
        ip_address: null,
        user_agent: navigator.userAgent
      });
    } catch (e) {
      // Silently fail
    }
  }

  // Page Views
  trackPageView(page: string, title?: string) {
    this.trackEvent('page_view', { page, title });

    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', 'G-534365491', {
        page_path: page,
        page_title: title
      });
    }
  }

  // E-commerce Events
  trackProductView(productId: string, productName: string, category?: string) {
    this.trackEvent('view_item', {
      product_id: productId,
      product_name: productName,
      category
    });
  }

  trackAddToCart(productId: string, productName: string, price: number, quantity: number) {
    this.trackEvent('add_to_cart', {
      product_id: productId,
      product_name: productName,
      value: price * quantity,
      currency: 'MZN',
      quantity
    });
  }

  trackRemoveFromCart(productId: string) {
    this.trackEvent('remove_from_cart', { product_id: productId });
  }

  trackBeginCheckout(totalValue: number, itemCount: number) {
    this.trackEvent('begin_checkout', {
      value: totalValue,
      currency: 'MZN',
      items: itemCount
    });
  }

  trackPurchase(transactionId: string, totalValue: number, items: number) {
    this.trackEvent('purchase', {
      transaction_id: transactionId,
      value: totalValue,
      currency: 'MZN',
      items
    });
  }

  trackServiceQuote(serviceName: string, level: string, value: number) {
    this.trackEvent('service_quote', {
      service_name: serviceName,
      level,
      value
    });
  }

  trackServiceRequest(serviceName: string, status: string) {
    this.trackEvent('service_request', {
      service_name: serviceName,
      status
    });
  }

  // User Events
  trackSignUp(method: string) {
    this.trackEvent('sign_up', { method });
  }

  trackLogin(method: string) {
    this.trackEvent('login', { method });
  }

  // Search
  trackSearch(searchTerm: string, resultsCount: number) {
    this.trackEvent('search', {
      search_term: searchTerm,
      results_count: resultsCount
    });
  }

  // CTAs
  trackWhatsAppClick(source: string) {
    this.trackEvent('whatsapp_click', { source });
  }

  trackCallClick(phoneNumber: string) {
    this.trackEvent('call_click', { phone_number: phoneNumber });
  }
}

export const analytics = new AnalyticsService();

export default analytics;