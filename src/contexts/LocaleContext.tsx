import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSystemPreferences, SystemPreferences } from '@/hooks/useSystemPreferences';

interface LocaleContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string) => string;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date | string) => string;
  formatNumber: (num: number) => string;
  isSystemLocale: boolean;
  setSystemLocale: () => void;
  availableLocales: { code: string; name: string; flag: string }[];
}

const translations: Record<string, Record<string, string>> = {
  pt: {
    add_to_cart: 'Adicionar ao carrinho',
    buy_now: 'Comprar agora',
    view_details: 'Ver detalhes',
    add_to_wishlist: 'Adicionar à wishlist',
    remove_from_wishlist: 'Remover da wishlist',
    out_of_stock: 'Esgotado',
    in_stock: 'Em stock',
    low_stock: 'Stock limitado',
    sale: 'Promoção',
    new: 'Novo',
    featured: 'Destaque',
    best_sellers: 'Mais vendidos',
    new_arrivals: 'Novidades',
    categories: 'Categorias',
    search: 'Pesquisar...',
    filter: 'Filtrar',
    sort_by: 'Ordenar por',
    price_low_high: 'Preço: Baixo a Alto',
    price_high_low: 'Preço: Alto a Baixo',
    newest: 'Mais recentes',
    all_products: 'Todos os Produtos',
    contact_us: 'Contacte-nos',
    about_us: 'Sobre Nós',
    faq: 'Perguntas Frequentes',
    shipping: 'Envio',
    returns: 'Devoluções',
    privacy: 'Privacidade',
    terms: 'Termos',
    checkout: 'Finalizar Compra',
    cart: 'Carrinho',
    wishlist: 'Lista de Desejos',
    my_account: 'A Minha Conta',
    orders: 'Encomendas',
    settings: 'Definições',
    logout: 'Sair',
    login: 'Iniciar Sessão',
    register: 'Criar Conta',
    welcome: 'Bem-vindo',
    language: 'Idioma',
    currency: 'Moeda',
    theme: 'Tema',
    light_mode: 'Modo Claro',
    dark_mode: 'Modo Escuro',
    system: 'Sistema',
    reviews: 'Avaliações',
    write_review: 'Escrever Avaliação',
    verified_purchase: 'Compra Verificada',
    helpful: 'Útil',
    reply: 'Responder',
    share: 'Partilhar',
    related_products: 'Produtos Relacionados',
    you_may_also_like: 'Também pode gostar',
    recently_viewed: 'Vistos Recentemente',
    continue_shopping: 'Continuar a Comprar',
    subtotal: 'Subtotal',
    shipping_cost: 'Custo de Envio',
    total: 'Total',
    apply_coupon: 'Aplicar Cupão',
    remove_coupon: 'Remover Cupão',
    invalid_coupon: 'Cupão inválido',
    coupon_applied: 'Cupão aplicado',
    order_placed: 'Encomenda realizada',
    order_confirmed: 'Encomenda confirmada',
    order_shipped: 'Encomenda enviada',
    order_delivered: 'Encomenda entregue',
    payment_methods: 'Métodos de Pagamento',
    credit_card: 'Cartão de Crédito',
    paypal: 'PayPal',
    mpesa: 'M-Pesa',
    place_order: 'Finalizar Encomenda',
    processing: 'A processar...',
    thank_you: 'Obrigado pela sua encomenda!',
    order_number: 'Número da Encomenda',
    email_sent: 'Foi enviado um email de confirmação',
    track_order: 'Acompanhar Encomenda',
    free_shipping: 'Envio Gratuito',
    secure_payment: 'Pagamento Seguro',
    money_back: 'Garantia de Devolução',
    support_24_7: 'Suporte 24/7',
  },
  en: {
    add_to_cart: 'Add to cart',
    buy_now: 'Buy now',
    view_details: 'View details',
    add_to_wishlist: 'Add to wishlist',
    remove_from_wishlist: 'Remove from wishlist',
    out_of_stock: 'Out of stock',
    in_stock: 'In stock',
    low_stock: 'Limited stock',
    sale: 'Sale',
    new: 'New',
    featured: 'Featured',
    best_sellers: 'Best Sellers',
    new_arrivals: 'New Arrivals',
    categories: 'Categories',
    search: 'Search...',
    filter: 'Filter',
    sort_by: 'Sort by',
    price_low_high: 'Price: Low to High',
    price_high_low: 'Price: High to Low',
    newest: 'Newest',
    all_products: 'All Products',
    contact_us: 'Contact Us',
    about_us: 'About Us',
    faq: 'FAQ',
    shipping: 'Shipping',
    returns: 'Returns',
    privacy: 'Privacy',
    terms: 'Terms',
    checkout: 'Checkout',
    cart: 'Cart',
    wishlist: 'Wishlist',
    my_account: 'My Account',
    orders: 'Orders',
    settings: 'Settings',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    welcome: 'Welcome',
    language: 'Language',
    currency: 'Currency',
    theme: 'Theme',
    light_mode: 'Light Mode',
    dark_mode: 'Dark Mode',
    system: 'System',
    reviews: 'Reviews',
    write_review: 'Write Review',
    verified_purchase: 'Verified Purchase',
    helpful: 'Helpful',
    reply: 'Reply',
    share: 'Share',
    related_products: 'Related Products',
    you_may_also_like: 'You May Also Like',
    recently_viewed: 'Recently Viewed',
    continue_shopping: 'Continue Shopping',
    subtotal: 'Subtotal',
    shipping_cost: 'Shipping Cost',
    total: 'Total',
    apply_coupon: 'Apply Coupon',
    remove_coupon: 'Remove Coupon',
    invalid_coupon: 'Invalid coupon',
    coupon_applied: 'Coupon applied',
    order_placed: 'Order Placed',
    order_confirmed: 'Order Confirmed',
    order_shipped: 'Order Shipped',
    order_delivered: 'Order Delivered',
    payment_methods: 'Payment Methods',
    credit_card: 'Credit Card',
    paypal: 'PayPal',
    mpesa: 'M-Pesa',
    place_order: 'Place Order',
    processing: 'Processing...',
    thank_you: 'Thank you for your order!',
    order_number: 'Order Number',
    email_sent: 'Confirmation email sent',
    track_order: 'Track Order',
    free_shipping: 'Free Shipping',
    secure_payment: 'Secure Payment',
    money_back: 'Money Back',
    support_24_7: 'Support 24/7',
  },
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const { preferences, setPreference, isSystem } = useSystemPreferences();
  const [locale, setLocaleState] = useState(preferences.locale);

  useEffect(() => {
    setLocaleState(preferences.locale);
  }, [preferences.locale]);

  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale);
    const lang = newLocale.split('-')[0];
    setPreference('locale', newLocale, false);
    setPreference('language', lang, false);
    setPreference('currency', lang === 'pt' ? 'MZN' : 'USD', false);
  };

  const setSystemLocale = () => {
    const { locale, language, currency } = preferences;
    setLocaleState(locale);
    setPreference('locale', locale, true);
    setPreference('language', language, true);
    setPreference('currency', currency, true);
  };

  const t = (key: string): string => {
    const lang = preferences.language;
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat(preferences.locale, {
      style: 'currency',
      currency: preferences.currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(preferences.locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat(preferences.locale).format(num);
  };

  const availableLocales = [
    { code: 'pt-MZ', name: 'Português', flag: '🇲🇿' },
    { code: 'en-US', name: 'English', flag: '🇬🇧' },
    { code: 'es-MZ', name: 'Español', flag: '🇪🇸' },
  ];

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        t,
        formatCurrency,
        formatDate,
        formatNumber,
        isSystemLocale: isSystem.locale,
        setSystemLocale,
        availableLocales,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
