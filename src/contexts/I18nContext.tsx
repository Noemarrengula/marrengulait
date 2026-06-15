import React, { createContext, useContext, useState, useEffect } from "react";

export type Translations = { [key: string]: string };

const resources: Record<string, Translations> = {
  "pt-MZ": {
    "admin_panel": "Painel de Administração",
    "welcome": "Bem-vindo, {{email}}",
    "products": "Produtos",
    "orders": "Pedidos",
    "users": "Utilizadores",
    "total_sales": "Vendas Totais",
    "questions": "Perguntas",
    "price_alerts": "Alertas de Preço",
    "badges": "Badges",
    "add_new_product": "Adicionar Novo Produto",
    "filter_products": "Filtrar produtos...",
    "export_csv": "Exportar CSV",
    "loading": "Carregando",
    "access_denied": "Acesso Negado",
    "order_number": "Número do Pedido",
    "order_status": "Status do Pedido",
    "track_order": "Rastrear Pedido",
    "payment": "Pagamento",
    "method": "Método",
    "language": "Idioma",
    "currency": "Moeda"
  },
  "en-US": {
    "admin_panel": "Admin Panel",
    "welcome": "Welcome, {{email}}",
    "track_order": "Track Order",
    "help": "Help",
    "mobile_menu": "Mobile Menu",
    "logout": "Logout",
    "login": "Login",
    "products": "Products",
    "orders": "Orders",
    "users": "Users",
    "total_sales": "Total Sales",
    "questions": "Questions",
    "price_alerts": "Price Alerts",
    "badges": "Badges",
    "add_new_product": "Add New Product",
    "filter_products": "Filter products...",
    "export_csv": "Export CSV",
    "loading": "Loading",
    "access_denied": "Access Denied",
    "order_number": "Order Number",
    "order_status": "Order Status",
    "payment": "Payment",
    "method": "Method",
    "language": "Language",
    "currency": "Currency"
  }
};

const I18nContext = createContext<{ locale: string; t: (key: string, vars?: Record<string, string>) => string } | undefined>(undefined);

export const I18nProvider: React.FC<{ locale: string; children: React.ReactNode }> = ({ locale, children }) => {
  const [current, setCurrent] = useState(locale);

  useEffect(() => {
    setCurrent(locale);
  }, [locale]);

  const t = (key: string, vars: Record<string, string> = {}) => {
    const str = resources[current]?.[key] || key;
    return Object.entries(vars).reduce((s, [k,v]) => s.replace(`{{${k}}}`, v), str);
  };

  return <I18nContext.Provider value={{ locale: current, t }}>{children}</I18nContext.Provider>;
};

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be inside I18nProvider");
  return ctx;
}
