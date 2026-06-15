import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    
    if (!publishableKey) {
      console.warn('Stripe publishable key not found. Payment features will be disabled.');
      return Promise.resolve(null);
    }
    
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
export const IS_STRIPE_CONFIGURED = !!STRIPE_PUBLISHABLE_KEY;

export const CURRENCY_MAP: Record<string, string> = {
  MZN: 'MZN',
  USD: 'USD',
  EUR: 'EUR',
  ZAR: 'ZAR',
};

export const STRIPE_APPEARANCE = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#FF3131',
    colorBackground: '#ffffff',
    colorText: '#000000',
    colorDanger: '#ef4444',
    fontFamily: 'system-ui, sans-serif',
    borderRadius: '8px',
    spacingUnit: '4px',
  },
  rules: {
    '.Input': {
      border: '1px solid #e5e5e5',
      boxShadow: 'none',
    },
    '.Input:focus': {
      border: '1px solid #FF3131',
      boxShadow: '0 0 0 2px rgba(255, 49, 49, 0.1)',
    },
    '.Label': {
      fontWeight: '500',
      marginBottom: '8px',
    },
    '.Error': {
      color: '#ef4444',
      fontSize: '14px',
    },
  },
};
