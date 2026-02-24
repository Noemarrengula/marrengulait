import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

const GoogleAnalytics = () => {
  const location = useLocation();
  const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Substitua pelo seu ID

  useEffect(() => {
    // Carregar Google Analytics
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}');
    `;
    document.head.appendChild(script2);

    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []);

  // Rastrear mudanças de página
  useEffect(() => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
};

// Funções auxiliares para eventos personalizados
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export const trackPurchase = (transactionId: string, value: number, items: any[]) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: 'MZN',
      items: items,
    });
  }
};

export const trackAddToCart = (item: any) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'add_to_cart', {
      currency: 'MZN',
      value: item.price,
      items: [item],
    });
  }
};

export default GoogleAnalytics;

// INSTRUÇÕES:
// 1. Acesse https://analytics.google.com/
// 2. Crie uma propriedade GA4
// 3. Copie o Measurement ID (G-XXXXXXXXXX)
// 4. Substitua acima
// 5. Importe no App.tsx
